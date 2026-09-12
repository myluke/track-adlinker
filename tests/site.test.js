import test from 'node:test';
import assert from 'node:assert/strict';
import { estimate } from '../src/lib/calculator.js';
import { config, applicationLink, validateConfig, releaseIssues } from '../src/lib/config.js';
import { getCopy, locales } from '../src/lib/i18n.js';

const input = { mode:'landing', visitors:'1000', accounts:'1', intent:'100', engaged:'20', reengaged:'0', monthly:'10.00', includedAccounts:'0', extraAccount:'1.00', uvCredit:'0', eventCredit:'0', visitorRate:'0.01', intentRate:'0.20', engagedRate:'0.50', reengagedRate:'0.30' };

test('quote totals use deepest-stage billing, independent re-engagement and credits', () => {
  // 10 plan + 1 account + 10 UV + (80 × (.20 − .01) + 20 × (.50 − .01)) = 46.
  assert.deepEqual(estimate(input), {monthly:1000,account:100,visitor:1000,event:2500,total:4600});
  assert.equal(estimate({...input, engaged:'100'}).event, 4900);
  assert.equal(estimate({...input, reengaged:'10'}).event, 2800);
  assert.equal(estimate({...input, visitorRate:'1',reengaged:'10'}).event, 300);
  assert.equal(estimate({...input, includedAccounts:'2',uvCredit:'99',eventCredit:'99'}).total, 1000);
  assert.equal(estimate({...input, mode:'direct',visitors:'',visitorRate:'',uvCredit:''}).total, 3700);
});

test('configured plans match the public calculator and keep per-plan UV rates', () => {
  // ConTrack public calculator, 2026-09-12: 50k UV, 10 WA, 2k intent, 500 engaged, 10 re-engagements.
  const expected = [
    ['pay-as-you-go', 296800, 161800, 3000],
    ['basic', 256700, 172700, 20000],
    ['pro', 225200, 230200, 60000],
    ['flagship', 449900, 449900, 200000]
  ];
  assert.equal(config.pricing.plans.length, expected.length);
  for (const [id, landing, direct, includedUV] of expected) {
    const plan = config.pricing.plans.find((p) => p.id === id);
    assert.ok(plan);
    const rates = config.pricing.eventPrices;
    const quoted = {
      ...input, visitors:'50000', accounts:'10', intent:'2000', engaged:'500', reengaged:'10',
      monthly:String(plan.monthlyMinor / 100), includedAccounts:plan.includedAccounts,
      extraAccount:String(plan.extraAccountMinor / 100), visitorRate:String(plan.visitorTenThousandths / 10000),
      uvCredit:String(plan.uvCreditMinor / 100), eventCredit:String(plan.eventCreditMinor / 100),
      intentRate:String(rates.intentTenThousandths / 10000), engagedRate:String(rates.engagedTenThousandths / 10000), reengagedRate:String(rates.reengagedTenThousandths / 10000)
    };
    assert.equal(estimate(quoted).total, landing, String(id));
    assert.equal(estimate({...quoted,mode:'direct'}).total, direct, String(id));
    assert.equal(estimate({...quoted,visitors:String(includedUV)}).visitor, 0);
    assert.equal(estimate({...quoted,visitors:String(Number(includedUV) + 1000)}).visitor, plan.visitorTenThousandths * 10);
    // 默认聊天量不可凭空产生费用，尤其是基础版直跳的 5 个账号、0 次聊天场景。
    const defaultQuote = {...quoted, ...config.pricing.calculatorDefaults, mode:'direct'};
    assert.equal(estimate(defaultQuote).event, 0, `${id}: no assumed conversations`);
    if (id === 'basic') {
      assert.deepEqual(estimate(defaultQuote), {monthly:79900,account:0,visitor:0,event:0,total:79900});
      assert.equal(estimate({...defaultQuote,intent:600}).total, 79900);
      assert.equal(estimate({...defaultQuote,intent:1000}).total, 87900);
    }
    for (const {code} of locales) assert.ok(plan.name[code]?.trim());
  }
});

test('fractional unit rates round once per cost category and reject overflow', () => {
  assert.equal(estimate({...input,visitors:'3',visitorRate:'0.0033'}).visitor, 1);
  assert.equal(estimate({...input,visitors:'1',visitorRate:'0.0049'}).visitor, 0);
  assert.equal(estimate({...input,visitors:'1',visitorRate:'0.0050'}).visitor, 1);
  assert.throws(() => estimate({...input,visitors:'1000000000',visitorRate:'9999999'}), /overflow/);
});

test('invalid inputs never turn into zero or a valid-looking total', () => {
  for (const value of ['', '-1','1.2','NaN','Infinity','1e3','1000000001']) assert.throws(() => estimate({...input,accounts:value}));
  for (const value of ['', '-1','NaN','1e2','0.00001','<script>']) assert.throws(() => estimate({...input,intentRate:value}));
  assert.throws(() => estimate({...input,engaged:'101'}), /funnel/);
  assert.throws(() => estimate({...input,mode:'unknown'}), /mode/);
  assert.equal(estimate({...input,monthly:'0',extraAccount:'0',visitorRate:'0',intentRate:'0',engagedRate:'0',reengagedRate:'0'}).total, 0);
});

test('missing application fails closed; configured links retain the intended origin', () => {
  const value = structuredClone(config);
  value.urls.application = ''; value.urls.registrationPath = ''; value.urls.signInPath = '';
  assert.equal(applicationLink('registrationPath', value), null);
  value.urls.application = 'https://app.example.com'; value.urls.registrationPath = '/zh-hans/register?ref=agency';
  assert.equal(applicationLink('registrationPath', value), 'https://app.example.com/zh-hans/register?ref=agency');
  for (const path of ['//evil.example','/\\evil.example','javascript:alert(1)','/%2f%2fevil.example','/%0aevil']) {
    assert.throws(() => validateConfig({...value,urls:{...value.urls,registrationPath:path}}));
  }
  for (const url of ['http://example.com','https://u:p@example.com','https://example.com/?secret=x','https://example.com/app']) assert.throws(() => validateConfig({...value,urls:{...value.urls,application:url}}));
});

test('public config rejects secrets, malformed values and unconfirmed financial contracts', () => {
  assert.throws(() => validateConfig({...structuredClone(config),apiKey:'not-a-real-key'}));
  assert.throws(() => validateConfig({...config,appearance:{...config.appearance,accentColor:'red; display:none'}}));
  assert.throws(() => validateConfig({...config,contact:{supportEmail:'a?bcc=b@example.com'}}));
  assert.throws(() => validateConfig({...config,legal:{...config.legal,effectiveDate:'2026-02-30'}}));
  assert.throws(() => validateConfig({...config,pricing:{...config.pricing,confirmed:true,plans:[]}}));
  assert.throws(() => validateConfig({...config,pricing:{...config.pricing,eventPrices:{...config.pricing.eventPrices,intentTenThousandths:-1}}}));
  assert.throws(() => validateConfig({...config,pricing:{...config.pricing,eventPrices:{...config.pricing.eventPrices,intentTenThousandths:null}}}));
  for (const visitorTenThousandths of [-1, null, undefined, 0.03]) {
    assert.throws(() => validateConfig({...config,pricing:{...config.pricing,plans:[{...config.pricing.plans[0],visitorTenThousandths}]}}));
  }
  assert.throws(() => validateConfig({...config,pricing:{...config.pricing,calculatorDefaults:{...config.pricing.calculatorDefaults,engaged:1001,intent:1000}}}));
});

test('release readiness is distinct from a local build', () => {
  const value = structuredClone(config);
  value.urls.application = ''; value.urls.registrationPath = ''; value.urls.signInPath = '';
  value.contact.supportEmail = ''; value.legal = {entity:'',governingLaw:'',effectiveDate:'',reviewed:false}; value.pricing.confirmed = false;
  assert.equal(releaseIssues(value).length, 7);
  value.urls.application = 'https://app.example.com'; value.urls.registrationPath = '/register';
  value.contact.supportEmail = 'support@example.com'; value.legal = {entity:'Example',governingLaw:'Example jurisdiction',effectiveDate:'2026-09-11',reviewed:true};
  value.pricing.plans = [{id:'example',name:{en:'Example'},monthlyMinor:1000,includedAccounts:1,extraAccountMinor:100,visitorTenThousandths:100,uvIncluded:1000,uvCreditMinor:200,eventCreditMinor:300}];
  value.pricing.eventPrices = {intentTenThousandths:2000,engagedTenThousandths:5000,reengagedTenThousandths:3000}; value.pricing.confirmed = true;
  assert.deepEqual(releaseIssues(value), []);
});

test('all seven languages include the same pages, calculator labels and legal sections', () => {
  const shape = (value) => Array.isArray(value) ? value.map(shape) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key,item]) => [key,shape(item)])) : typeof value;
  assert.equal(locales.length, 7);
  const expected = shape(getCopy('en'));
  for (const {code} of locales) {
    assert.deepEqual(shape(getCopy(code)), expected, code);
    const copy = getCopy(code);
    assert.equal(copy.legal.terms.length, 4); assert.equal(copy.legal.privacy.length, 4); assert.equal(copy.calc.rates.length, 9);
    assert.ok(copy.headline.join(' ').trim());
  }
});

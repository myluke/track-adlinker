import raw from '../../config.json' with { type: 'json' };

/** @typedef {{id:string,name:Record<string,string>,monthlyMinor:number,includedAccounts:number,extraAccountMinor:number,visitorTenThousandths:number,uvIncluded:number,uvCreditMinor:number,eventCreditMinor:number}} Plan */
/** @typedef {Omit<typeof raw, 'pricing'> & {pricing: Omit<typeof raw.pricing, 'plans'|'eventPrices'> & {plans:Plan[], eventPrices:Record<'intentTenThousandths'|'engagedTenThousandths'|'reengagedTenThousandths', number|null>}}} SiteConfig */

/** @param {string} value */
function origin(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Use an HTTPS origin without paths or credentials');
  return url.origin;
}

/** @param {string} value */
function safePath(value) {
  return /^\/(?!\/)[a-zA-Z0-9/_?=&.%+~-]*$/.test(value) && !/%(?:2f|5c|0[0-9a-f]|1[0-9a-f]|7f)/i.test(value);
}

/** Reject unknown configuration fields before public config can be bundled. @param {object} value @param {string[]} keys */
function onlyKeys(value, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some((key) => !keys.includes(key)) || keys.some((key) => !Object.hasOwn(value, key))) throw new Error('Unknown or missing configuration field');
}

/** @param {SiteConfig} value */
export function validateConfig(value) {
  onlyKeys(value, ['brand','appearance','urls','contact','legal','pricing']);
  onlyKeys(value.brand, ['name','tagline','logo','logoDark','icon','favicon','socialImage']);
  onlyKeys(value.appearance, ['accentColor','defaultTheme']);
  onlyKeys(value.urls, ['marketing','application','signInPath','registrationPath']);
  onlyKeys(value.contact, ['supportEmail','telegram','phone']);
  onlyKeys(value.legal, ['entity','governingLaw','effectiveDate','reviewed']);
  onlyKeys(value.pricing, ['currency','currencySymbol','confirmed','plans','eventPrices','calculatorDefaults']);
  onlyKeys(value.pricing.eventPrices, ['intentTenThousandths','engagedTenThousandths','reengagedTenThousandths']);
  onlyKeys(value.pricing.calculatorDefaults, ['visitors','accounts','intent','engaged','reengaged']);
  for (const field of [...Object.values(value.brand), ...Object.values(value.appearance), ...Object.values(value.urls), ...Object.values(value.contact), value.legal.entity, value.legal.governingLaw, value.legal.effectiveDate, value.pricing.currency, value.pricing.currencySymbol]) if (typeof field !== 'string') throw new Error('Configuration text fields must be strings');
  if (typeof value.pricing.confirmed !== 'boolean' || typeof value.legal.reviewed !== 'boolean' || !Array.isArray(value.pricing.plans)) throw new Error('Invalid configuration flags or plans');
  origin(value.urls.marketing);
  if (value.urls.application) origin(value.urls.application);
  for (const path of [value.urls.signInPath, value.urls.registrationPath]) {
    if (path && (!value.urls.application || !safePath(path))) throw new Error('Invalid application path');
  }
  for (const path of [value.brand.logo, value.brand.logoDark, value.brand.icon, value.brand.favicon, value.brand.socialImage]) {
    if (!safePath(path) || /[?%]/.test(path) || path.includes('..')) throw new Error('Brand assets must use local paths');
  }
  if (!value.brand.name.trim() || !/^#[0-9a-f]{6}$/i.test(value.appearance.accentColor) || !['light', 'dark'].includes(value.appearance.defaultTheme)) throw new Error('Invalid brand or appearance');
  if (value.contact.supportEmail && !/^[a-z0-9._+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(value.contact.supportEmail)) throw new Error('Invalid support email');
  if (!/^https:\/\/t\.me\/[A-Za-z0-9_]+$/.test(value.contact.telegram)) throw new Error('Invalid Telegram URL');
  if (!/^\d{11}$/.test(value.contact.phone)) throw new Error('Invalid phone number');
  if (!/^[A-Z]{3}$/.test(value.pricing.currency) || !value.pricing.currencySymbol.trim()) throw new Error('Invalid currency');
  // This calculator uses two-decimal currencies; reject a silent JPY-style rounding mismatch.
  if (new Intl.NumberFormat('en', { style: 'currency', currency: value.pricing.currency }).resolvedOptions().maximumFractionDigits !== 2) throw new Error('Use a currency with two fractional digits');
  const integer = (/** @type {number} */ n) => Number.isSafeInteger(n) && n >= 0 && n <= 1_000_000_000;
  for (const number of Object.values(value.pricing.calculatorDefaults)) if (!integer(number)) throw new Error('Invalid calculator default');
  if (value.pricing.calculatorDefaults.engaged > value.pricing.calculatorDefaults.intent) throw new Error('Engaged contacts cannot exceed intent contacts');
  for (const price of Object.values(value.pricing.eventPrices)) if (price !== null && !integer(price)) throw new Error('Rates must be non-negative integer ten-thousandths');
  const ids = new Set();
  for (const plan of value.pricing.plans) {
    onlyKeys(plan, ['id','name','monthlyMinor','includedAccounts','extraAccountMinor','visitorTenThousandths','uvIncluded','uvCreditMinor','eventCreditMinor']);
    if (!plan.name || typeof plan.name !== 'object' || Object.values(plan.name).some((name) => typeof name !== 'string')) throw new Error('Invalid plan names');
    if (!plan.id || ids.has(plan.id) || !plan.name.en?.trim()) throw new Error('Invalid plan identity');
    ids.add(plan.id);
    for (const number of [plan.monthlyMinor,plan.includedAccounts,plan.extraAccountMinor,plan.visitorTenThousandths,plan.uvIncluded,plan.uvCreditMinor,plan.eventCreditMinor]) if (!integer(number)) throw new Error('Plan prices must be non-negative integers');
  }
  if (value.pricing.confirmed && (!value.pricing.plans.length || Object.values(value.pricing.eventPrices).some((p) => p === null))) throw new Error('Confirmed pricing requires plans and every rate');
  if (value.legal.effectiveDate && (!/^\d{4}-\d{2}-\d{2}$/.test(value.legal.effectiveDate) || new Date(value.legal.effectiveDate).toISOString().slice(0,10) !== value.legal.effectiveDate)) throw new Error('Invalid effective date');
  return value;
}

export const config = validateConfig(/** @type {SiteConfig} */ (raw));

/** @param {'signInPath'|'registrationPath'} kind @param {SiteConfig} [value] */
export function applicationLink(kind, value = config) {
  validateConfig(value);
  return value.urls.application && value.urls[kind] ? new URL(value.urls[kind], value.urls.application).href : null;
}

/** @param {SiteConfig} [value] */
export function releaseIssues(value = config) {
  return [
    !applicationLink('registrationPath', value) && 'urls.application / registrationPath',
    !value.contact.supportEmail && 'contact.supportEmail',
    !value.legal.entity && 'legal.entity',
    !value.legal.governingLaw && 'legal.governingLaw',
    !value.legal.effectiveDate && 'legal.effectiveDate',
    !value.legal.reviewed && 'legal.reviewed',
    !value.pricing.confirmed && 'pricing.confirmed'
  ].filter(Boolean);
}

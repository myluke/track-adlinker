<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import { config } from '$lib/config.js';
  import { estimate } from '$lib/calculator.js';
  import { getCopy } from '$lib/i18n';
  let { lang, copy }: {lang:string;copy:ReturnType<typeof getCopy>} = $props();
  const plans = config.pricing.confirmed ? config.pricing.plans : [];
  const usageKeys = ['visitors','accounts','intent'] as const;
  const advancedUsageKeys = ['engaged','reengaged'] as const;
  const rateKeys = ['monthly','includedAccounts','extraAccount','visitorRate','uvCredit','intentRate','engagedRate','reengagedRate','eventCredit'] as const;
  type Quote = Record<typeof rateKeys[number], string>;
  let mode = $state<'landing'|'direct'>('landing');
  let selectedPlan = $state(plans[0]?.id || 'custom');
  let usage = $state(defaultUsage());
  let quote = $state<Quote>(planQuote(plans[0]?.id || 'custom'));

  function defaultUsage() {
    const d = config.pricing.calculatorDefaults;
    return { visitors:String(d.visitors), accounts:String(d.accounts), intent:String(d.intent), engaged:String(d.engaged), reengaged:String(d.reengaged) };
  }
  function planQuote(id:string): Quote {
    const plan = plans.find((p) => p.id === id);
    const rates = config.pricing.eventPrices;
    const amount = (n:number|null|undefined, scale = 100) => n == null ? '' : String(n / scale);
    return {
      monthly:amount(plan?.monthlyMinor), includedAccounts:String(plan?.includedAccounts || 0),
      extraAccount:amount(plan?.extraAccountMinor), visitorRate:amount(plan?.visitorTenThousandths,10000),
      uvCredit:amount(plan?.uvCreditMinor ?? 0), eventCredit:amount(plan?.eventCreditMinor ?? 0),
      intentRate:config.pricing.confirmed ? amount(rates.intentTenThousandths,10000) : '',
      engagedRate:config.pricing.confirmed ? amount(rates.engagedTenThousandths,10000) : '',
      reengagedRate:config.pricing.confirmed ? amount(rates.reengagedTenThousandths,10000) : ''
    };
  }
  function reset() { mode = 'landing'; usage = defaultUsage(); selectedPlan = plans[0]?.id || 'custom'; quote = planQuote(selectedPlan); }
  let calculation = $derived.by(() => {
    const required = rateKeys.filter((key) => mode !== 'direct' || (key !== 'visitorRate' && key !== 'uvCredit'));
    if (required.some((key) => quote[key].trim() === '')) return { result:null, error:'', missing:true };
    try { return { result:estimate({ mode, ...usage, engaged:usage.engaged || '0', reengaged:usage.reengaged || '0', ...quote }), error:'', missing:false }; }
    catch (error) { return { result:null, error:error instanceof Error && error.message === 'funnel' ? copy.calc.funnel : copy.calc.incomplete, missing:false }; }
  });
  const money = (cents:number) => config.pricing.currencySymbol + new Intl.NumberFormat(lang, { minimumFractionDigits:2, maximumFractionDigits:2 }).format(cents / 100);
  const number = (value:number) => new Intl.NumberFormat(lang).format(value);
  const selectedPlanData = $derived(plans.find((plan) => plan.id === selectedPlan));
</script>

<div class="calculator-layout">
  <div class="calculator-controls">
    <div class="mode-tabs" role="group" aria-label={copy.calc.quoteLabel}>
      {#each ['landing','direct'] as value, i}<button type="button" class:chosen={mode === value} aria-pressed={mode === value} onclick={() => mode = value as 'landing'|'direct'}>{copy.calc.mode[i]}</button>{/each}
    </div>
    <p class="mode-help">{copy.calc.modeHelp[mode === 'landing' ? 0 : 1]}</p>
    <section class="calculator-panel">
      <div class="panel-heading"><div><h2>{copy.calc.usage}</h2><p class="usage-hint">{copy.calc.usageHint}</p></div><button class="text-button" onclick={reset}>{copy.calc.reset} <span aria-hidden="true"><Icon name="refresh" /></span></button></div>
      {#if plans.length}
        <label class="plan-select" for="plan-select"><span>{copy.calc.plan}</span><select id="plan-select" bind:value={selectedPlan} onchange={() => quote = planQuote(selectedPlan)}>{#each plans as plan}<option value={plan.id}>{plan.name[lang] || plan.name.en} · {money(plan.monthlyMinor)}{copy.calc.perMonth}</option>{/each}</select></label>
        {#if selectedPlanData}
          <div class="plan-summary"><strong>{copy.calc.planIncludes}</strong><span>{number(selectedPlanData.includedAccounts)} {copy.calc.accountsIncluded}</span>{#if mode === 'landing'}<span>{number(selectedPlanData.uvIncluded)} {copy.calc.uvIncluded}</span>{/if}<span>{money(selectedPlanData.eventCreditMinor)} {copy.calc.eventIncluded}</span></div>
        {/if}
      {/if}
      <div class="input-grid core-inputs" class:direct-inputs={mode === 'direct'}>
        {#each usageKeys as key, i}
          {#if mode === 'landing' || key !== 'visitors'}
            <label for={`usage-${key}`}><span>{copy.calc.fields[i]}</span><input id={`usage-${key}`} name={key} type="text" inputmode="numeric" pattern="[0-9]+" maxlength="10" bind:value={usage[key]} aria-describedby="calculation-guide" /></label>
          {/if}
        {/each}
      </div>
    </section>
    <details class="advanced-settings">
      <summary><span><strong>{copy.calc.advanced}</strong><small>{copy.calc.advancedHint}</small><small>{copy.calc.fields[3]}: {usage.engaged || '0'} · {copy.calc.fields[4]}: {usage.reengaged || '0'}</small></span><b aria-hidden="true"><Icon name="plus" /></b></summary>
      <div class="advanced-content">
        <section class="calculator-panel advanced-usage">
          <div class="panel-heading"><h2>{copy.calc.advancedUsage}</h2></div>
          <div class="input-grid">
            {#each advancedUsageKeys as key, i}
              <label for={`usage-${key}`}><span>{copy.calc.fields[i + 3]}</span><input id={`usage-${key}`} name={key} type="text" inputmode="numeric" pattern="[0-9]+" maxlength="10" bind:value={usage[key]} aria-describedby="calculation-guide" /></label>
            {/each}
          </div>
        </section>
      </div>
    </details>
    <div class="calculation-guide" id="calculation-guide"><strong>{copy.calc.howTitle}</strong><p>{mode === 'landing' ? copy.calc.howText : copy.calc.howDirectText}</p></div>
  </div>
  <aside class="estimate-card">
    <div class="estimate-head"><img src={config.brand.icon} alt="" width="32" height="32" /><span>{copy.calc.quoteLabel}</span></div>
    <p class="estimate-label">{copy.calc.total}</p>
    <output class="estimate-total" aria-live="polite">{calculation.result ? money(calculation.result.total) : '—'}</output>
    {#if calculation.missing}<p class="estimate-prompt">{copy.calc.enter}</p>{/if}
    {#if calculation.error}<p class="estimate-error" role="alert">{calculation.error}</p>{/if}
    <dl class="cost-breakdown">{#each ['monthly','account','visitor','event'] as part, i}{#if mode === 'landing' || part !== 'visitor'}<div><dt>{copy.calc.breakdown[i]}</dt><dd>{calculation.result ? money(calculation.result[part as keyof typeof calculation.result]) : '—'}</dd></div>{/if}{/each}</dl>
    <p class="estimate-note">{copy.calc.note}</p><p class="local-note"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>{copy.calc.local}</p>
  </aside>
</div>

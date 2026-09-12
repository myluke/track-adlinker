<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import { onMount } from 'svelte';
  import { config, applicationLink } from '$lib/config.js';
  import { locales, getCopy } from '$lib/i18n';
  let { lang, copy, section }: { lang:string; copy:ReturnType<typeof getCopy>; section:string } = $props();
  let dark = $state(config.appearance.defaultTheme === 'dark');
  const signIn = applicationLink('signInPath');
  const register = applicationLink('registrationPath');
  const link = (locale:string, page = section === 'home' ? '' : section) => `/${locale}/${page ? page + '/' : ''}`;
  onMount(() => { dark = document.documentElement.dataset.theme === 'dark'; });
  $effect(() => { document.documentElement.lang = locales.find((item) => item.code === lang)?.hreflang || 'en'; });
  function toggleTheme() {
    dark = document.documentElement.dataset.theme !== 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    try { localStorage.setItem('adlinker-theme', dark ? 'dark' : 'light'); } catch { /* Theme works without browser storage. */ }
  }
</script>

<a class="skip-link" href="#main">{copy.skip}</a>
<header class="site-header">
  <div class="container nav-wrap">
    <a class="brand" href={link(lang, '')} aria-label={config.brand.name}>
      <img class="logo-light" src={config.brand.logo} alt={config.brand.name} width="164" height="40" />
      <img class="logo-dark" src={config.brand.logoDark} alt={config.brand.name} width="164" height="40" />
    </a>
    <nav class="desktop-nav" aria-label={copy.home}>
      <a href={link(lang, '')} aria-current={section === 'home' ? 'page' : undefined}>{copy.home}</a>
      <a href={link(lang, '') + '#how-it-works'}>{copy.howLabel}</a>
      <a href={link(lang, '') + '#product'}>{copy.showcase.label}</a>
      <a href={link(lang, 'why')} aria-current={section === 'why' ? 'page' : undefined}>{copy.nav[0]}</a>
      <a href={link(lang, 'calculator')} aria-current={section === 'calculator' ? 'page' : undefined}>{copy.nav[1]}</a>
      <a href={link(lang, 'contact')} aria-current={section === 'contact' ? 'page' : undefined}>{copy.contact.nav}</a>
    </nav>
    <div class="tools">
      <details class="language-switch">
        <summary aria-label={copy.language}><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg><span>{locales.find((l) => l.code === lang)?.label}</span><span class="chevron"><Icon name="chevron-down" /></span></summary>
        <div class="language-options">{#each locales as locale}<a href={link(locale.code)} lang={locale.hreflang} hreflang={locale.hreflang} aria-current={locale.code === lang ? 'true' : undefined} data-sveltekit-reload>{locale.label}{#if locale.code === lang}<span aria-hidden="true"><Icon name="check" /></span>{/if}</a>{/each}</div>
      </details>
      <button class="icon-btn" onclick={toggleTheme} aria-label={dark ? copy.lightTheme : copy.darkTheme} title={dark ? copy.lightTheme : copy.darkTheme}>
        <svg viewBox="0 0 24 24" aria-hidden="true">{#if dark}<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>{:else}<path d="M20 14a8 8 0 0 1-10-10 8.5 8.5 0 1 0 10 10Z"/>{/if}</svg>
      </button>
      {#if signIn}<a class="sign-in" href={signIn}>{copy.signIn}</a>{/if}
      {#if register}<a class="button primary compact header-cta" href={register}>{copy.start} <span aria-hidden="true"><Icon name="arrow-up-right" /></span></a>{/if}
      <details class="mobile-menu"><summary aria-label={copy.menu}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></summary><nav aria-label={copy.menu}><a href={link(lang, '')} data-sveltekit-reload>{copy.home}</a><a href={link(lang, '') + '#product'} data-sveltekit-reload>{copy.showcase.label}</a><a href={link(lang, 'why')} data-sveltekit-reload>{copy.nav[0]}</a><a href={link(lang, 'calculator')} data-sveltekit-reload>{copy.nav[1]}</a><a href={link(lang, 'contact')} data-sveltekit-reload>{copy.contact.nav}</a>{#if register}<a href={register}>{copy.start}</a>{/if}</nav></details>
    </div>
  </div>
</header>

<script lang="ts">
  import { config } from '$lib/config.js';
  import { getCopy } from '$lib/i18n';
  let { lang, copy }: {lang:string;copy:ReturnType<typeof getCopy>} = $props();
</script>

<footer class="site-footer">
  <div class="container footer-grid">
    <div><a href={`/${lang}/`} aria-label={config.brand.name}><img src={config.brand.logoDark} alt={config.brand.name} class="footer-logo" width="164" height="40" /></a><p class="footer-tagline">{config.brand.tagline}</p></div>
    <div class="footer-description"><p>{copy.footer.replaceAll('AdLinker', config.brand.name)}</p></div>
    <nav class="footer-links" aria-label={copy.legal.contact}><a class="main-site-link" href={config.urls.marketing}>{copy.backToMainSite}</a><a href={`/${lang}/why/`}>{copy.nav[0]}</a><a href={`/${lang}/calculator/`}>{copy.nav[1]}</a><a href={`/${lang}/contact/`}>{copy.contact.nav}</a><a href={`/${lang}/terms/`}>{copy.terms}</a><a href={`/${lang}/privacy/`}>{copy.privacy}</a>{#if config.contact.supportEmail}<a href={`mailto:${config.contact.supportEmail}`}>{config.contact.supportEmail}</a>{/if}<a href={config.contact.telegram} rel="me">Telegram</a><a href={`tel:${config.contact.phone}`}>{config.contact.phone}</a></nav>
  </div>
  <div class="container copyright"><span>© {new Date().getFullYear()} {config.brand.name}</span><span>{new URL(config.urls.marketing).hostname}</span></div>
</footer>


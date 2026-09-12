<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import { config, applicationLink } from '$lib/config.js';
  import { locales } from '$lib/i18n';
  import Header from '$lib/components/Header.svelte';
  import FlowCard from '$lib/components/FlowCard.svelte';
  import ProductShowcase from '$lib/components/ProductShowcase.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import Calculator from '$lib/components/Calculator.svelte';
  import type { PageData } from './$types';
  let { data }: {data:PageData} = $props();
  let { lang, section, copy } = $derived(data);
  const register = applicationLink('registrationPath');
  const legalReady = config.legal.reviewed && config.legal.entity && config.legal.governingLaw && config.legal.effectiveDate && config.contact.supportEmail;
  const link = (page = '') => `/${lang}/${page ? page + '/' : ''}`;
  let title = $derived((section === 'home' ? copy.seoHomeTitle : section === 'why' ? copy.whyTitle : section === 'why' ? copy.whyTitle : section === 'calculator' ? copy.calc.title : section === 'contact' ? copy.contact.title : section === 'terms' ? copy.terms : copy.privacy) + ' · ' + config.brand.name);
  let description = $derived((section === 'home' ? copy.seoHomeDescription : section === 'why' ? copy.whyLead : section === 'why' ? copy.whyLead : section === 'calculator' ? copy.calc.lead : section === 'contact' ? copy.contact.lead : copy.legal.intro).replaceAll('AdLinker', config.brand.name));
  let canonical = $derived(config.urls.marketing.replace(/\/$/, '') + link(section === 'home' ? '' : section));
  let seoSchema = $derived(JSON.stringify({
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Organization', name: config.brand.name, url: config.urls.marketing, logo: new URL(config.brand.logo, config.urls.marketing).href },
      { '@type': 'WebSite', name: config.brand.name, url: config.urls.marketing, inLanguage: lang }
    ]
  }));
</script>

<svelte:head>
  <title>{title}</title><meta name="description" content={description} />
  <link rel="icon" href={config.brand.favicon} />
  <link rel="canonical" href={canonical} />
  {#each locales as locale}<link rel="alternate" hreflang={locale.hreflang} href={`${config.urls.marketing.replace(/\/$/, '')}/${locale.code}/${section === 'home' ? '' : section + '/'}`} />{/each}
  <link rel="alternate" hreflang="x-default" href={`${config.urls.marketing.replace(/\/$/, '')}/zh-hans/${section === 'home' ? '' : section + '/'}`} />
  <meta property="og:type" content="website" /><meta property="og:site_name" content={config.brand.name} /><meta property="og:title" content={title} /><meta property="og:description" content={description} /><meta property="og:url" content={canonical} />
  <meta property="og:image" content={new URL(config.brand.socialImage, config.urls.marketing).href} /><meta name="twitter:card" content="summary" />
  <script type="application/ld+json">{@html seoSchema}</script>
  {#if (section === 'terms' || section === 'privacy') && !legalReady}<meta name="robots" content="noindex,follow" />{/if}
</svelte:head>

<Header {lang} {copy} {section} />
<main id="main" tabindex="-1">
  {#if section === 'home'}
    <section class="hero container">
      <div class="hero-copy"><p class="eyebrow"><span class="square-dot" aria-hidden="true"></span> {config.brand.tagline}</p><h1><span>{copy.headline[0]}</span><em>{copy.headline[1]}</em></h1><p class="lead">{copy.lead.replaceAll('AdLinker',config.brand.name)}</p>
        <div class="actions"><a class="button primary" href={register || '#how-it-works'}>{register ? copy.start : copy.primary}<span aria-hidden="true"><Icon name="arrow-up-right" /></span></a><a class="button secondary" href={link('calculator')}><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2m4 0h2M8 15h2m4 0h2"/></svg>{copy.secondary}</a></div>
        <div class="hero-notes">{#each copy.heroNotes as note}<span><b aria-hidden="true"><Icon name="check" /></b>{note}</span>{/each}</div>
      </div>
      <FlowCard {copy} />
    </section>
    <div class="journey-strip"><div class="container"><span>TikTok Ads</span><span class="strip-line" aria-hidden="true"></span><span>{config.brand.name}</span><span class="strip-line" aria-hidden="true"></span><span>WhatsApp</span><span class="strip-line" aria-hidden="true"></span><span>TikTok Events API</span></div></div>
    <ProductShowcase copy={copy.showcase} />
    <section class="section" id="how-it-works">
      <div class="container"><div class="section-heading"><div><p class="eyebrow">01 / {copy.howLabel}</p><h2>{copy.proof}</h2></div><p>{copy.proofLead}</p></div><div class="steps-grid">{#each copy.why as name, i}<article class="step-card"><span class="step-number">0{i+1}</span><h3>{name}</h3><p>{copy.whyText[i]}</p></article>{/each}</div></div>
    </section>
    <section class="section feature-section"><div class="container"><div class="section-heading"><div><p class="eyebrow">02 / {config.brand.name}</p><h2>{copy.featuresTitle}</h2></div><p>{copy.featuresLead}</p></div><div class="features-grid">{#each copy.features as feature, i}<article class="feature-item"><span class="feature-icon" aria-hidden="true"><Icon name={(['arrow-up-right','grid','waves','undo','chart','diamond'] as const)[i]} /></span><h3>{feature[0]}</h3><p>{feature[1]}</p></article>{/each}</div></div></section>
    <section class="section dark-section"><div class="container path-layout"><div><p class="eyebrow">03 / {copy.howLabel}</p><h2>{copy.pathTitle}</h2><p class="section-description">{copy.pathLead}</p><a class="text-link" href={link('why')}>{copy.nav[0]} <span aria-hidden="true"><Icon name="arrow-up-right" /></span></a></div><div class="path-options">{#each copy.paths as path, i}<article><span class="path-number">0{i+1}</span><div><h3>{path[0]}</h3><p>{path[1]}</p></div><span aria-hidden="true"><Icon name="arrow-up-right" /></span></article>{/each}</div></div></section>
    <section class="section"><div class="container pricing-block"><div><p class="eyebrow">04 / {copy.estimate}</p><h2>{copy.pricingHeading}</h2><p>{copy.pricingText}</p><a class="button primary" href={link('calculator')}>{copy.secondary}<span aria-hidden="true"><Icon name="arrow-up-right" /></span></a></div><div class="price-composition">{#each copy.priceParts as part, i}<div><span class="composition-icon" aria-hidden="true"><Icon name={(['document','grid','arrow-up-right'] as const)[i]} /></span><span>{part}</span><span aria-hidden="true"><Icon name={i < 2 ? 'plus' : 'equal'} /></span></div>{/each}<p>{copy.calc.total}<svg aria-hidden="true" viewBox="0 0 80 30"><path d="M2 25h15l9-9h14l12-10h23m-10-4h10v10"/></svg></p></div></div></section>
    <section class="section faq-section"><div class="container faq-layout"><div><p class="eyebrow">FAQ</p><h2>{copy.faqTitle}</h2></div><div>{#each copy.faq as item}<details class="faq-item"><summary>{item[0]}<span aria-hidden="true"><Icon name="plus" /></span></summary><p>{item[1]}</p></details>{/each}</div></div></section>
  {:else if section === 'why'}
    <section class="page-hero container"><p class="eyebrow">{config.brand.tagline}</p><h1>{copy.whyTitle}</h1><p class="lead">{copy.whyLead}</p></section>
    <section class="section feature-section"><div class="container"><div class="section-heading"><h2>{copy.compareTitle}</h2></div><!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users must be able to scroll the comparison table.) -->
    <div class="table-scroll" tabindex="0" role="region" aria-label={copy.compareTitle}><table class="comparison-table"><thead><tr>{#each copy.compareHeads as text}<th scope="col">{text}</th>{/each}</tr></thead><tbody>{#each copy.compareRows as row}<tr><th scope="row">{row[0]}</th><td>{row[1]}</td><td><span aria-hidden="true"><Icon name="check" /></span> {row[2]}</td></tr>{/each}</tbody></table></div></div></section>
    <section class="section"><div class="container path-layout"><div><p class="eyebrow">{copy.howLabel}</p><h2>{copy.pathTitle}</h2><p class="section-description">{copy.pathLead}</p></div><div class="path-options light-paths">{#each copy.paths as path, i}<article><span class="path-number">0{i+1}</span><div><h3>{path[0]}</h3><p>{path[1]}</p></div></article>{/each}</div></div></section>
    <section class="section"><div class="container page-hero"><p class="eyebrow">{copy.howLabel}</p><h2>{copy.workflowHeading}</h2><p class="lead">{copy.workflowText}</p><p class="section-description">{copy.workflowNote}</p></div></section>
    <section class="section dark-section"><div class="container status-layout"><div><h2>{copy.statusTitle}</h2><p class="section-description">{copy.statusNote}</p></div><div class="status-list">{#each copy.statusLabels as status, i}<div><span class={`status-dot status-${i}`} aria-hidden="true"></span><span>{status}</span><span aria-hidden="true"><Icon name={(['clock','check','refresh','close'] as const)[i]} /></span></div>{/each}</div></div></section>
  {:else if section === 'tiktok-whatsapp-tracking'}
    <section class="page-hero container"><p class="eyebrow">TikTok Ads · WhatsApp</p><h1>{lang === 'zh-hans' ? '如何追踪 TikTok 广告带来的 WhatsApp 线索' : 'How to Track WhatsApp Leads from TikTok Ads'}</h1><p class="lead">{lang === 'zh-hans' ? '把广告点击、WhatsApp 跳转和对话阶段连接起来，查看每一步发生了什么。' : 'Connect ad clicks, WhatsApp handoffs and conversation stages so you can see what happened at each step.'}</p></section>
    <section class="section"><div class="container path-layout"><div><h2>{lang === 'zh-hans' ? '三步建立可读的线索链路' : 'Three steps to a readable lead path'}</h2></div><div class="path-options light-paths"><article><span class="path-number">01</span><div><h3>{lang === 'zh-hans' ? '记录来源' : 'Record the source'}</h3><p>{lang === 'zh-hans' ? '为访问保留 TikTok 广告来源和追踪 ID。' : 'Keep the TikTok source and a traceable ID with the visit.'}</p></div></article><article><span class="path-number">02</span><div><h3>{lang === 'zh-hans' ? '记录跳转' : 'Record the handoff'}</h3><p>{lang === 'zh-hans' ? '将打开 WhatsApp 视为独立阶段，不把点击当作对话。' : 'Treat the WhatsApp open as a separate stage from the click.'}</p></div></article><article><span class="path-number">03</span><div><h3>{lang === 'zh-hans' ? '记录对话' : 'Record the conversation'}</h3><p>{lang === 'zh-hans' ? '用首条消息和后续互动表示线索阶段。' : 'Use the first message and later interactions as conversation milestones.'}</p></div></article></div></div></section>
    <section class="section"><div class="container faq-layout"><div><p class="eyebrow">UTM · TID · DEDUPLICATION</p><h2>{lang === 'zh-hans' ? '给每次投放留下可复核的线索' : 'Leave a verifiable trail for every campaign'}</h2></div><div><p class="section-description">{lang === 'zh-hans' ? '为广告、素材和落地页使用稳定的 UTM 与 TID 命名；把 page_view、wa_open、first_message 等阶段分开记录，并在回传前使用事件 ID 去重。示例参数应先在测试环境验证，发送成功也不代表平台已接收或归因。' : 'Use stable UTM and TID names for campaigns, creatives and landing pages. Keep page_view, wa_open and first_message as separate stages, then deduplicate with an event ID before delivery. Validate parameters in a test environment; sent does not mean accepted or attributed.'}</p></div></div></section>
  {:else if section === 'tiktok-events-api-whatsapp'}
    <section class="page-hero container"><p class="eyebrow">TikTok Events API</p><h1>{lang === 'zh-hans' ? 'TikTok WhatsApp 事件回传说明' : 'TikTok Events API for WhatsApp Leads'}</h1><p class="lead">{lang === 'zh-hans' ? '把首条消息、有效线索等关键行为反馈给 TikTok，帮助广告系统识别更有价值的点击，支持后续投放优化和效果评估；发送成功不等于平台已归因。' : 'Send key actions such as first messages and qualified leads back to TikTok so its ad system can recognize more valuable clicks and support campaign optimization and measurement; a sent event is not the same as platform attribution.'}</p></section>
    <section class="section"><div class="container status-layout"><div><h2>{lang === 'zh-hans' ? '先区分三个状态' : 'Separate three states'}</h2></div><div class="status-list"><div><span class="status-dot status-0" aria-hidden="true"></span><span>{lang === 'zh-hans' ? '已记录：链路中产生了事件' : 'Recorded: an event exists in the path'}</span></div><div><span class="status-dot status-1" aria-hidden="true"></span><span>{lang === 'zh-hans' ? '已发送：AdLinker 完成发送' : 'Sent: AdLinker completed delivery'}</span></div><div><span class="status-dot status-2" aria-hidden="true"></span><span>{lang === 'zh-hans' ? '已归因：平台确认并采用事件（需单独验证）' : 'Attributed: the platform accepted and used the event (verify separately)'}</span></div></div></div></section>
  {:else if section === 'contact'}
    <section class="page-hero container"><p class="eyebrow">{config.brand.name}</p><h1>{copy.contact.title}</h1><p class="lead">{copy.contact.lead}</p></section>
    <section class="section contact-section"><div class="container contact-cards"><a class="contact-card contact-card-primary" href={config.contact.telegram} rel="me"><span class="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m21 3-7.5 18-3.4-7.1L3 10.5 21 3Z"/><path d="m10.1 13.9 5.2-5.2"/></svg></span><h2>{copy.contact.telegram}</h2><p>{copy.contact.telegramNote}</p></a><a class="contact-card" href={`tel:${config.contact.phone}`}><span class="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7.2 3.5 4.8 5.2c-.8.6-1.1 1.6-.7 2.5 2.3 5.4 6.6 9.7 12 12 .9.4 1.9.1 2.5-.7l1.7-2.4-4.1-3.1-1.8 1.8a15.5 15.5 0 0 1-5.4-5.4l1.8-1.8-3.1-4.1Z"/></svg></span><h2>{copy.contact.phone}</h2><p>{copy.contact.phoneNote}</p></a><div class="contact-card"><span class="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-3.5-.7L4 20l1.7-4A7.2 7.2 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg></span><h2>{copy.contact.wechat}: {config.contact.phone}</h2><p>{copy.contact.wechatNote}</p></div>{#if config.contact.supportEmail}<a class="contact-card" href={`mailto:${config.contact.supportEmail}`}><span class="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></span><h2>{config.contact.supportEmail}</h2><p>{copy.contact.emailNote}</p></a>{/if}</div></section>
  {:else if section === 'calculator'}
    <section class="page-hero container calculator-hero"><p class="eyebrow">{copy.calc.quoteLabel}</p><h1>{copy.calc.title}</h1><p class="lead">{copy.calc.lead}</p></section><section class="container calculator-section"><Calculator {lang} {copy} /></section>
  {:else}
    <section class="page-hero container legal-hero"><p class="eyebrow">{config.brand.name}</p><h1>{section === 'terms' ? copy.terms : copy.privacy}</h1><p class="lead">{copy.legal.intro}</p>{#if !legalReady}<span class="draft-badge">{copy.legal.draft}</span>{/if}</section>
    <div class="container legal-layout"><aside class="legal-facts"><dl><dt>{copy.legal.entity}</dt><dd>{config.legal.entity || copy.legal.pending}</dd><dt>{copy.legal.effective}</dt><dd>{config.legal.effectiveDate || copy.legal.pending}</dd>{#if section === 'terms'}<dt>{copy.legal.law}</dt><dd>{config.legal.governingLaw || copy.legal.pending}</dd>{/if}</dl></aside><article class="legal-prose">{#each (section === 'terms' ? copy.legal.terms : copy.legal.privacy) as item, i}<section><h2><span>0{i+1}</span>{item[0]}</h2><p>{item[1]}</p></section>{/each}<section><h2>{copy.legal.contact}</h2>{#if config.contact.supportEmail}<a class="text-link" href={`mailto:${config.contact.supportEmail}`}>{config.contact.supportEmail}</a>{:else}<p>{copy.legal.contactPending}</p>{/if}</section></article></div>
  {/if}
  {#if section === 'home' || section === 'why'}<section class="closing-section"><div class="container"><img src={config.brand.icon} alt="" width="50" height="50" loading="lazy" /><h2>{copy.closingTitle}</h2><p>{copy.closingText}</p><a class="button primary" href={register || link('calculator')}>{register ? copy.start : copy.secondary}<span aria-hidden="true"><Icon name="arrow-up-right" /></span></a></div></section>{/if}
</main>
<SiteFooter {lang} {copy} />

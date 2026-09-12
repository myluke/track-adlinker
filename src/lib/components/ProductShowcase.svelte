<script lang="ts">
  import { onMount } from 'svelte';
  import type { getCopy } from '$lib/i18n.js';
  let { copy }: { copy: ReturnType<typeof getCopy>['showcase'] } = $props();
  const screens = ['dashboard', 'conversations', 'templates'];
  let selected = $state(0);
  let current = $derived(copy.items[selected]);
  let source = $derived(`/product/${screens[selected]}.webp`);
  const isZh = () => /[\u4e00-\u9fff]/.test(copy.title);
  const signals = $derived(copy.items.length ? (isZh() ? ['新访客已归因', 'WhatsApp 会话已连接', 'Events API 回传成功'] : ['New visitor attributed', 'WhatsApp conversation connected', 'Events API event sent']) : []);
  let signal = $state(0);
  onMount(() => { const timer = window.setInterval(() => signal = (signal + 1) % signals.length, 2600); return () => window.clearInterval(timer); });
</script>

<section class="showcase section" id="product" aria-labelledby="product-title">
  <div class="container">
    <div class="showcase-heading">
      <h2 id="product-title">{copy.title}</h2>
      <p>{copy.lead}</p>
    </div>
    <div class="screen-switcher" role="group" aria-label={copy.label}>
      {#each copy.items as item, i}
        <button type="button" aria-pressed={selected === i} aria-controls="product-screen" onclick={() => selected = i}>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            {#if i === 0}<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            {:else if i === 1}<path d="M21 11.5a8.5 8.5 0 0 1-12 7.7L3 21l1.8-6A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 10h8m-8 4h5"/>
            {:else}<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18m-6 0v11M6 6.5h1m2 0h1"/>{/if}
          </svg>
          {item.title}
        </button>
      {/each}
    </div>
    <figure id="product-screen">
      <div class="screen-mount">
        <div class="live-signal"><span></span><b>{signals[signal]}</b><small>{isZh() ? '刚刚' : 'Just now'}</small></div>
        <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
        <!-- svelte-ignore a11y_no_noninteractive_tabindex (The screenshot region scrolls horizontally on small screens.) -->
        <div class="screen-scroll" role="region" aria-label={current.alt} tabindex="0">
          <img class:screen-in={selected >= 0} src={source} alt={current.alt} width="2048" height="994" loading="lazy" decoding="async" />
        </div>
      </div>
      <figcaption>
        <div aria-live="polite"><h3>{current.title}</h3><p>{current.description}</p></div>
      </figcaption>
    </figure>
  </div>
</section>

<style>
  .showcase { padding-bottom: 0; }
  .showcase-heading { text-align: center; max-width: 720px; margin: 0 auto; }
  .showcase-heading p { color: var(--muted); font-size: 14px; line-height: 1.9; margin-top: 16px; }
  .screen-switcher { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin: 30px 0 24px; }
  .screen-switcher button { display: flex; align-items: center; justify-content: center; gap: 9px; min-height: 46px; padding: 12px 20px; border: 1px solid transparent; border-radius: 8px; background: transparent; color: var(--muted); font-size: 13px; }
  .screen-switcher button:hover { background: var(--mint); }
  .screen-switcher button[aria-pressed='true'] { color: var(--accent-text); background: var(--mint); border-color: var(--line); font-weight: 700; }
  .screen-switcher svg { width: 17px; height: 17px; }
  .screen-mount { position: relative; padding: 34px 24px 24px; background: radial-gradient(circle at 12% 18%,#d7f6ec 0,transparent 30%),var(--mint); border: 1px solid var(--line); border-radius: 18px; overflow: hidden; }
  .live-signal { position: absolute; z-index: 2; top: 12px; left: 34px; display: flex; align-items: center; gap: 8px; padding: 7px 11px; border: 1px solid #b8e8db; border-radius: 99px; background: color-mix(in srgb,var(--surface) 86%,transparent); box-shadow: 0 8px 22px #08785f18; animation: signal-float 2.6s ease-in-out infinite; font-size: 11px; color: var(--accent-text); }
  .live-signal span { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 4px #00aa8625; }
  .live-signal small { color: var(--muted); font-size: 9px; }
  .orbit { position:absolute; border:1px solid #70d7be55; border-radius:50%; pointer-events:none; }
  .orbit-one { width:230px;height:230px;right:-90px;top:-120px;animation:orbit-spin 12s linear infinite; }
  .orbit-two { width:360px;height:360px;left:-220px;bottom:-290px;animation:orbit-spin 18s linear infinite reverse; }
  .screen-scroll { overflow-x: auto; border: 1px solid #dfe6ef; border-radius: 9px; background: linear-gradient(135deg,#f8fafc,#edf3f5); box-shadow: 0 12px 28px -18px #122c2a40; }
  img { display: block; width: auto; min-width: 0; max-width: none; height: 520px; margin: 0 auto; transform: translateY(0); transition: opacity .35s, transform .5s; }
  .screen-in { animation: screen-in .55s ease both; }
  @keyframes screen-in { from { opacity:.35; transform: translateY(8px) scale(.99); } to { opacity:1; transform:none; } }
  @keyframes signal-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }
  @keyframes orbit-spin { to { transform:rotate(360deg); } }
  figcaption { display: flex; align-items: start; justify-content: space-between; gap: 24px; padding: 24px 2px 0; }
  h3 { font-size: 16px; }
  figcaption p { margin-top: 8px; color: var(--muted); font-size: 13px; line-height: 1.8; max-width: 740px; }
  @media (max-width: 600px) {
    .showcase-heading { text-align: left; }
    .screen-switcher { gap: 4px; justify-content: start; margin-block: 22px 18px; }
    .screen-switcher button { padding: 10px; font-size: 11px; gap: 6px; }
    .screen-switcher svg { width: 15px; height: 15px; }
    .screen-mount { padding: 34px 8px 8px; border-radius: 12px; }
    img { height: 300px; margin-inline: 0; }
    .live-signal { left: 16px; font-size: 10px; }
    figcaption { flex-direction: column; gap: 8px; padding-top: 18px; }
  }
  @media (prefers-reduced-motion: reduce) { .live-signal,.orbit,.screen-in { animation: none; } }
</style>

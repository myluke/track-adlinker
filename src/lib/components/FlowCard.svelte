<script lang="ts">
  import { config } from '$lib/config.js';
  import { getCopy } from '$lib/i18n';
  let { copy }: { copy:ReturnType<typeof getCopy> } = $props();
  let active = $state(1);
</script>

<figure class="journey-figure">
  <div class="journey-board">
    <div class="board-head"><span class="eyebrow">{copy.diagramMeta}</span><span class="board-mark" aria-hidden="true">↗</span></div>
    <h2>{copy.diagramTitle}</h2>
    <div class="journey-map">
      <svg class="journey-lines" viewBox="0 0 500 290" preserveAspectRatio="none" aria-hidden="true"><path d="M80 78H230Q250 78 250 98V178Q250 198 270 198H420"/><path class="feedback-line" d="M420 228V254H80V110"/></svg>
      <button class="journey-node tiktok-node" class:active={active === 0} onclick={() => active = 0} aria-pressed={active === 0} aria-label={copy.stages[0]}>
        <span class="platform-icon tiktok-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M18 5v16a5 5 0 1 1-4-4.9M18 5c0 5 3 7 7 7"/></svg></span><strong>TikTok</strong><small>{copy.stages[0]}</small>
      </button>
      <button class="journey-node adlinker-node" class:active={active === 1} onclick={() => active = 1} aria-pressed={active === 1} aria-label={copy.stages[1]}>
        <span class="platform-icon adlinker-icon"><img src={config.brand.icon} alt="" width="48" height="48" /></span><strong>{config.brand.name}</strong><small>{copy.stages[1]}</small>
      </button>
      <button class="journey-node whatsapp-node" class:active={active === 2} onclick={() => active = 2} aria-pressed={active === 2} aria-label={copy.stages[2]}>
        <span class="platform-icon whatsapp-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M7 25l-1 4 5-2a12 12 0 1 0-4-2Z"/><path d="M12 10c-4 5 4 13 9 9l-3-3-2 1-2-2 1-2Z"/></svg></span><strong>WhatsApp</strong><small>{copy.stages[2]}</small>
      </button>
      <button class="feedback-chip" class:active={active === 3} onclick={() => active = 3} aria-pressed={active === 3}>↶ {copy.stages[3]}</button>
      <span class="signal-dot first" aria-hidden="true"></span><span class="signal-dot second" aria-hidden="true"></span>
    </div>
    <div class="journey-detail" aria-live="polite"><span class="detail-number">0{active + 1}</span><div><strong>{copy.stages[active]}</strong><p>{copy.stageNotes[active]}</p></div><span class="detail-check" aria-hidden="true">✓</span></div>
  </div>
  <figcaption>{copy.diagramCaption}</figcaption>
</figure>

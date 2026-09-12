import { config } from '$lib/config.js';
import { locales } from '$lib/i18n';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) => resolve(event, {
  transformPageChunk: ({ html }) => html
    .replace('%site.lang%', locales.find((l) => l.code === event.params.lang)?.hreflang ?? 'zh-Hans')
    .replace('%site.theme%', config.appearance.defaultTheme)
    .replace('%site.accent%', config.appearance.accentColor)
});

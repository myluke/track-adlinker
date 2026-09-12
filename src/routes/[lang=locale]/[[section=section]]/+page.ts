import { locales, getCopy } from '$lib/i18n';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => locales.flatMap(({ code }) =>
  ['', 'why', 'calculator', 'contact', 'tiktok-whatsapp-tracking', 'tiktok-events-api-whatsapp', 'terms', 'privacy'].map((section) => ({ lang: code, section }))
);
export const load: PageLoad = ({ params }) => ({
  lang: params.lang,
  section: params.section || 'home',
  copy: getCopy(params.lang)
});

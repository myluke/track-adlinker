import { locales } from '$lib/i18n';
export function match(value: string) { return locales.some((locale) => locale.code === value); }

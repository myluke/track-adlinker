import en from '../../locales/en.json' with { type: 'json' };
import zhHans from '../../locales/zh-hans.json' with { type: 'json' };
import zhHant from '../../locales/zh-hant.json' with { type: 'json' };
import ko from '../../locales/ko.json' with { type: 'json' };
import ja from '../../locales/ja.json' with { type: 'json' };
import pt from '../../locales/pt.json' with { type: 'json' };
import es from '../../locales/es.json' with { type: 'json' };

export const locales = [
  { code: 'en', label: 'English', hreflang: 'en' }, { code: 'zh-hans', label: '简体中文', hreflang: 'zh-Hans' },
  { code: 'zh-hant', label: '繁體中文', hreflang: 'zh-Hant' }, { code: 'ko', label: '한국어', hreflang: 'ko' },
  { code: 'ja', label: '日本語', hreflang: 'ja' }, { code: 'pt', label: 'Português', hreflang: 'pt' }, { code: 'es', label: 'Español', hreflang: 'es' }
];

const messages = { en, 'zh-hans': zhHans, 'zh-hant': zhHant, ko, ja, pt, es };

/** @param {string} code */
export function getCopy(code) {
  const locale = /** @type {keyof typeof messages} */ (code);
  return { ...(messages[locale] || messages.en) };
}

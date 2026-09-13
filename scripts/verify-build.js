import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { config } from '../src/lib/config.js';
import { locales } from '../src/lib/i18n.js';

const sections = ['', 'why', 'calculator', 'contact', 'tiktok-whatsapp-tracking', 'tiktok-events-api-whatsapp', 'terms', 'privacy'];
const origin = new URL(config.urls.marketing).origin;
const legalReady = config.legal.reviewed && config.legal.entity && config.legal.governingLaw && config.legal.effectiveDate && config.contact.supportEmail;
const escape = (value) => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const sitemap = [];
for (const locale of locales) for (const section of sections) {
  const path = `/${locale.code}/${section ? section + '/' : ''}`;
  const html = readFileSync(`build${path}index.html`, 'utf8');
  assert.ok(html.includes(`lang="${locale.hreflang}"`), `html lang: ${path}`);
  assert.ok(html.includes(`rel="canonical" href="${origin}${path}"`), `canonical: ${path}`);
  assert.ok((html.match(/rel="alternate"/g) || []).length >= 2, `hreflang: ${path}`);
  assert.ok(html.includes('id="main"'), `main: ${path}`);
  assert.doesNotMatch(html, /[\u2190-\u2bff\u{1f000}-\u{1faff}\ufe0f]/u, `Unicode icon instead of SVG: ${path}`);
  for (const match of html.matchAll(/<svg\b[^>]*class="ui-icon"[^>]*>([\s\S]*?)<\/svg>/g)) {
    assert.match(match[0], /aria-hidden="true"/, `decorative icon accessibility: ${path}`);
    assert.match(match[1], /<path d="[^"]+"/, `missing SVG icon path: ${path}`);
  }
  assert.ok(/<title>[^<]+<\/title>/.test(html), `title: ${path}`);
  assert.ok(/<meta name="description" content="[^"]+"/.test(html), `description: ${path}`);
  assert.ok(/<h1\b[^>]*>/.test(html), `h1: ${path}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(schemas.length, `schema: ${path}`);
  for (const [, json] of schemas) assert.doesNotThrow(() => JSON.parse(json), `invalid JSON-LD: ${path}`);
  for (const match of html.matchAll(/<(?:a|link|img|script)\b[^>]*?\b(?:href|src)="([^"]+)"/g)) {
    const target = new URL(match[1].replaceAll('&amp;','&'), origin + path);
    if (target.origin !== origin) continue;
    const asset = decodeURIComponent(target.pathname);
    assert.ok(existsSync(`build${asset}${asset.endsWith('/') ? 'index.html' : ''}`), `broken local link ${path} -> ${asset}`);
  }
  const externalScripts = [...html.matchAll(/<script[^>]+src="((?:https?:)?\/\/[^\"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(externalScripts, ['https://www.googletagmanager.com/gtag/js?id=G-3L5MT2S20P'], `external runtime: ${path}`);
  assert.equal((html.match(/gtag\('config', 'G-3L5MT2S20P'\)/g) || []).length, 1, `Google Analytics config: ${path}`);
  if ((section === 'terms' || section === 'privacy') && !legalReady) assert.ok(html.includes('noindex,follow'), `legal draft indexing: ${path}`);
  else sitemap.push(`${origin}${path}`);
}
assert.ok(existsSync('build/404.html'), 'No static 404');
assert.ok(!existsSync('build/_worker.js') && !existsSync('build/functions'), 'Unexpected server runtime');
writeFileSync('build/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
writeFileSync('build/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap.map((url) => `<url><loc>${escape(url)}</loc></url>`).join('')}</urlset>`);
writeFileSync('build/404.html', readFileSync('static/404.html','utf8').replaceAll('AdLinker', escape(config.brand.name)));
console.log(`Verified 56 localized pages, canonical/hreflang, local links/assets, legal noindex and static-only output; generated sitemap (${sitemap.length} URLs) and robots.txt.`);

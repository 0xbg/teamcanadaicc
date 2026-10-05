// ===== BUILD-TIME FRENCH RENDERING =====
// Every component carries both languages as data-lang-en / data-lang-fr
// attributes, with English as the rendered text. The /fr/* pages render the
// same components, and this middleware swaps the French copy in before the
// HTML is written to disk — so French ships as real markup, crawlable and
// correct before any script runs, without forking every component.
//
// Output is static, so this runs once per page during `astro build` (and on
// each request in `astro dev`). The blog is excluded: it is already
// per-locale and renders French natively.
import { defineMiddleware } from 'astro:middleware';
import { parse, type HTMLElement } from 'node-html-parser';
import { localizeHref, publicPath } from './consts';

const isFrenchTwin = (path: string) =>
  (path === '/fr' || path.startsWith('/fr/')) && !path.startsWith('/fr/blog');

export function translateToFrench(html: string): string {
  const root = parse(html, { comment: true });

  root.querySelector('html')?.setAttribute('lang', 'fr');

  // Element content. Outer elements come first in document order, so a
  // nested data-lang element is simply replaced along with its parent.
  for (const el of root.querySelectorAll('[data-lang-fr]')) {
    el.set_content(el.getAttribute('data-lang-fr') ?? '');
  }

  const attrSwaps: Array<[string, string]> = [
    ['data-lang-fr-placeholder', 'placeholder'],
    ['data-lang-fr-aria', 'aria-label'],
    ['data-lang-fr-alt', 'alt'],
    ['data-lang-fr-desc', 'content'],
  ];
  for (const [source, target] of attrSwaps) {
    for (const el of root.querySelectorAll(`[${source}]`)) {
      el.setAttribute(target, el.getAttribute(source) ?? '');
    }
  }

  // Internal links point at the French twin when there is one. Elements that
  // must keep their target (the language toggle's EN link) opt out.
  for (const a of root.querySelectorAll('a[href]') as HTMLElement[]) {
    if (a.hasAttribute('data-keep-href')) continue;
    const href = a.getAttribute('href');
    if (href) a.setAttribute('href', localizeHref(href));
  }

  return root.toString();
}

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!isFrenchTwin(publicPath(context.url.pathname))) return response;

  const type = response.headers.get('content-type');
  if (type && !type.includes('text/html')) return response;

  const html = await response.text();
  return new Response(translateToFrench(html), {
    status: response.status,
    headers: response.headers,
  });
});

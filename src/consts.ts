// Site-wide facts that used to be repeated across components. The Pages
// Function in functions/api/inquiry.ts keeps its own copy of PHONE because it
// is bundled separately from the Astro build.

export const SITE_URL = 'https://teamcanadaicc.ca';

export const PHONE_DISPLAY = '514-573-6758';
export const PHONE_HREF = 'tel:+15145736758';

/** Partnership enquiries; also the Reply-To on the package email. */
export const EMAIL_PARTNERSHIPS = 'partnerships@teamcanadaicc.ca';
/** Privacy, access requests and accessibility feedback. */
export const EMAIL_PRIVACY = 'privacy@teamcanadaicc.ca';

export const INSTAGRAM_URL = 'https://www.instagram.com/teamcanadaicc/';

/** Evaluated at build time — the copyright line follows the deploy year. */
export const COPYRIGHT_YEAR = new Date().getFullYear();

export type Lang = 'en' | 'fr';

/**
 * Pages that exist in both languages, keyed by their English path. The French
 * twin lives under /fr; the blog has its own per-locale routing and is mapped
 * separately.
 */
export const LOCALIZED_PATHS = ['/', '/sponsor', '/privacy', '/terms', '/accessibility'] as const;

/**
 * The public URL path for a page. Pages build as `sponsor.html` (see
 * astro.config.mjs), so at build time Astro.url.pathname can carry the
 * extension or an index; the site itself is served slash- and extension-less.
 */
export function publicPath(pathname: string): string {
  const p = pathname.replace(/(?:\/index)?\.html$/, '').replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

/** The same page in the other language, or null when it has no twin. */
export function alternatePath(pathname: string, target: Lang): string | null {
  const path = publicPath(pathname);
  const isFr = path === '/fr' || path.startsWith('/fr/');
  const enPath = isFr ? publicPath(path.slice(3) || '/') : path;

  if (enPath === '/en/blog' || enPath.startsWith('/blog')) return null;
  if (!(LOCALIZED_PATHS as readonly string[]).includes(enPath)) return null;

  if (target === 'en') return enPath;
  return enPath === '/' ? '/fr' : `/fr${enPath}`;
}

/** Rewrites an internal English href to its French twin, keeping any hash. */
export function localizeHref(href: string): string {
  const m = href.match(/^(\/[^#?]*)?([?#].*)?$/);
  if (!m || !href.startsWith('/')) return href;
  const [, path = '/', rest = ''] = m;
  if (path === '/en/blog' || path.startsWith('/en/blog/')) return '/fr/blog' + rest;
  const fr = alternatePath(path, 'fr');
  return fr ? fr + rest : href;
}

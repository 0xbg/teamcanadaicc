import { describe, expect, it } from 'vitest';
import { alternatePath, localizeHref, publicPath } from '../src/consts';

describe('publicPath', () => {
  it.each([
    ['/', '/'],
    ['/index.html', '/'],
    ['/sponsor.html', '/sponsor'],
    ['/sponsor/', '/sponsor'],
    ['/fr.html', '/fr'],
    ['/fr/sponsor.html', '/fr/sponsor'],
    ['/fr/blog/route-vers-lyon.html', '/fr/blog/route-vers-lyon'],
  ])('%s -> %s', (input, expected) => {
    expect(publicPath(input)).toBe(expected);
  });
});

describe('alternatePath', () => {
  it('pairs every localized page with its twin', () => {
    expect(alternatePath('/', 'fr')).toBe('/fr');
    expect(alternatePath('/fr', 'en')).toBe('/');
    expect(alternatePath('/sponsor.html', 'fr')).toBe('/fr/sponsor');
    expect(alternatePath('/fr/privacy', 'en')).toBe('/privacy');
  });

  it('has no twin for pages that exist in one language only', () => {
    expect(alternatePath('/homepage2', 'fr')).toBeNull();
    expect(alternatePath('/404', 'fr')).toBeNull();
    expect(alternatePath('/fr/blog', 'en')).toBeNull();
  });
});

describe('localizeHref', () => {
  it.each([
    ['/sponsor#inquiry', '/fr/sponsor#inquiry'],
    ['/', '/fr'],
    ['/en/blog', '/fr/blog'],
    ['/privacy', '/fr/privacy'],
    ['#faq', '#faq'],
    ['/homepage2', '/homepage2'],
    ['/partnership-package.pdf', '/partnership-package.pdf'],
    ['mailto:privacy@teamcanadaicc.ca', 'mailto:privacy@teamcanadaicc.ca'],
    ['https://www.sirha.com/', 'https://www.sirha.com/'],
  ])('%s -> %s', (input, expected) => {
    expect(localizeHref(input)).toBe(expected);
  });
});

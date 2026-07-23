/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*.mdx' {
  import type { AstroComponentFactory } from 'astro';
  const component: AstroComponentFactory;
  export default component;
}
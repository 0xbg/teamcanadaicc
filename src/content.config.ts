import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  // Function form so `image()` is available: featuredImage is a real asset
  // reference now, resolved relative to the .mdx file and optimized at build.
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    lang: z.enum(['fr', 'en']),
    translationId: z.string(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featuredImage: image().optional(),
    author: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
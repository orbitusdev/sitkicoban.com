import type { MetadataRoute } from 'next';
import { buildSitemap } from '@orbitusdev/core/seo/sitemap';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = buildSitemap({
    baseUrl: 'https://orbitus.dev',
    entries: ['/', '/docs', { url: '/storybook', changeFrequency: 'weekly', priority: 0.7 }],
  });

  return entries as MetadataRoute.Sitemap;
}

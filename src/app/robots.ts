import type { MetadataRoute } from 'next';
import { buildRobots } from '@orbitusdev/core/seo/robots';

export default function robots(): MetadataRoute.Robots {
  const cfg = buildRobots({
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/private', '/admin'],
    },
    sitemap: ['https://orbitus.dev/sitemap.xml'],
    host: 'https://orbitus.dev',
  });

  return cfg as MetadataRoute.Robots;
}

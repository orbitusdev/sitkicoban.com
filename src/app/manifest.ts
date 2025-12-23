import type { MetadataRoute } from 'next';
import { buildManifest } from '@orbitusdev/core/pwa/manifest';

export default function manifest(): MetadataRoute.Manifest {
  const manifestObj = buildManifest({
    name: 'Orbitus',
    shortName: 'Orbitus',
    description: 'Orbitus web application',
    themeColor: '#000000',
    backgroundColor: '#ffffff',
    startUrl: '/',
    scope: '/',
    display: 'standalone',
    icons: [
      { src: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  });

  return manifestObj as MetadataRoute.Manifest;
}

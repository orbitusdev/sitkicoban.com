import path from 'node:path';
import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone', // For Docker deployment
  outputFileTracingRoot: path.join(__dirname, '../../'), // Monorepo root for standalone output
  transpilePackages: [
    '@orbitusdev/core',
    '@orbitusdev/components',
    '@orbitusdev/database',
    '@orbitusdev/i18n',
    '@orbitusdev/api',
  ],
  serverExternalPackages: [
    '@opentelemetry/instrumentation',
    '@opentelemetry/sdk-node',
    'import-in-the-middle',
    'require-in-the-middle',
  ],
};

export default withNextIntl(withBundleAnalyzer(nextConfig));

import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Config } from 'tailwindcss';
import baseConfig from '@orbitusdev/components/tailwind.config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Dynamically resolve @orbitusdev/components path
// This usually resolves to .../dist/index.js
const componentsEntry = require.resolve('@orbitusdev/components');
const componentsDir = path.dirname(componentsEntry); // .../dist

// Define paths to scan:
// 1. The resolved directory (dist) - for production/external usage
// 2. The sibling src directory - for local development (DX)
const componentsContent = [
  path.join(componentsDir, '**/*.{js,jsx}'),
  path.join(componentsDir, '../src/**/*.{js,jsx,ts,tsx}'),
];

// Tailwind v4: PostCSS plugin scans local files automatically,
// but monorepo packages need explicit paths
const config: Config = {
  ...baseConfig,
  content: [path.join(__dirname, 'src/**/*.{js,jsx,ts,tsx,md,mdx}'), ...componentsContent],
};

export default config;

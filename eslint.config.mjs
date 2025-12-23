import { next } from '@orbitusdev/eslint-config';
import tseslint from 'typescript-eslint';

const eslintConfig = tseslint.config(
  ...next,
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'node_modules/**',
      'pnpm-lock.yaml',
      '.prettierrc.json',
    ],
  }
);

export default eslintConfig;
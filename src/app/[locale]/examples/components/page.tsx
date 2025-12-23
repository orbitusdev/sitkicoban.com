import { GithubButtonWithStats, VercelDeployButton } from '@orbitusdev/components/buttons';

export default function Test() {
  return (
    <div className="mx-auto my-36 max-w-7xl rounded-2xl border-t border-gray-200/50 bg-linear-to-r from-white/40 via-white/60 to-white/40 py-10 text-center shadow-2xl shadow-black/5 backdrop-blur-sm dark:border-gray-800/50 dark:from-gray-900/40 dark:via-gray-900/60 dark:to-gray-900/40">
      <h3 className="mb-4 text-4xl font-semibold text-gray-900 dark:text-white">
        Github Stats Button Test
      </h3>
      <div className="flex flex-col items-center justify-center gap-3 pb-8 sm:flex-row">
        <GithubButtonWithStats githubUrl="https://github.com/orbitusdev/orbitus" />
        <VercelDeployButton
          repositoryUrl="https://github.com/orbitusdev/orbitus"
          previewUrl="https://preview.orbitus.dev"
        />
      </div>
    </div>
  );
}

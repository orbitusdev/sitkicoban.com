import { ImageResponse } from 'next/og';
import { buildOGImageTemplate, OG_IMAGE_DIMENSIONS } from '@orbitusdev/core/seo/og';

export const runtime = 'edge';

const font = fetch(new URL('../../../../public/fonts/Inter-SemiBold.otf', import.meta.url)).then(
  (res) => res.arrayBuffer()
);

export async function GET(): Promise<ImageResponse> {
  return new ImageResponse(
    buildOGImageTemplate({
      title: 'Orbitus',
      description: 'Create beautiful websites with Orbitus.',
    }),
    {
      ...OG_IMAGE_DIMENSIONS,
      fonts: [
        {
          name: 'inter',
          data: await font,
          style: 'normal',
        },
      ],
    }
  );
}

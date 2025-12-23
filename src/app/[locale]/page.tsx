'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button, ConfettiBanner, CopyRight } from '@orbitusdev/components';
import { telemetry } from '@orbitusdev/core/services/telemetry';

export default function Home() {
  const t = useTranslations('app');
  // Start a span for page rendering
  const span = telemetry.startSpan({
    name: 'home-page-render',
    kind: 'server',
    attributes: {
      'page.path': '/',
      'page.name': 'home',
    },
  });

  // Add log event to the span
  telemetry.addEvent(span, {
    name: 'page.rendered',
    attributes: {
      'user.action': 'view_homepage',
      timestamp: Date.now(),
    },
  });

  // Simulate an error scenario (you can trigger this conditionally)
  try {
    // Your business logic here
    const randomValue = Math.random();
    if (randomValue > 0.8) {
      throw new Error('Simulated error for OpenTelemetry testing');
    }

    telemetry.addEvent(span, {
      name: 'operation.success',
      attributes: { value: randomValue },
    });
  } catch (error) {
    // Record error in the span
    telemetry.recordException(span, error as Error, {
      'error.type': 'SimulatedError',
    });
  } finally {
    // Always end the span
    telemetry.endSpan(span, 'ok');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <Image src="/orbitus-light-logo.svg" alt="Orbitus Logo" width={417} height={100} />
        <br />
        <h1 className="text-5xl font-bold text-center">{t('hero.title')}</h1>
        <p className="text-xl text-center text-zinc-600 dark:text-zinc-400">{t('hero.subtitle')}</p>
        <button className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity">
          {t('hero.cta')}
        </button>
        <Button variant="outline">Button</Button>
        <ConfettiBanner
          href={'https://orbitus.dev/school-pride-edition'}
          badge={'SCHOOL PRIDE EDITION'}
          icon={'🎉'}
          text={'The Orbitus School Pride Edition is here!'}
          confettiEffect="school-pride"
          confettiEnabled={true}
          confettiIntensity="high"
          animated={false}
        />
        <CopyRight className="mt-20" />
      </main>
    </div>
  );
}

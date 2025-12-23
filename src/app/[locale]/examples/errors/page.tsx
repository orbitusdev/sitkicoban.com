'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ErrorMessage } from '@orbitusdev/components';
import { createI18nError, isI18nError, unsupportedServiceI18nError } from '@orbitusdev/core/utils';

/**
 * Example page demonstrating i18n error handling across packages
 */
export default function ErrorExamplePage() {
  const t = useTranslations();
  const [error, setError] = useState<Error | null>(null);

  const triggerI18nError = () => {
    try {
      // Simulate an error from core package
      throw createI18nError('common.errors.network');
    } catch (e) {
      setError(e as Error);
    }
  };

  const triggerUnsupportedService = () => {
    try {
      // This will throw an i18n error
      unsupportedServiceI18nError('gitlab', 'Only GitHub is supported at this time');
    } catch (e) {
      setError(e as Error);
    }
  };

  const triggerGenericError = () => {
    try {
      throw new Error('This is a plain error message');
    } catch (e) {
      setError(e as Error);
    }
  };

  const clearError = () => setError(null);

  // Translate the error if it's an i18n error
  const getErrorMessage = (err: Error): string => {
    if (isI18nError(err)) {
      // Replace placeholders with params
      let message = t(err.i18nKey as never);
      if (err.i18nParams) {
        Object.entries(err.i18nParams).forEach(([key, value]) => {
          message = message.replace(`{${key}}`, String(value));
        });
      }
      return message;
    }
    return err.message;
  };

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">I18n Error Handling Example</h1>

      <div className="mb-8 space-y-4">
        <p className="text-gray-600">
          This example demonstrates how to use i18n-aware errors across the monorepo:
        </p>
        <ul className="list-inside list-disc space-y-2 text-gray-600">
          <li>
            <strong>@orbitusdev/core</strong> throws errors with i18n keys
          </li>
          <li>
            <strong>@orbitusdev/components</strong> displays error messages
          </li>
          <li>
            <strong>@orbitusdev/app</strong> translates the keys using next-intl
          </li>
        </ul>
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={triggerI18nError}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Trigger Network Error (i18n)
        </button>
        <button
          type="button"
          onClick={triggerUnsupportedService}
          className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Trigger Unsupported Service (i18n)
        </button>
        <button
          type="button"
          onClick={triggerGenericError}
          className="rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
        >
          Trigger Generic Error
        </button>
        {error && (
          <button
            type="button"
            onClick={clearError}
            className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Clear Error
          </button>
        )}
      </div>

      {error && (
        <div className="space-y-4">
          <ErrorMessage
            messageKey={isI18nError(error) ? error.i18nKey : undefined}
            message={getErrorMessage(error)}
            variant="error"
          />

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold">Error Details:</h3>
            <pre className="text-sm text-gray-700">
              {JSON.stringify(
                {
                  isI18n: isI18nError(error),
                  i18nKey: isI18nError(error) ? error.i18nKey : 'N/A',
                  i18nParams: isI18nError(error) ? error.i18nParams : 'N/A',
                  message: error.message,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

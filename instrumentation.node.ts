import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { envDetector, hostDetector, osDetector } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';

// Check if Grafana Cloud or standard OTLP is configured
const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const otlpHeaders = process.env.OTEL_EXPORTER_OTLP_HEADERS;

// Parse headers if provided
const headers: Record<string, string> = {};
if (otlpHeaders) {
  // Handle both formats:
  // 1. "Authorization=Basic token" (space already decoded)
  // 2. "Authorization=Basic%20token" (URL encoded space)
  const decodedHeaders = decodeURIComponent(otlpHeaders);
  decodedHeaders.split(',').forEach((header) => {
    const separatorIndex = header.indexOf('=');
    if (separatorIndex > 0) {
      const key = header.substring(0, separatorIndex).trim();
      const value = header.substring(separatorIndex + 1).trim();
      headers[key] = value;
    }
  });
}

// Determine if we're using Grafana Cloud (OTLP gateway) or local endpoint
const isGrafanaCloud = otlpEndpoint?.includes('grafana.net');

// Trace exporter configuration
const traceExporter = new OTLPTraceExporter({
  url: isGrafanaCloud
    ? `${otlpEndpoint}/v1/traces`
    : otlpEndpoint || 'http://localhost:4318/v1/traces',
  headers,
});

// Metrics exporter configuration
const metricExporter = new OTLPMetricExporter({
  url: isGrafanaCloud
    ? `${otlpEndpoint}/v1/metrics`
    : otlpEndpoint || 'http://localhost:4318/v1/metrics',
  headers,
});

// Log configuration for debugging (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.warn('[OpenTelemetry] Configuration:', {
    serviceName: process.env.OTEL_SERVICE_NAME ?? 'orbitus-base',
    traceUrl: isGrafanaCloud
      ? `${otlpEndpoint}/v1/traces`
      : otlpEndpoint || 'http://localhost:4318/v1/traces',
    metricsUrl: isGrafanaCloud
      ? `${otlpEndpoint}/v1/metrics`
      : otlpEndpoint || 'http://localhost:4318/v1/metrics',
    hasAuthHeader: !!headers.Authorization,
    environment: process.env.OTEL_ENVIRONMENT,
  });
}

const sdk = new NodeSDK({
  serviceName: process.env.OTEL_SERVICE_NAME ?? 'orbitus-base',
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 60000, // Export metrics every 60 seconds
  }),
  // Detect and merge resource attributes from environment (service.namespace, etc.)
  resourceDetectors: [envDetector, hostDetector, osDetector],
  instrumentations: [
    new HttpInstrumentation({
      ignoreIncomingRequestHook: (request) => {
        // Ignore health check and static assets
        const ignorePaths = ['/_next/', '/static/', '/favicon.ico', '/health'];
        return ignorePaths.some((path) => request.url?.includes(path));
      },
    }),
    new FetchInstrumentation({
      ignoreUrls: [/_next\/static/, /\/favicon\.ico/],
    }),
  ],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .catch((error: unknown) => console.error('Error terminating OpenTelemetry', error))
    .finally(() => process.exit(0));
});

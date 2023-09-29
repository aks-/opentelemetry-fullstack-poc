const { DiagConsoleLogger, DiagLogLevel, diag } = require('@opentelemetry/api');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');

const {
    MeterProvider,
    PeriodicExportingMetricReader,
} = require('@opentelemetry/sdk-metrics');
const { Resource } = require('@opentelemetry/resources');
const {
    SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);


const metricExporter = new OTLPMetricExporter({
    // looks like the endpoint doesn't exist
    url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`,
});

const meterProvider = new MeterProvider({
    // NOTE: this is hardcoded to server 1
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'otel-fullstack-poc-server1-metrics',
    }),
});

meterProvider.addMetricReader(
  new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 1000,
  })
);

module.exports = meterProvider;

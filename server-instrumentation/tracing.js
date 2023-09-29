const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { diag, DiagConsoleLogger, DiagLogLevel, trace } = require('@opentelemetry/api');
const { W3CTraceContextPropagator } = require("@opentelemetry/core");
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');


diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

function instrument(serviceName) {
    const collectorOptions = {
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    };

    const provider = new NodeTracerProvider(
        {
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
            }),
        }
    );

    const exporter = new OTLPTraceExporter(collectorOptions);
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

    registerInstrumentations({
        instrumentations: [
            getNodeAutoInstrumentations(),
            new ExpressInstrumentation(),
            new HttpInstrumentation(),
        ],
    });

    provider.register({
        propagator: new W3CTraceContextPropagator(),
    });

    trace.getTracer(serviceName);
}

module.exports = instrument;

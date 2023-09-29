import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { Resource, detectResources, browserDetector } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SessionIdProcessor } from './session-id-processor.mjs';
import { ErrorInstrumentation } from './error-instrumentation.mjs';
import { PerfInstrumentation } from './perf-observer-instrumentation.mjs';
import { WebVitalsInstrumentation } from './web-vitals-instrumentation.mjs';

const FrontendTracer = async (collectorString) => {
    const { ZoneContextManager } = await import('@opentelemetry/context-zone');

    let resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'otel-fullstack-poc-frontend',
        'user_agent.original': window.navigator.userAgent,
    });

    const detectedResources = await detectResources({ detectors: [browserDetector] });
    resource = resource.merge(detectedResources);
    const provider = new WebTracerProvider({
        resource
    });

    provider.addSpanProcessor(new SessionIdProcessor());

    provider.addSpanProcessor(
        new BatchSpanProcessor(
            new OTLPTraceExporter({
                url: collectorString || 'http://localhost:4318/v1/traces',
            })
        )
    );

    const contextManager = new ZoneContextManager();

    provider.register({
        contextManager,
        propagator: new W3CTraceContextPropagator(),
    });

    registerInstrumentations({
        tracerProvider: provider,
        instrumentations: [
            getWebAutoInstrumentations({
                '@opentelemetry/instrumentation-fetch': {
                    propagateTraceHeaderCorsUrls: /.*/,
                    clearTimingResources: true,
                    applyCustomAttributesOnSpan(span) {
                        span.setAttribute('fetch-request', 'true');
                    },
                },
            }),
            new ErrorInstrumentation(),
            new PerfInstrumentation(),
            new WebVitalsInstrumentation(),
        ],
    });
};

export default FrontendTracer;

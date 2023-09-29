import FrontendTracer from "./web-instrumentation/tracing.mjs";
import { trace, context, SpanKind } from '@opentelemetry/api';

FrontendTracer(process.env.OTEL_EXPORTER_OTLP_ENDPOINT);

async function longTask() {
    const t0 = performance.now();
    let num = 0;

    for (let i = 0; i < 400_000_000; i++) {
        num += i;
    }

    const t1 = performance.now();

    Promise.reject('I am a dropped promise');

    try {
        const tracer = trace.getTracer('otel-fullstack-poc-frontend');
        const activeContext = context.active();
        const span = tracer.startSpan('frontend-long-task', {
            kind: SpanKind.CLIENT,
            attributes: {
                'frontend-long-task': 'going to make some fetch calls',
            },
        }, activeContext);

        const response = await fetch("http://localhost:3001/call-2-sleep3sec-services")

        if (!response.ok) {
            span.recordException(new Error('Failed to call /call-2-sleep3sec-services'));
            throw new Error("Request failed");
        }

        document.getElementById('server-response').textContent = `Server response: ${response.status}`;

        span.setAttribute('server1-call-2-sleep3sec-services', 'hit');

        const response2 = await fetch("http://localhost:3001/fail-server2");

        if (!response2.ok) {
            span.recordException(new Error('Failed to call /fail-server2'));
            span.end();
            throw new Error("Request failed");
        }
        span.end();
    } catch (error) {
        console.error(error);
    }

    document.getElementById('root').innerHTML = `This is rendered after a long task!!! The sum is ${num}`;
    console.log(`Long task took ${t1 - t0} milliseconds.`);
}

setTimeout(longTask, 1000);

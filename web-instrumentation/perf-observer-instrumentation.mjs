import { InstrumentationBase } from '@opentelemetry/instrumentation';

export class PerfInstrumentation extends InstrumentationBase {
    constructor(config = {}) {
        super('perf-instrumentation', '0.0.1', ({ ...config }));
    }

    enable() {
        if (!window.PerformanceObserver) {
            // Nothing to do, let the object live, it's okay
            return null;

        }
        this._observeLongTasks();
    }

    _observeLongTasks () {
        this._longtaskObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                const span = this.tracer.startSpan(
                    'web-perf-longtask',
                    {
                        startTime: entry.startTime,
                    }
                );

                const { name, entryType, duration, attribution } = entry;
                span.setAttribute('component', 'web-perf-longtask');
                span.setAttribute('longtask.name', name);
                span.setAttribute('longtask.entry_type', entryType);
                span.setAttribute('longtask.duration', duration);


                if (Array.isArray(attribution)) {
                    attribution.forEach((attribution, idx) => {
                        const prefix = attribution > 1 ? `longtask.attribution[${idx}]` : 'longtask.attribution';
                        span.setAttribute(`${prefix}.name`, attribution.name);
                        span.setAttribute(`${prefix}.entry_type`, attribution.entryType);
                        span.setAttribute(`${prefix}.start_time`, attribution.startTime);
                        span.setAttribute(`${prefix}.duration`, attribution.duration);
                        span.setAttribute(`${prefix}.container_type`, attribution.containerType);
                        span.setAttribute(`${prefix}.container_src`, attribution.containerSrc);
                        span.setAttribute(`${prefix}.container_id`, attribution.containerId);
                        span.setAttribute(`${prefix}.container_name`, attribution.containerName);
                    });
                }

                span.end(entry.startTime + entry.duration);
            });
        });


        this._longtaskObserver.observe({ type: 'longtask', buffered: true });
    }
}


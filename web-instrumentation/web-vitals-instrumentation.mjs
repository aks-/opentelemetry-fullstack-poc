import { context, trace } from '@opentelemetry/api'
import { hrTime } from '@opentelemetry/core'
import { InstrumentationBase } from '@opentelemetry/instrumentation'
import { onCLS, onFID, onLCP } from 'web-vitals'

export class WebVitalsInstrumentation extends InstrumentationBase {
    constructor(config = {}) {
        super('WebVitalsInstrumentation', '1.0', config)
    }
    onReport(metric, parentSpanContext) {
        const now = hrTime()
        // start the span
        const webVitalsSpan = trace
            .getTracer('web-vitals-instrumentation')
            .startSpan(metric.name, { startTime: now }, parentSpanContext)
        // add core web vital attributes
        webVitalsSpan.setAttributes({
            [`web_vital.name`]: metric.name,
            [`web_vital.id`]: metric.id,
            [`web_vital.navigationType`]: metric.navigationType,
            [`web_vital.delta`]: metric.delta,
            [`web_vital.rating`]: metric.rating,
            [`web_vital.value`]: metric.value,
            // can expand these into their own attributes!
            [`web_vital.entries`]: JSON.stringify(metric.entries),
        })
        webVitalsSpan.end()
    }
    enable() {
        if (this.firstPassComplete) {
            return
        }
        this.firstPassComplete = true
        const parentSpan = trace.getTracer('web-vitals-instrumentation').startSpan('web-vitals')
        const ctx = trace.setSpan(context.active(), parentSpan)
        parentSpan.end()
        onFID((metric) => {
            this.onReport(metric, ctx)
        })
        onCLS((metric) => {
            this.onReport(metric, ctx)
        })
        onLCP((metric) => {
            this.onReport(metric, ctx)
        })
    }
}

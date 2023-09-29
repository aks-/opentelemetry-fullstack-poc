import shimmer from 'shimmer';
import { InstrumentationBase } from '@opentelemetry/instrumentation';
import { getElementXPath } from '@opentelemetry/sdk-trace-web'

const LEN_LIMIT = 1024;

export class ErrorInstrumentation extends InstrumentationBase {
    constructor(config = {}) {
        super('error-instrumentation', '0.0.1', { ...config });
    }

    _consoleError(original) {
        return (...args) => {
            this.reportError(args);
            return original.apply(this, args);
        };
    }

    _eventHandler (ev, spanType) {
        if (!ev.target && !shouldUseErrorAttrib(ev.type)) {
            return;
        }

        const now = Date.now();
        const span = this.tracer.startSpan(spanType, { startTime: now });
        span.setAttribute('component', 'error');
        span.setAttribute('error.type', ev.type);
        if (ev.target) {
            span.setAttribute('target_element', (ev.target).tagName);
            span.setAttribute('target_xpath', getElementXPath(ev.target, true));
            span.setAttribute('target_src', (ev.target).src);
        }
        span.end(now);
    }

    enable() {
        shimmer.wrap(console, 'error', this._consoleError.bind(this));
        window.addEventListener('unhandledrejection', (ev) => {
            this._eventHandler(ev.reason, 'unhandledrejection');
        });
        window.addEventListener('error', (ev) => {
            this._eventHandler(ev, 'error');
        });
    }

    reportError(e) {
        if (e instanceof Error && shouldReportError(e)) {

            const span = this.tracer.startSpan(source, { startTime: now });
            span.setAttribute('component', 'error');
            span.setAttribute('error', true);
            span.setAttribute('error.object', shouldUseErrorAttrib(err.name) ?
                err.name :
                err.constructor && err.constructor.name ? err.constructor.name : 'Error');
            span.setAttribute('error.message', getSensibleAttrib(msg, MESSAGE_LIMIT));
            if (shouldUseErrorAttrib(err.stack)) {
                span.setAttribute('error.stack', limitLen(err.stack.toString(), MESSAGE_LIMIT));
            }
            span.end(now);
        }
    }
}

function shouldReportError(e) {
    const { stack, message } = e;

    if (stack) {
        return true;
    }

    return shouldUseErrorAttrib(message);
}

function shouldUseErrorAttrib(attrib) {
    return (!!attrib||'').trim() !== false &&
        attrib !== 'error' && attrib !== 'error.' &&
        !(attrib||'').startsWith('[object') && attrib !== 'Script error.';
}

function getSensibleAttrib(attrib) {
    return attrib.length > LEN_LIMIT ? attrib.substring(0, LEN_LIMIT) : attrib;
}

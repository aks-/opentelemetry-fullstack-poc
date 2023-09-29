require('./tracing')('otel-fullstack-poc-server3');
const app = require('express')();
const { sleep3Sec } = require('rust-event-loop-lagger');
const { trace, context } = require('@opentelemetry/api');

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/sleep3sec', async (_, res) => {
    sleep3Sec();
    const span = trace.getSpan(context.active());
    span.setAttribute('sleep3sec', 'hit');
    return res.send('ok');
});

process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection', err);
    const span = trace.getSpan(context.active());
    span.recordException(err);
}).on('uncaughtException', (err) => {
    console.log('uncaughtException', err);
    const span = trace.getSpan(context.active());
    span.recordException(err);
});

app.listen(3003, () => {
    console.log('server3 listening on port 3003');
});


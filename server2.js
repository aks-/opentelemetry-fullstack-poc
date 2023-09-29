require('./tracing')('otel-fullstack-poc-server2');
const app = require('express')();
const { sleep3Sec } = require('rust-event-loop-lagger');
const { trace, context } = require('@opentelemetry/api');

app.get('/', (_, res) => {
    res.send('Hello World!');
});

app.get('/sleep3sec', async (_, res) => {
    sleep3Sec();
    const span = trace.getSpan(context.active());
    span.setAttribute('sleep3sec', 'hit');
    return res.send('ok');
});

app.get('/fail', async (_, res) => {
    const span = trace.getSpan(context.active());
    span.recordException(new Error('I am going to fail with error'));
    return res.status(500).send('fail');
});

process.on('unhandledRejection', (err) => {
    const span = trace.getSpan(context.active());
    span.recordException(err);
    process.exit(1);
}).on('uncaughtException', (err) => {
    const span = trace.getSpan(context.active());
    span.recordException(err);
    process.exit(1);
});

app.listen(3002, () => {
    console.log('server2 listening on port 3002');
});


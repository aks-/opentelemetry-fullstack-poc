require('./server-instrumentation/tracing')('otel-fullstack-poc-server1');
const express = require('express');
const app = express();
const { trace, context } = require('@opentelemetry/api');
const http = require('node:http');
const { sleep3Sec } = require('rust-event-loop-lagger');
const fs = require('fs/promises');

app.use((_, __, next) => {
    const span = trace.getSpan(context.active());
    span.setAttribute('server1-middleware', 'beep');
    next();
});

app.use(express.static('public'))

app.get('/')

app.get('/sleep3sec', async (_, res) => {
    const span = trace.getSpan(context.active());
    span.recordException(new Error('server1 error'));
    sleep3Sec();
    const html = await fs.readFile('./index.html', 'utf-8');
    return res.send(html);
});

app.get('/call-2-sleep3sec-services', async (_, res) => {

    const span = trace.getSpan(context.active());
    span.setAttribute('server1-call-2-sleep3sec-services', 'i am just a slow request');
    try {
        const [res1, res2] = await Promise.all([
            http.get('http://localhost:3002/sleep3sec'),
            http.get('http://localhost:3003/sleep3sec')
        ]);

        let cause = !res1.statusCode === 200 ? await processResponse(res1) : !res2.statusCode === 200 ? await processResponse(res2) : null;

        if (cause) {
            throw new Error('Failed to call /call-2-sleep3sec-services', {
                cause
            });
        }
        return res.send('ok')
    } catch (e) {
        span.recordException(e);
        return res.send('imma ded');
    }
});

app.get('/fail-server2', async (_, res) => {
    const span = trace.getSpan(context.active());
    span.setAttribute('server1-fail-server2', 'i am going to fail coz of server2');

    try {
        const [res1, res2] = await Promise.all([
            http.get('http://localhost:3002/fail'),
            http.get('http://localhost:3003/sleep3sec')
        ]);

        let cause = !res1.statusCode === 200 ? await processResponse(res1) : !res2.statusCode === 200 ? await processResponse(res2) : null;

        if (cause) {
            throw new Error('Failed to call /call-2-sleep3sec-services', {
                cause
            });
        }
        return res.send('ok')
    } catch (e) {
        span.recordException(e);
        return res.send('imma ded');
    }
});

function processResponse(response) {
    return new Promise((resolve, reject) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            resolve(data);
        });

        response.on('error', (err) => {
            reject(err);
        });
    });
}

process.on('unhandledRejection', (err) => {
    const span = trace.getSpan(context.active());
    span.recordException(err);
}).on('uncaughtException', (err) => {
    const span = trace.getSpan(context.active());
    span.recordException(err);
});

app.listen(3001, () => {
    console.log('server1 listening on port 3001');
});

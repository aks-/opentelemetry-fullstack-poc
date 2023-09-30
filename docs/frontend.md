# OpenTelemetry Fullstack POC Frontend Documentation

## Introduction

The OpenTelemetry Fullstack POC Frontend is a web application designed to demonstrate the capabilities of distributed tracing and performance monitoring using OpenTelemetry. This documentation provides an overview of the provided frontend code and explains its functionality.

### Prerequisites

Before diving into the documentation, make sure you have the following prerequisites in place:

1. Node.js: Ensure that Node.js is installed on your machine.

2. Backend Service: Make sure the corresponding backend service, "opentelemetry-fullstack-poc-backend," is running and available at `http://localhost:3001`.

## Frontend Code Overview

The frontend code for the OpenTelemetry Fullstack POC consists of JavaScript code that performs the following tasks:

1. **Setting up Tracing:** It initializes the OpenTelemetry tracer for frontend instrumentation and specifies an OTLP (OpenTelemetry Protocol) endpoint for exporting traces.

2. **Long-Running Task:** It defines a long-running computational task, simulating a CPU-intensive operation.

3. **Tracing of Fetch Calls:** It performs two asynchronous HTTP fetch calls to the backend services and traces them using OpenTelemetry spans.

Let's break down the code step by step.

### Setting up Tracing

```javascript
import FrontendTracer from "./web-instrumentation/tracing.mjs";
import { trace, context, SpanKind } from '@opentelemetry/api';

FrontendTracer(process.env.OTEL_EXPORTER_OTLP_ENDPOINT);
```

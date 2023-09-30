# OpenTelemetry Fullstack POC Documentation

Welcome to the documentation for the OpenTelemetry Fullstack POC (Proof of Concept). This project demonstrates distributed tracing and monitoring using OpenTelemetry. It consists of a frontend application and three backend servers.

## Important Note

**Web Vitals:** The Web Vitals instrumentation and metrics wrok in Chrome browsers. While the project can be used with other browsers, it's recommended to use Chrome for the data accuracy and support.

## Getting Started

To get started, follow the instructions below:

1. Run the frontend server using [esbuild](https://esbuild.github.io/):

```sh
npx esbuild ./frontend.mjs --bundle --format=iife --outfile=public/build.js --watch --define:process.env.OTEL_EXPORTER_OTLP_ENDPOINT=\"https://opentelemetry-collector.example.com/v1/traces\"
```

This command bundles and watches the frontend code and sets the OTEL_EXPORTER_OTLP_ENDPOINT environment variable for trace export.

### Run the backend servers using Node.js and the appropriate environment variable:

Start server1
```sh
OTEL_EXPORTER_OTLP_ENDPOINT=https://opentelemetry-collector.example.com node server1.js
```

Start server2
```sh
OTEL_EXPORTER_OTLP_ENDPOINT=https://opentelemetry-collector.example.com node server2.js
```

Start server3
```sh
OTEL_EXPORTER_OTLP_ENDPOINT=https://opentelemetry-collector.example.com node server3.js
```

These commands set the OTEL_EXPORTER_OTLP_ENDPOINT environment variable for each server and use node for automatic server restarts.

### Documentation
[Click here for frontend documentation](docs/frontend.md)

[Click here for server documentation](docs/server.md)

Please refer to the individual documentation links above for more detailed information about each component of this project.

### Contributions
Contributions to this project are welcome. Please feel free to open issues or submit pull requests to enhance the code, documentation, or suggest scenarios you would like to simulate.

### License
This project is licensed under the MIT License.

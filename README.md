# OpenTelemetry Fullstack POC Documentation

Welcome to the documentation for the OpenTelemetry Fullstack POC (Proof of Concept). This project demonstrates distributed tracing and monitoring using OpenTelemetry. It consists of a frontend application and three backend servers.

## Important Note

**Web Vitals:** The Web Vitals instrumentation and metrics wrok in Chrome browsers. While the project can be used with other browsers, it's recommended to use Chrome for the data accuracy and support.

## Prerequisites

Before you begin, make sure you have the following prerequisites in place:

- **Node.js and npm**: Ensure that you have Node.js and npm (Node Package Manager) installed on your system. You can download them from [nodejs.org](https://nodejs.org/).

- **Rust**: Ensure you have rust installed. You can download it like so https://doc.rust-lang.org/cargo/getting-started/installation.html

- **Rust Event Loop Lagger**: The OpenTelemetry Fullstack POC relies on the `rust-event-loop-lagger` addon to create a 3-second event loop lag for testing purposes. To set up `rust-event-loop-lagger`, follow these steps:

   1. Clone the `rust-event-loop-lagger` repository from [GitHub](https://github.com/aks-/rust-event-loop-lagger).

   2. Navigate to the repository's directory and run the following commands to link it globally:

      ```shell
      npm install
      npm run build
      npm link
      ```

   3. After linking `rust-event-loop-lagger`, navigate to the root directory of the `opentelemetry-fullstack-poc` project and run the following command to link it as a dependency:

      ```shell
      npm install
      npm link rust-event-loop-lagger
      ```

   This setup allows the POC to create the desired event loop lag during testing.


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

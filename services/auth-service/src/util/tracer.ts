/*tracing.ts*/
// Require dependencies
import * as opentelemetry from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

const options = {
  serviceName: 'auth-service', // optional
  // You can use the default UDPSender
  host: process.env.JAEGER_HOST, // optional
  port: 6832, // optional
  // OR you can use the HTTPSender as follows
  // endpoint: 'http://localhost:14268/api/traces',
  maxPacketSize: 65000 // optional
}
const exporterOptions = {
  url: `http://${process.env.OTLP_HOST}:4318/v1/traces`
}

const exporter = new OTLPTraceExporter(exporterOptions);

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new opentelemetry.NodeSDK({
  traceExporter: exporter,
  spanProcessor: new opentelemetry.tracing.SimpleSpanProcessor(exporter),
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new opentelemetry.resources.Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'auth-service',
  })
});

sdk.start()
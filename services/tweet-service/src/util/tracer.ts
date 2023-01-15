/*tracing.ts*/
// Require dependencies
import * as opentelemetry from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const exporterOptions = {
  url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`
}

const exporter = new OTLPTraceExporter(exporterOptions);

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new opentelemetry.NodeSDK({
  traceExporter: exporter,
  spanProcessor: new opentelemetry.tracing.SimpleSpanProcessor(exporter),
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new opentelemetry.resources.Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'tweet-service',
  })
});

sdk.start()
import { App, Annotations } from '@aws-cdk/core';
import { DemoStack } from './stack';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

const DEFAULT_UNDEFINED_STRING = 'undefined';

const ctx = {
  acm: app.node.tryGetContext('acm'),
  zoneId: app.node.tryGetContext('zoneId'),
  zoneName: app.node.tryGetContext('zoneName'),
};

if (!(ctx.acm && ctx.zoneId && ctx.zoneName)) {
  Annotations.of(app).addError('Error: acm, zoneId and zoneName is required');
}


new DemoStack(app, 'asg-stack-dev', {
  env: devEnv,
  acm: ctx.acm || DEFAULT_UNDEFINED_STRING,
  zoneId: ctx.zoneId || DEFAULT_UNDEFINED_STRING,
  zoneName: ctx.zoneName || DEFAULT_UNDEFINED_STRING,
});
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

app.synth();
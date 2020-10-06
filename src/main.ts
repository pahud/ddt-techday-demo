import { App, Annotations, Stack } from '@aws-cdk/core';
import { Demo } from './demo';

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


const stack = new Stack(app, 'DemoStack', { env: devEnv });

if (!(ctx.acm && ctx.zoneId && ctx.zoneName)) {
  Annotations.of(stack).addWarning('Error: acm, zoneId and zoneName is required');
}

new Demo(stack, 'asg-stack-dev', {
  acm: ctx.acm || DEFAULT_UNDEFINED_STRING,
  zoneId: ctx.zoneId || DEFAULT_UNDEFINED_STRING,
  zoneName: ctx.zoneName || DEFAULT_UNDEFINED_STRING,
});
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

app.synth();
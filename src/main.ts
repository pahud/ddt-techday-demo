import { App } from '@aws-cdk/core';
import { DemoStack } from './stack';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

const acm = app.node.tryGetContext('acm');
const zoneId = app.node.tryGetContext('zoneId');
const zoneName = app.node.tryGetContext('zoneName');


if (!(acm && zoneId && zoneName)) {
  throw new Error('Error: acm, zoneId and zoneName is required')
}

new DemoStack(app, 'asg-stack-dev', { 
  env: devEnv, 
  acm,
  zoneId,
  zoneName,
});
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

app.synth();
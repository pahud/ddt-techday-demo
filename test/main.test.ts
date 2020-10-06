import { App, Stack } from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import { Demo } from '../src/demo';

const devEnv = {
  account: '1234567890xx',
  region: 'ap-northeast-1',
};

const mock = {
  acm: 'arn:aws:acm:region:account-id:certificate/zzzzzzz-2222-3333-4444-3edc4rfv5t',
  zoneId: 'XXXXXXXXXXXXX',
  zoneName: 'example.com',
};

test('Snapshot', () => {

  const app = new App();
  const stack = new Stack(app, 'testing', { env: devEnv });
  new Demo(stack, 'testing', {
    acm: mock.acm,
    zoneId: mock.zoneId,
    zoneName: mock.zoneName,
  } );
  expect(stack).not.toHaveResource('AWS::S3::Bucket');
  expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
    MaxSize: '3',
    MinSize: '1',
    DesiredCapacity: '3',
    LaunchConfigurationName: {
      Ref: 'testingwebASGLaunchConfigAD0C50A7',
    },
    Tags: [
      {
        Key: 'Name',
        PropagateAtLaunch: true,
        Value: 'testing/testing/webASG',
      },
    ],
    TargetGroupARNs: [
      {
        Ref: 'testingmyalbmyWebhttpswebServerGroupC563DBDC',
      },
    ],
    VPCZoneIdentifier: [
      {
        Ref: 'testingnewVpcPrivateSubnet1Subnet948383BC',
      },
      {
        Ref: 'testingnewVpcPrivateSubnet2Subnet063DDED4',
      },
    ],
  });
});

test('Snapshot-imput-interface', () => {
  const app = new App();
  const stack = new Stack(app, 'testing', { env: devEnv });
  new Demo(stack, 'testing', {
    acm: 'arn:aws:acm:region:account-id:certificate/zzzzzzz-2222-3333-4444-3edc4rfv5t',
    zoneId: 'XXXXXXXXXXXXX',
    zoneName: 'example.com',
  });
  expect(stack).not.toHaveResource('AWS::S3::Bucket');
  expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
    MaxSize: '3',
    MinSize: '1',
    DesiredCapacity: '3',
    LaunchConfigurationName: {
      Ref: 'testingwebASGLaunchConfigAD0C50A7',
    },
    Tags: [
      {
        Key: 'Name',
        PropagateAtLaunch: true,
        Value: 'testing/testing/webASG',
      },
    ],
    TargetGroupARNs: [
      {
        Ref: 'testingmyalbmyWebhttpswebServerGroupC563DBDC',
      },
    ],
    VPCZoneIdentifier: [
      {
        Ref: 'testingnewVpcPrivateSubnet1Subnet948383BC',
      },
      {
        Ref: 'testingnewVpcPrivateSubnet2Subnet063DDED4',
      },
    ],
  });
});
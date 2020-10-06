import { App } from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import { DemoStack } from '../src/stack';

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
  const stack = new DemoStack(app, 'testing', {
    env: devEnv,
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
      Ref: 'webASGLaunchConfigAD1F9DB3',
    },
    Tags: [
      {
        Key: 'Name',
        PropagateAtLaunch: true,
        Value: 'testing/webASG',
      },
    ],
    TargetGroupARNs: [
      {
        Ref: 'myalbmyWebhttpswebServerGroupAFFC85C2',
      },
    ],
    VPCZoneIdentifier: [
      {
        Ref: 'newVpcPrivateSubnet1Subnet56CFB6C0',
      },
      {
        Ref: 'newVpcPrivateSubnet2Subnet24BF1E14',
      },
    ],
  });
});

test('Snapshot-imput-interface', () => {
  const app = new App();
  const stack = new DemoStack(app, 'testing', {
    env: devEnv,
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
      Ref: 'webASGLaunchConfigAD1F9DB3',
    },
    Tags: [
      {
        Key: 'Name',
        PropagateAtLaunch: true,
        Value: 'testing/webASG',
      },
    ],
    TargetGroupARNs: [
      {
        Ref: 'myalbmyWebhttpswebServerGroupAFFC85C2',
      },
    ],
    VPCZoneIdentifier: [
      {
        Ref: 'newVpcPrivateSubnet1Subnet56CFB6C0',
      },
      {
        Ref: 'newVpcPrivateSubnet2Subnet24BF1E14',
      },
    ],
  });
});

// test('no-input-acm', () => {
//   const app = new App({
//     context: {
//       zoneId: 'XXXXXXXXXXXXX',
//       zoneName: 'example.com',
//     },
//   });
//   expect(()=>{
//     new DemoStack(app, 'testing', {
//       env: devEnv,
//       acm: mock.acm,
//       zoneId: mock.zoneId,
//       zoneName: mock.zoneName,
//     } );
//   }).toThrowError(/ACM ARN is required./);
// });

// test('no-input-zoneId', () => {
//   const app = new App({
//     context: {
//       acm: 'arn:aws:acm:region:account-id:certificate/zzzzzzz-2222-3333-4444-3edc4rfv5t',
//       zoneName: 'example.com',
//     },
//   });
//   expect(()=>{
//     new DemoStack(app, 'testing', {
//       env: devEnv,
//       acm: mock.acm,
//       zoneId: mock.zoneId,
//       zoneName: mock.zoneName,
//     });
//   }).toThrowError(/ZoneId is required./);
// });
// test('no-input-zoneName', () => {
//   const app = new App({
//     context: {
//       zoneId: 'XXXXXXXXXXXXX',
//       acm: 'arn:aws:acm:region:account-id:certificate/zzzzzzz-2222-3333-4444-3edc4rfv5t',
//     },
//   });
//   expect(()=>{
//     new DemoStack(app, 'testing', {
//       env: devEnv,
//       acm: mock.acm,
//       zoneId: mock.zoneId,
//       zoneName: mock.zoneName,
//     });
//   }).toThrowError(/ZoneName is required./);
// });
import * as asing from '@aws-cdk/aws-autoscaling';
import * as certmgr from '@aws-cdk/aws-certificatemanager';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elb from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as r53 from '@aws-cdk/aws-route53';
import * as r53tg from '@aws-cdk/aws-route53-targets';
import { Construct, CfnOutput, Duration } from '@aws-cdk/core';

interface DemoProps {
  /**
   * The ID of the Route 53 Hosted Zone.
   */
  zoneId: string;
  /**
   * The name of the Route 53 Hosted Zone.
   */
  zoneName: string;
  /**
   * The ARN of Amazon Certificate Manager(ACM)
   */
  acm: string;
}

export class Demo extends Construct {
  constructor(scope: Construct, id: string, props: DemoProps) {
    super(scope, id);
    const userData = ec2.UserData.forLinux();
    userData.addCommands(`
set -xe
exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1
yum update -y
yum install docker -y
systemctl start docker
systemctl enable docker
sleep 5
docker run -d -p 80:80 guanyebo/demohttpd:v1
systemctl status amazon-ssm-agent
systemctl enable amazon-ssm-agent
systemctl restart amazon-ssm-agent
exit 0`);
    // define resources here...
    const vpc = new ec2.Vpc(this, 'newVpc', {
      maxAzs: 2,
      natGateways: 1,
    });
    const acmArn = props.acm;
    const acm = certmgr.Certificate.fromCertificateArn(this, 'demoAcm', acmArn);
    const alb = new elb.ApplicationLoadBalancer(this, 'myalb', {
      vpc,
      internetFacing: true,
      loadBalancerName: 'demoalb',
    } );
    const asg = new asing.AutoScalingGroup(this, 'webASG', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ec2.MachineImage.latestAmazonLinux(
        { generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      desiredCapacity: 3,
      spotPrice: '0.0104',
      blockDevices: [
        {
          deviceName: '/dev/xvda',
          volume: asing.BlockDeviceVolume.ebs(30),
        },
      ],
      userData,
    });
    asg.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'ssmmessages:*',
          'ssm:UpdateInstanceInformation',
          'ec2messages:*',
        ],
        resources: ['*'],
      }));
    asg.connections.allowFrom( ec2.Peer.ipv4('0.0.0.0/0'), ec2.Port.tcp(80));
    alb.addListener('myWebhttp', {
      port: 80,
      open: true,
      defaultAction: elb.ListenerAction.redirect( {
        protocol: 'HTTPS',
        host: '#{host}',
        path: '/#{path}',
        query: '/#{query}',
        port: '443',
      }),
    });
    const httpslistener = alb.addListener('myWebhttps', {
      certificates: [acm],
      port: 443,
      open: true,
    });
    httpslistener.addTargets('webServer', {
      port: 80,
      targets: [asg],
    });
    const zoneId = props.zoneId;
    const zoneName = props.zoneName;
    const zone = r53.HostedZone.fromHostedZoneAttributes(this, 'myZone', {
      hostedZoneId: zoneId,
      zoneName: zoneName,
    });
    const r53alias = new r53.ARecord(this, 'alias-alb', {
      zone,
      target: r53.RecordTarget.fromAlias(new r53tg.LoadBalancerTarget(alb)),
      recordName: 'cdkdemo',
      ttl: Duration.minutes(5),
    });
    new CfnOutput(this, 'aliasalbOutput', {
      value: r53alias.domainName,
    });
  }
}
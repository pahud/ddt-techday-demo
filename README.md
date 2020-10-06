# ddt-techday-demo
DDT Tech Day Demo CDK Part.

## Create asg web server. 
![](./image/asg.png)

## Need three value ?!
1. `ZONEID` and `ZONENAME`  like `example.com` and `ZXXXXXXXXXX`  on Rouet53 Page.
![](./image/ddt-tech-r53-1.png)
2. `ACMARN` is Amazon Certificates Manager like
    `arn:aws:acm:region:account-id:certificate/xxxxxxx-oooo-oooo-oooo-xxxxxxxx` .
![](./image/ddt-tech-acm-1.png)

## How to use ?!
```bash
#export ENVVARS 
export ROUTE53_HOST_ZONE_ID=ZXXXXXXXXXX
export ROUTE53_HOST_ZONE_NAME=example.com
export AMAZON_Certificates_Manager_ARN=arn:aws:acm:region:account-id:certificate/xxxxxxx-oooo-oooo-oooo-xxxxxxxx

#To synth 
cdk synth -c zoneName=$ZONENAME  -c zoneId=$ZONEID -c acm=$ACMARN

#To Diff
cdk diff -c -c zoneName=$ZONENAME  -c zoneId=$ZONEID -c acm=$ACMARN

#To Deploy
cdk deploy --require-approval never -c zoneName=$ZONENAME  -c zoneId=$ZONEID -c acm=$ACMARN 

#To Destroy
cdk destroy -f
```
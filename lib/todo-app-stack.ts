import { Duration, Stack, StackProps, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment'
import { Construct } from 'constructs';
import { TodoBackend } from './todo-backend' 
import { SPADeploy} from 'cdk-spa-deploy'

export class TodoAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const todoBackent = new TodoBackend(this, 'TodoBackend', {})

    new apiGateway.LambdaRestApi(this, 'Endpoint', {
      handler: todoBackent.handler
    });

    const websiteBucket = new s3.Bucket(this, "WebsiteBucket",{
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    })

    new s3Deployment.BucketDeployment(this, 'WebDeployment', {
      destinationBucket: websiteBucket,
      sources: [s3Deployment.Source.asset('./assets')]
    })

    new CfnOutput(this, 'WebsiteAddress', {
      value: websiteBucket.bucketWebsiteUrl
    })

    // new SPADeploy(this, "WebsiteDeploy").createSiteWithCloudfront({
    //   indexDoc: 'index.html',
    //   websiteFolder: './assets'
    // })
  }
}

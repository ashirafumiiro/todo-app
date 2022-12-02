import { Construct } from "constructs";
import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as lambda from 'aws-cdk-lib/aws-lambda'

export interface TodoBackendProps {

}

export class TodoBackend extends Construct {
    public readonly handler: lambda.Function;

    constructor(scope: Construct, id: string, props?: TodoBackendProps) {
        super(scope, id);
        
        const todosTable = new dynamodb.Table(this, "TodoDatabase", {
            partitionKey: {name: "id", type: dynamodb.AttributeType.STRING},
            removalPolicy: RemovalPolicy.DESTROY
        })

        this.handler = new lambda.Function(this, 'TodoHandler',{
            code: lambda.Code.fromAsset('lambda'),
            handler: "todoHandler.handler",
            runtime: lambda.Runtime.NODEJS_16_X,
            timeout: Duration.seconds(10),
            environment: {
                TABLE_NAME: todosTable.tableName
            }
        })

        todosTable.grantReadWriteData(this.handler)
    }
}
import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name="eu-west-2")

    table = dynamodb.Table('Meeting-Rooms')

    response = table.scan()
    data = response['Items']
    return {
        'statusCode': 200,
        'body': json.dumps(data),
        'headers': {
        "Access-Control-Allow-Origin" : "*"
        }
    }
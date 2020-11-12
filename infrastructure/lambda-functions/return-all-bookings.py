import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name="eu-west-2")

    table = dynamodb.Table('Room-Bookings')
    response = table.scan()
    data = response['Items']
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        data.extend(response['Items'])
    return {
        'statusCode': 200,
        'body': json.dumps(data),
        'headers': {
        "Access-Control-Allow-Origin" : "*"
        }
    }
import json
import boto3
from boto3.dynamodb.conditions import Key
dynamodb = boto3.resource('dynamodb', region_name='eu-west-2')

def lambda_handler(event, context):
	table = dynamodb.Table('Meeting-Rooms')
	response = table.update_item(
	    Key={
	        'roomName': event['queryStringParameters']['roomName']
	    },
	    UpdateExpression='set roomCapacity=:c, phone=:ph, projector=:p, tvScreen=:tv, wheelchairAccess=:w',
	    ExpressionAttributeValues={
	        ':c': event['queryStringParameters']['roomCapacity'],
	    	':ph': event['queryStringParameters']['phone'],
	    	':p': event['queryStringParameters']['projector'],
	    	':tv': event['queryStringParameters']['tvScreen'],
	    	':w': event['queryStringParameters']['wheelchairAccess'],
	    },
	    ReturnValues='UPDATED_NEW'
	)
	return {
		'statusCode': 200,
        'body': json.dumps(response),
        'message': "Room updated successfully"
	}


	
	


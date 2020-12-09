import json
import boto3
from boto3.dynamodb.conditions import Key
dynamodb = boto3.resource('dynamodb', region_name='eu-west-2')

def lambda_handler(event, context):
    room_name_exists = query_room(event)
    if room_name_exists:
        return {
            'statusCode': 400,
            'body': {'message': 'Sorry! A room with that name already exists.'}
        }
    else:
	    table = dynamodb.Table('Meeting-Rooms')
	    table.put_item(
	    	Item = {
	    		'roomName': event['queryStringParameters']['roomName'],
	    		'bookedStatus': event['queryStringParameters']['bookedStatus'],
	    		'phone': event['queryStringParameters']['phone'],
	    		'projector': event['queryStringParameters']['projector'],
	    		'roomCapacity': event['queryStringParameters']['roomCapacity'],
	    		'tvScreen': event['queryStringParameters']['tvScreen'],
	    		'wheelchairAccess': event['queryStringParameters']['wheelchairAccess']
	    	}
	    )
	    return {
	        'statusCode': 200,
	        'body': {'message': "Successfully added room"},
	    }
	
def query_room(event):
    table = dynamodb.Table('Meeting-Rooms')
    response = table.query(
        KeyConditionExpression=Key('roomName').eq(event['queryStringParameters']['roomName'])
    )
    return response['Items']
    

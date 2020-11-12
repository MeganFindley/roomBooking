import json
import boto3
from boto3.dynamodb.conditions import Key

def query_room(event):
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-2')
    table = dynamodb.Table('Meeting-Rooms')
    response = table.query(
        KeyConditionExpression=Key('roomName').eq(event['queryStringParameters']['roomName'])
    )
    return response['Items']
    

def lambda_handler(event, context):
	room = query_room(event)
	print(room[0]['capacity'])
	print(event['queryStringParameters']['capacity'])
	if not room:
		return {
			'body': json.dumps({'Message': "Sorry! The room you entered doesn't exist, check your spelling and try again."})
		}		
	if int(room[0]['capacity']) >= int(event['queryStringParameters']['capacity']):
		dynamodb = boto3.resource('dynamodb', region_name='eu-west-2')
		table = dynamodb.Table('Room-Bookings')
		table.put_item(
			Item = {
				'roomName': event['queryStringParameters']['roomName'],
				'capacity': event['queryStringParameters']['capacity'],
				'date': event['queryStringParameters']['date'],
				'time': event['queryStringParameters']['time'],
				'duration': event['queryStringParameters']['duration'],
				'meetingName': event['queryStringParameters']['meetingName'],
				'meetingHost': event['queryStringParameters']['meetingHost']
			}
		)
		return {
    	    'statusCode': 200,
    	    'body': json.dumps({'Message:': "Successfully added booking"}),
    	}
	else:
		message = 'Sorry! This room only has a capacity of ' + room[0]['capacity'] + '.'
		return {
			'body': json.dumps({'Message': message})
		}
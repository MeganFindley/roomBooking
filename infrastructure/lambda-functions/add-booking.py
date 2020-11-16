import json
import boto3
from boto3.dynamodb.conditions import Key
dynamodb = boto3.resource('dynamodb', region_name='eu-west-2')

def query_booking(event):
	table = dynamodb.Table('Room-Bookings')
	response = table.query(
		KeyConditionExpression=Key('roomName').eq(event['queryStringParameters']['roomName'])
	)
	bookings = response['Items']
	for booking in bookings:
		if booking['date'] == event['queryStringParameters']['date'] and booking['time'] == event['queryStringParameters']['time']:
			return True
		else:
			return False

def query_room(event):
    table = dynamodb.Table('Meeting-Rooms')
    response = table.query(
        KeyConditionExpression=Key('roomName').eq(event['queryStringParameters']['roomName'])
    )
    return response['Items']
    

def lambda_handler(event, context):
	room = query_room(event)
	print(query_booking(event))
	isBooking = query_booking(event)
	#print(room[0]['capacity'])
	#print(event['queryStringParameters']['capacity'])
	if isBooking:
		return {
			'body': json.dumps({'Message': "Sorry! This room already has a meeting booked at this time."})
		}
	if not room:
		return {
			'body': json.dumps({'Message': "Sorry! The room you entered doesn't exist, check your spelling and try again."})
		}		
	if int(room[0]['capacity']) >= int(event['queryStringParameters']['capacity']):
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
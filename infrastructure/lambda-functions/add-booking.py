import json
import boto3
from boto3.dynamodb.conditions import Key
import datetime
from datetime import datetime, timedelta, date
dynamodb = boto3.resource('dynamodb', region_name='eu-west-2')

def calculate_end_time(initialTime, mins):
	end_time = datetime(100, 1, 1, initialTime.hour, initialTime.minute, initialTime.second)
	end_time = end_time + timedelta(minutes=mins)
	return end_time.time()
	
def is_overlap(requested_end_time, booked_end_time, requested_start_time, booked_start_time):
	requested_end_time = datetime.combine(date.min, requested_end_time)
	booked_end_time = datetime.combine(date.min, booked_end_time)
	requested_start_time = datetime.combine(date.min, requested_start_time)
	booked_start_time = datetime.combine(date.min, booked_start_time)
	delta = min(booked_end_time, requested_end_time)-max(booked_start_time, requested_start_time)
	print(delta.total_seconds())
	if delta.total_seconds() < 0:
		return False
	else:
		return True

def query_booking(event):
	table = dynamodb.Table('Room-Bookings')
	response = table.query(
		KeyConditionExpression=Key('roomName').eq(event['queryStringParameters']['roomName'])
	)
	bookings = response['Items']
	requested_start_time = datetime.strptime(event['queryStringParameters']['time'], '%H:%M').time()
	requested_end_time = calculate_end_time(requested_start_time, int(event['queryStringParameters']['duration']))
	list1 = []
	for booking in bookings:
		booked_start_time = datetime.strptime(booking['time'], '%H:%M').time()
		booked_end_time = calculate_end_time(booked_start_time, int(booking['duration']))
		list1.append(is_overlap(requested_end_time, booked_end_time, requested_start_time, booked_start_time))
	print(list1)
	if list1.count(True) > 0:
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
	isBooking = query_booking(event)
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
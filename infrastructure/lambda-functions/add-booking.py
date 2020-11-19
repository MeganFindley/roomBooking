import json
import boto3
from boto3.dynamodb.conditions import Key
import datetime
from datetime import datetime, timedelta, date
dynamodb = boto3.resource('dynamodb', region_name='eu-west-2')

def lambda_handler(event, context):
	room_to_be_booked = query_room(event)
	room_capacity = int(room_to_be_booked[0]['capacity'])
	room_is_booked = query_booking(event)
	requested_booking_capacity = int(event['queryStringParameters']['capacity'])
	if room_is_booked:
		return {
			'body': json.dumps({'Message': "Sorry! This room already has a meeting booked at this time."})
		}
	if not room_to_be_booked:
		return {
			'body': json.dumps({'Message': "Sorry! The room you entered doesn't exist, check your spelling and try again."})
		}
	if room_capacity >= requested_booking_capacity:
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
	
def query_room(event):
    table = dynamodb.Table('Meeting-Rooms')
    response = table.query(
        KeyConditionExpression=Key('roomName').eq(event['queryStringParameters']['roomName'])
    )
    return response['Items']
    
def query_booking(event):
	table = dynamodb.Table('Room-Bookings')
	response = table.query(
		KeyConditionExpression=Key('roomName').eq(event['queryStringParameters']['roomName']) & Key('date').eq(event['queryStringParameters']['date'])
	)
	bookings = response['Items']
	print(bookings)
	if not bookings:
		return False
	else:
		return does_datetime_overlap(event, bookings)
	
def does_datetime_overlap(event, bookings):
	requested_duration = int(event['queryStringParameters']['duration'])
	requested_start_time = datetime.strptime(event['queryStringParameters']['time'], '%H:%M').time()
	requested_end_time = calculate_meeting_end_time(requested_start_time, requested_duration)
	list1 = []
	for booking in bookings:
		booked_start_time = datetime.strptime(booking['time'], '%H:%M').time()
		booked_end_time = calculate_meeting_end_time(booked_start_time, int(booking['duration']))
		list1.append(is_overlap(requested_end_time, booked_end_time, requested_start_time, booked_start_time))
	if list1.count(True) > 0:
		return True
	else:
		return False

def calculate_meeting_end_time(initialTime, duration):
	end_time = datetime(100, 1, 1, initialTime.hour, initialTime.minute, initialTime.second)
	end_time = end_time + timedelta(minutes=duration)
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
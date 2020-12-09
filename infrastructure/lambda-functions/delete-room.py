import json
import boto3
from boto3.dynamodb.conditions import Key
dynamodb = boto3.resource('dynamodb', region_name='eu-west-2')

def lambda_handler(event, context):
	table = dynamodb.Table('Meeting-Rooms')
	response = table.delete_item(
		Key={
		    'roomName': event['queryStringParameters']['roomName'],
		}
	)
	return {
	    'statusCode': 200,
	    'body': {'message': "Successfully deleted booking"},
	    'response': response,
	}


import boto3

# Example: send sample data to Kinesis
kinesis_client = boto3.client('kinesis', region_name='us-east-1')

data = {"user": "Mike", "action": "login"}
kinesis_client.put_record(
    StreamName='example-stream',
    Data=str(data),
    PartitionKey='partition-1'
)

print("Sample record sent to Kinesis.")

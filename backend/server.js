const express = require('express');
const cors = require('cors');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const app = express();
app.use(cors());
app.use(express.json());

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localstack_main:4566",
  credentials: { accessKeyId: "mock", secretAccessKey: "mock" }
});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "app_production_users";

app.post('/api/users', async (req, res) => {
  const { username, address } = req.body;
  try {
    await ddbDocClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: { username, address, created_at: new Date().toISOString() }
    }));
    res.status(201).json([{ username, address }]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/users', async (req, res) => {
  try {
    const data = await ddbDocClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    res.json(data.Items || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(8080, () => console.log('Serverless Backend live on port 8080'));

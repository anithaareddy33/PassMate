import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

const url = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

let db;

// Connect to MongoDB
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

try {
  await client.connect();
  db = client.db(dbName);
  console.log('✅ Connected to MongoDB');
} catch (err) {
  console.error('❌ MongoDB connection failed:', err);
  process.exit(1); // Exit if can't connect
}

// Routes
app.get('/', async (req, res) => {
  try {
    const collection = db.collection('passwords');
    const result = await collection.find({}).toArray();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/', async (req, res) => {
  try {
    const data = req.body;
    const collection = db.collection('passwords');
    const result = await collection.insertOne(data);
    res.send({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/', async (req, res) => {
  try {
    const data = req.body;
    const collection = db.collection('passwords');
    const result = await collection.deleteOne(data);
    res.send({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

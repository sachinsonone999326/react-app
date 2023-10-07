const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://0.0.0.0:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

const entitySchema = new mongoose.Schema({
  client_id: String,
  name: String,
  phone_number: String,
  comment: String,
  email: String,
});

const Entity = mongoose.model('Entity', entitySchema);

app.get('/api/entities', async (req, res) => {
    console.log("get")
  try {
    const entities = await Entity.find();
    res.json(entities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/entities', async (req, res) => {
    console.log("post")
  const newEntity = new Entity(req.body);
  try {
    await newEntity.save();
    console.log('New entity created:', newEntity);
    res.status(201).json(newEntity);
  } catch (err) {
    console.error('Error creating entity:', err);
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/entities/:client_id', async (req, res) => {
  const client_id = req.params.client_id;
  const updates = req.body;
  try {
    const updatedEntity = await Entity.findOneAndUpdate({ client_id }, updates, { new: true });
    if (updatedEntity) {
      console.log('Entity updated:', updatedEntity);
      res.json(updatedEntity);
    } else {
      res.status(404).json({ message: `Entity with client_id ${client_id} not found` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/entities/:client_id', async (req, res) => {
  const client_id = req.params.client_id;
  try {
    const deletedEntity = await Entity.findOneAndRemove({ client_id });
    if (deletedEntity) {
      console.log('Entity deleted:', deletedEntity);
      res.json(deletedEntity);
    } else {
      console.log(`Entity with client_id ${client_id} not found`);
      res.status(404).json({ message: `Entity with client_id ${client_id} not found` });
    }
  } catch (err) {
    console.error('Error deleting entity:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

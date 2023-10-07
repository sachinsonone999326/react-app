const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());












const entities = [
  { id: 1, client_id:'1001',name: 'Entity 1',phone_number:'7898572544', comment: 'This is entity 1',email:'priyanshu16kpl@gmail.com' },
  { id: 2, client_id:'1002',name: 'Entity 2',phone_number:'7898572544', comment: 'This is entity 2',email:'priyanshu16kpl@gmail.com' },
  { id: 3, client_id:'1003',name: 'Entity 3',phone_number:'7898572544', comment: 'This is entity 3',email:'priyanshu16kpl@gmail.com' },
];

app.get('/api/entities', (req, res) => {
  res.json(entities);
});

app.post('/api/entities', (req, res) => {
  const newEntity = req.body;
  entities.push(newEntity);
  console.log('New entity created:', newEntity);
  res.json(newEntity);
});

app.put('/api/entities/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  const entityIndex = entities.findIndex((entity) => entity.id === id);
  if (entityIndex !== -1) {
    entities[entityIndex] = { ...entities[entityIndex], ...updates };
    console.log('Entity updated:', entities[entityIndex]);
    res.json(entities[entityIndex]);
  } else {
    res.status(404).json({ message: `Entity with id ${id} not found` });
  }
});

app.delete('/api/entities/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const entityIndex = entities.findIndex((entity) => entity.id === id);
  if (entityIndex !== -1) {
    const deletedEntity = entities.splice(entityIndex, 1)[0];
    console.log('Entity deleted:', deletedEntity);
    res.json(deletedEntity);
  } else {
    res.status(404).json({ message: `Entity with id ${id} not found` });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
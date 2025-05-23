const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, '../data/interactions.json');

// Load interactions
app.get('/api/interactions', (req, res) => {
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read file' });
    res.json(JSON.parse(data || '{}'));
  });
});

// Save new interaction
app.post('/api/interactions', (req, res) => {
  const { elementId, type } = req.body;
  if (!elementId || !type) {
    return res.status(400).json({ error: 'Missing elementId or type' });
  }

  fs.readFile(dataFile, 'utf8', (err, data) => {
    let interactions = {};
    if (!err && data) interactions = JSON.parse(data);

    interactions[elementId] = interactions[elementId] || { clicks: 0, hovers: 0 };
    if (type === 'click') interactions[elementId].clicks++;
    if (type === 'hover') interactions[elementId].hovers++;

    fs.writeFile(dataFile, JSON.stringify(interactions, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Write failed' });
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Rotas para arquivos HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

app.get('/service-orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/service-orders.html'));
});

app.get('/inventory', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/inventory.html'));
});

app.get('/budget', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/budget.html'));
});

// API Endpoints
const dataPath = path.join(__dirname, 'data');

// Orders API
app.get('/api/orders', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(path.join(dataPath, 'orders.json')));
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(path.join(dataPath, 'orders.json')));
  orders.push(req.body);
  fs.writeFileSync(path.join(dataPath, 'orders.json'), JSON.stringify(orders, null, 2));
  res.json({ success: true });
});

// Inventory API
app.get('/api/inventory', (req, res) => {
  const inventory = JSON.parse(fs.readFileSync(path.join(dataPath, 'inventory.json')));
  res.json(inventory);
});

app.put('/api/inventory/:id', (req, res) => {
  const inventory = JSON.parse(fs.readFileSync(path.join(dataPath, 'inventory.json')));
  const index = inventory.findIndex(item => item.id === req.params.id);
  if (index !== -1) {
    inventory[index] = { ...inventory[index], ...req.body };
    fs.writeFileSync(path.join(dataPath, 'inventory.json'), JSON.stringify(inventory, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Budget API
app.get('/api/budget', (req, res) => {
  const budget = JSON.parse(fs.readFileSync(path.join(dataPath, 'budget.json')));
  res.json(budget);
});

app.post('/api/budget', (req, res) => {
  fs.writeFileSync(path.join(dataPath, 'budget.json'), JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
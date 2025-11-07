const path = require('path');
const fs = require('fs'); 
const express = require('express');
const OS = require('os');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors')
// const serverless = require('serverless-http') 

const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/'))); 
app.use(cors())

mongoose.connect(process.env.MONGO_URIMONGO_URI)
.then(() => {
    console.log("MongoDB Connection Successful");
})
.catch(err => {
    console.error("Database connection error!! " + err); 
});

const Schema = mongoose.Schema; 

const dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
const planetModel = mongoose.model('planets', dataSchema); 

app.post('/planet', async function (req, res) {
  try {
    const planetData = await planetModel.findOne({ id: req.body.id }).exec();

    if (!planetData) {
      return res.status(404).send("Ooops, We only have 9 planets and a sun. Select a number from 0 - 9");
    }

    res.send(planetData);
  } catch (err) {
    console.error("Error fetching planet:", err);
    res.status(500).send("Error in Planet Data");
  }
});

app.get('/planet/:name', async function (req, res, next) {
  try {
    const planet = await planetModel.findOne({ name: req.params.name });

    if (!planet) {
      return res.status(404).json({ message: 'Planet not found' });
    }

    res.status(200).json(planet);

  } catch (err) {
    console.error("Database Query Error:", err);
    next(err); 
  }
});


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});


app.get('/api-docs', function (req, res) {
    fs.readFile('oas.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Error reading file'); 
      } else {
        try {
            res.json(JSON.parse(data));
        } catch (e) {
            console.error('Error parsing oas.json:', e);
            res.status(500).send('Error parsing documentation file.');
        }
      }
    });
});
  

app.get('/os', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV
    });
})

app.get('/live', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "live"
    });
})

app.get('/ready', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    const isReady = mongoose.connection.readyState === 1; // 1 means 'connected'
    
    if (isReady) {
        res.send({
            "status": "ready"
        });
    } else {
        res.status(503).send({
            "status": "not ready",
            "reason": "Database disconnected"
        });
    }
})

module.exports = app;

app.listen(PORT, () => { 
    console.log(`Server successfully running on port - ${PORT}`); 
});
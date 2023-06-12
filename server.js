const express = require('express');
const cors = require('cors')
const path = require('path');
const PORT = 8080;
const app = express();
const { promisePool } = require('./dbConnection.js');
// parses JSON from incoming request
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["http:// localhost:3000"], 
  optionSuccessStatus:200
};

// Do not edit
const options = {
  lemon:  'yellow',
  lime: 'limegreen',
  tangerine: 'orange',
  grapefruit: 'lightcoral'
};

// #3 helper function 'getColor`
const getColor = (fruit) => {
  const color = options[fruit];
  return color; 
}

// #1 serve the colors.html page when /colors is visited
// DO NOT USE express.static
app.get('/colors', cors(corsOptions), (req, res) => {
  const ABSOLUTE_PATH = path.join(__dirname, './client/colors.html');
  res.sendFile(ABSOLUTE_PATH);
});

// #2 & #4 handle POST requests to /colors
app.post('/colors', cors(corsOptions), async (req, res) => {
  const { fruit } = req.body;
  const color = getColor(fruit);
  res.json(color);
});

// #6 serve styles.css - DO NOT use express.static()
app.get('/styles.css', cors(corsOptions), (req, res) => {
  const ABSOLUTE_PATH = path.join(__dirname, './client/styles.css');
  res.sendFile(ABSOLUTE_PATH)
});

// #5 Update functionality to database
app.put('/colors/:id/:fruit',cors(corsOptions), async (req, res) => {
  const { id, fruit } = req.params;
  const color = getColor(fruit);
  const [rows] = await promisePool.execute(`UPDATE cars SET color = ?' WHERE car_id = ?`, [color, id]);
  res.send(rows);
});

// #7 unknown routes - 404 handler
// research what route to serve this for
app.get('/*', cors(corsOptions), (req, res) => {
  res.send('404');
});

// Global error handling middleware
// You can leave this alone
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

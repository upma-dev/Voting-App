const express = require("express");
const app = express();
const db = require("./db");
require("dotenv").config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Import the router files
const User = require('./routes/user');
const candidate = require('./routes/candidate');

// Use the routes
app.use('/user', User);
app.use('/candidate', candidate);


app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
})
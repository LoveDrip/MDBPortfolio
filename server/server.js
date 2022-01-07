const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const config = require('./config/keys');
const api = require('./routes');

const app = express();

// set cors origin
app.use(
  cors({
    origin: '*',
  }),
);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//DB config
const mongoURI = config.mongoURI;

//Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello'));

app.use('/api', api);

const port = process.env.port || 4000;

app.listen(port, () => console.log(`Server running on port ${port}`));
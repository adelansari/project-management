const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const app = express();

// Enable CORS
app.use(cors())
// Use morgan to log requests
app.use(logger('dev'));
// Parse incoming request bodies as JSON
app.use(express.json());
// Parse incoming request bodies as URL-encoded data
app.use(express.urlencoded({ extended: false }));
// Parse cookies in the request headers
app.use(cookieParser());
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Mount the API routes at /api/v1
app.use('/api/v1', require('./src/v1/routes'));

module.exports = app;
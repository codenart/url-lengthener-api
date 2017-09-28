/* global __dirname */

'use strict';

const express = require('express');
const app = express();

/**
 * Static files
 */
app.use( express.static('client') );

/**
 * API router
 */
app.all('/api\*', require(__dirname + '/api/router'));

/**
 * Start app
 */
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port', port);
});

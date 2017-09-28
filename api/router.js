/* global __dirname */

'use strict';

const RequestURLException = require(__dirname + '/RequestURLException');

const express = require('express');
const router = express.Router();

/**
 * URL Lengthener
 */
router.get('/api/url\*', require(__dirname + '/url/app'));

/**
 * Invalid URL
 * @param request
 * @param response
 */
router.get('*', (request, response) => {
   const format = '/api/type|object/action[?param1=value1][&param2=value2][&param3...';
   const samples = [
                      '/api/timestamp/parse?unixtime=1506520175',
                      '/api/ip/track'
                   ];
   const exception = new RequestURLException(format, samples);
   response.json(exception);
});

/**
 * Export router
 */
module.exports = router;

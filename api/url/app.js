/* global __dirname */

'use strict';

const RequestURLException = require(__dirname + '/../RequestURLException');
const APIException = require(__dirname + '/../APIException');
const Lengthener = require(__dirname + '/lengthener');
const Checker = require('type-check');

const express = require('express');
const app = express();

/**
 * Lengthen URL
 * @param request
 * @param response
 */
app.get('/api/url/lengthen', (request, response) => {
   const originalURL = request.query.origin;
   Lengthener.lengthen(originalURL, (error, result) => {
      if(error) {
         console.error(error);
         response.json(new APIException());
      }
      else
         response.json(result);
   });
});

/**
 * Redirect to original URL
 * @param request
 * @param response
 */
app.get('/api/url/:id', (request, response) => {
   const id = Number.parseInt( request.params.id );
   Lengthener.recallURLById(id, (error, URL) => {
      if(error) {
         console.error(error);
         response.json(new APIException());
      }
      else {
         if(URL === null)
            response.json({ message: 'The URL id does not exist.' });
         else
            response.redirect( URL['origin'] );
      }
   });
});

/**
 * Invalid URL
 * @param request
 * @param response
 */
app.get('*', (request, response) => {
   const format = '/api/url/id|lengthen?origin=url';
   const samples = ['/api/url/lengthen?origin=https://codenart.github.io/'];
   const exception = new RequestURLException(format, samples);
   response.json(exception);
});

/**
 * Export app
 */
module.exports = app;

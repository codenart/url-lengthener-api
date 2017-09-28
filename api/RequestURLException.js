'use strict';

const Checker = require('type-check');

module.exports = class RequestURLException {
   /**
    * @param format  : String
    * @param samples : [String]
    */
   constructor(format, samples) {
      if(! Checker.typeCheck('String', format))
         throw new TypeError('"format" argument is not a string.');
      else if(! Checker.typeCheck('[String]', samples))
         throw new TypeError('"samples" argument is not an array of strings');
      else {
         this['message'] = 'Invalid request URL';
         this['format'] = format;
         this['samples'] = samples;
      }
   }
};

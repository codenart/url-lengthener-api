'use strict';

const Checker = require('type-check');

module.exports = class CustomURL {
   /**
    * @param record : { id, url }
    */
   constructor(record) {
      if(! Checker.typeCheck('{ id: Number, url: String }', record))
         throw new TypeError('"record" parameter is not a valid record.');
      else {
         this['origin']     = record['url'];
         this['lengthened'] = 'https://codenart.glitch.me/api/url/' + record['id'];
      }
   }
};

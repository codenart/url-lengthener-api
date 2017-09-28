'use strict';

const Checker = require('type-check');

module.exports = class APIException {
   constructor() {
      this['message'] = 'This is not a bug. It\'s an extra feature.'
                      + 'Please remind me to file this feature at https://github.com/codenart/.';
   }
};

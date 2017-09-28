/* global __dirname */

'use strict';

const CustomURL = require(__dirname + '/CustomURL');
const Checker = require('type-check');
const FileSystem = require('fs');

class URLLengthener {
   constructor() {
      this.database = {
                         path: __dirname + '/database.json',
                         fileName: 'database.json'
                      };
      this.checkIfDatabaseExist((error, databaseExist) => {
         if(error)
            throw error;
         else {
            if(databaseExist)
               console.log('Database is ready.');
            else
               this.initialDatabase();
         }
      });
   }
   
   /**
    * @param callback (result) : Function
    * @returns result : Boolean
    */
   checkIfDatabaseExist(callback) {
      FileSystem.readdir(__dirname, (error, files) => {
         if(error)
            callback(error);
         else {
            const database = files.filter(file => file === this.database.fileName)[0];
            if(database)
               callback(null, true);
            else
               callback(null, false);
         }
      });
   }
   
   /**
    * Create database (overwrite if existed)
    */
   initialDatabase() {
      const data = [];
      const newRecord = {
                           id : 9999,
                           url: 'https://codenart.github.io/'
                        };
      data.push(newRecord);
      FileSystem.writeFile(this.database.path, JSON.stringify(data), (error) => {
         if(error)
            throw error;
         else
            console.log('Database is ready.');
      });
   }
   
   /**
    * @param id : Number
    * @param callback (error, URL) : Function
    * @return URL : CustomURL
    */
   recallURLById(id, callback) {
      if(! Checker.typeCheck('Number', id))
         throw new TypeError();
      else {
         FileSystem.readFile(this.database.path, (error, data) => {
            if(error)
               callback(error);
            else {
               const allRecords = JSON.parse(data);
               const matchedRecord = allRecords.filter(record => record.id === id)[0];
               if(matchedRecord) {
                  const URL = new CustomURL(matchedRecord);
                  callback(null, URL);
               }
               else
                  callback(null, null);
            } 
         });
      }
   }
   
   /**
    * 
    * @param originalURL : String
    * @param callback (error, result) : Function
    * @returns result : CustomURL || an exception Object
    */
   lengthen(originalURL, callback) {
      if(! Checker.typeCheck('String', originalURL))
         throw new TypeError('"originalURL" argument is not a string.');
      else {
         const URLPattern = /(^(http|https):\/\/)([a-z0-9]+.*\.)([a-z]+.*)$/;
         if( URLPattern.test(originalURL) ) {
            this.recallURLByOrigin(originalURL, (error, URL) => {
               if(error)
                  callback(error);
               else {
                  if(URL === null)
                     this.rememberNewURL(originalURL, (error, URL) => {
                        if(error)
                           callback(error);
                        else
                           callback(null, URL);
                     });
                  else
                     callback(null, URL);
               }
            });
         }
         else {
            callback(null, { message: 'Invalid original URL.'
                                             + 'Please check protocol and use real domain.' });
         }
      }
   }
   
   /**
    * @param originalURL : String
    * @param callback (error, URL) : Function
    * @returns URL : CustomURL
    */
   recallURLByOrigin(originalURL, callback) {
      if(! Checker.typeCheck('String', originalURL))
         throw new TypeError('"originalURL" argument is not a string.');
      else {
         FileSystem.readFile(this.database.path, (error, data) => {
            if(error)
               callback(error);
            else {
               const allRecords = JSON.parse(data);
               const matchedRecord = allRecords.filter(record => record.url === originalURL)[0];
               if(matchedRecord) {
                  const URL = new CustomURL(matchedRecord);
                  callback(null, URL);
               }
               else
                  callback(null, null);
            }
         });
      }
   }
   
   /**
    * @param originalURL : String
    * @param callback (error, URL) : Function
    * @returns URL : CustomURL
    */
   rememberNewURL(originalURL, callback) {
      if(! Checker.typeCheck('String', originalURL))
         throw new TypeError('"originalURL" argument is not a string.');
      else {
         this.resetDataBaseIfReachedLimit();
         this.generateNewId((error, id) => {
            if(error)
               callback(error);
            else {
               const newRecord = {
                                    id : id,
                                    url: originalURL
                                 };
               FileSystem.readFile(this.database.path, (error, data) => {
                  if(error)
                     callback(error);
                  else {
                     const allRecords = JSON.parse(data);
                     allRecords.push(newRecord);
                     const newData = JSON.stringify(allRecords);
                     FileSystem.writeFile(this.database.path, newData, (error) => {
                        if(error)
                           callback(error);
                        else {
                           const URL = new CustomURL(newRecord);
                           callback(null, URL);
                        }
                     });
                  }
               });
            }
         });
      }
   }
   
   /**
    * @param callback (error, id)
    * @returns id : Number
    */
   generateNewId(callback) {
      FileSystem.readFile(this.database.path, (error, data) => {
         if(error)
            callback(error);
         else {
            const allIds = JSON.parse(data).map(record => record.id);
            
            var newId = null;
            var newIdIsValid = false;
            do {
               newId = Math.random().toFixed(4) * 10000;
               newId = Math.floor(newId);
               newIdIsValid = (newId > 1000) && (allIds.indexOf(newId) === -1);
            }
            while(! newIdIsValid);
            
            callback(null, newId);
         }
      });
   }
   
   /**
    * Only keep 900 records
    */
   resetDataBaseIfReachedLimit() {
      FileSystem.readFile(this.database.path, (error, data) => {
         const allRecords = JSON.parse(data);
         if(allRecords.length > 900)
            this.initialDatabase();
      });
   }
}

module.exports = new URLLengthener();

/*
 * grunt-electron-builder
 * https://github.com/Art2B/grunt-electron-builder
 *
 * Copyright (c) 2015 Arthur Battut
 * Licensed under the MIT license.
 */

'use strict';

var asar = require('asar');
var fs = require('fs-extra')
var request = require('request');
var Promise = require('promise');
var Download = require('download');

module.exports = function(grunt) {
  grunt.registerMultiTask('electron_builder', 'Grunt plugin to build your electron app', function() {
    var options = this.options();
    options.dest = this.options().dest || './build';
    var done = this.async();
    
    // Remove old build folder to prevent conflicts and bugs
    fs.removeSync('./build');

    new Promise(function(fulfill, reject){
      console.log('Compress application');
      asar.createPackage(options.src, './.tmp/app.asar', function() {
        console.log('Compression done');
        fulfill();
      });
    }).then(function(){
      return new Promise(function(fulfill, reject){
        getLastRelease(function(release){
          fulfill(release);
        });
      });
    }).then(function(release){
      return new Promise(function(fulfill, reject){
        // download prebuilt binaries
        downloadReleases(['linux-x64'], release, options.dest,function(){
          fulfill();
        });
      });
    }).then(function(){
      // Move app.asar file in prebuilt binaries for each platforms
      return new Promise(function(fulfill, reject){
        copyAppFile('linux-x64', options.dest,function(){
          fulfill();
        });
      });
    }).then(function(){
      // Clean temp folder
      fs.removeSync('./tmp/app.asar');
      done();
    });
    // rename electron executable to app name
  });


  function getLastRelease(callback){
    request({
      url: 'https://api.github.com/repos/atom/electron/releases/latest',
      headers: {
        'User-Agent': 'request'
      }
    }, function (error, response, body) {
      if(error){
        return console.log('Error:', error);
      }
      if(response.statusCode !== 200){
        return console.log('Invalid Status Code Returned:', response.statusCode);
      }
      callback(JSON.parse(body).tag_name);
    });
  };
  function downloadReleases(releasesArray, version, destFolder, callback){
    releasesArray.forEach(function(element, index){
      var url = 'https://github.com/atom/electron/releases/download/'+version+'/electron-'+version+'-'+element+'.zip';
      console.log(url);
      new Download({mode: '755', extract: true})
          .get(url)
          .dest(destFolder+'/'+element)
          .run(callback);
    });
  };
  function copyAppFile(release, destFolder, callback){
    fs.copy('./.tmp/app.asar', destFolder+'/'+release+'/resources/app.asar', function(err){
      if(err){
        console.error(err);
      }
      callback();
    })
  }

};

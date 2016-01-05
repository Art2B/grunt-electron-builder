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
var winresourcer = require('winresourcer');

var supportedPlatforms = ['linux-x64', 'win32-x64'];

module.exports = function(grunt) {
  grunt.registerMultiTask('electron_builder', 'Grunt plugin to build your electron app', function() {
    var options = this.options() || {};
    options.appName = this.options().appName || 'electron';
    options.dest = this.options().dest || './build';
    options.platforms = checkPlatforms(this.options().platforms) || ['linux-x64'];


    var done = this.async();

    // Remove old build folder to prevent conflicts and bugs
    fs.removeSync(options.dest);

    new Promise(function(fulfill, reject){
      console.log('Build application');
      asar.createPackage(options.src, './.tmp/app.asar', function() {
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
        downloadReleases(options.platforms, release, options.dest,function(){
          fulfill();
        });
      });
    }).then(function(){
      return new Promise(function(fulfill, reject){
        copyAppFile(options.platforms, options.dest, options.appName, function(){
          fulfill();
        });
      });
    }).then(function(){
      // Clean temp folder
      fs.removeSync('./.tmp/app.asar');
      done();
    });
    // rename electron executable to app name
  });

  function checkPlatforms(platformArray){
    var checkedArray = [];

    platformArray.forEach(function(element){
      if(supportedPlatforms.indexOf(element) >= 0){
        checkedArray.push(element);
      }
    });

    return checkedArray;
  }
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
    var releasesDownloaded = 0;
    console.log('Download prebuilt binaries');
    releasesArray.forEach(function(element){
      var url = 'https://github.com/atom/electron/releases/download/'+version+'/electron-'+version+'-'+element+'.zip';
      console.log(url);
      new Download({mode: '755', extract: true})
          .get(url)
          .dest(destFolder+'/'+element)
          .run(function(){
            releasesDownloaded++;
            if(releasesDownloaded === releasesArray.length){
              callback();
            }
          });
    });
  };
  function copyAppFile(platforms, destFolder, appName, callback){
    var appFilesCopied = 0;
    platforms.forEach(function(element){
      fs.copy('./.tmp/app.asar', destFolder+'/'+element+'/resources/app.asar', function(err){
        if(err){
          console.error(err);
        }
        appFilesCopied++;
        switch(element){
          case 'linux-x64':
            fs.renameSync(destFolder+'/'+element+'/electron', destFolder+'/'+element+'/'+appName.toLowerCase().replace(' ', '-'));
            break;
          case 'win32-x64':
            fs.renameSync(destFolder+'/'+element+'/electron.exe', destFolder+'/'+element+'/'+appName.toLowerCase().replace(' ', '-')+'.exe');
            break;
          default:
            console.log('platform not supported');
            break;
        }
        if(appFilesCopied == platforms.length){
          callback();
        }
      });
    });


  };
};

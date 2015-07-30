/*
 * grunt-electron-builder
 * https://github.com/Art2B/grunt-electron-builder
 *
 * Copyright (c) 2015 Arthur Battut
 * Licensed under the MIT license.
 */

'use strict';

var asar = require('asar');

module.exports = function(grunt) {

  grunt.registerMultiTask('electron_builder', 'Grunt plugin to build your electron app', function() {
    var options = this.options();
    options.dest = this.options().dest || 'app.asar';
    var done = this.async();
     
    asar.createPackage(options.src, options.dest, function() {
      console.log('Asar file done.');
      done();
    });
  });

};
  
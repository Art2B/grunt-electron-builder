# grunt-electron-builder

> Grunt plugin to build your electron app

## Getting Started
This plugin requires Grunt `~0.4.5`

```shell
npm install grunt-electron-builder --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-electron-builder');
```

## Important note:

The plugin actually only build for Linux electron app. Windows and Mac support should come soon.

## The "electron_builder" task

### Overview
In your project's Gruntfile, add a section named `electron_builder` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  electron_builder: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

```js
src: // Here should be the relative path to your electron app folder
dest: './build' // Here should be the build folder you want to use. ./build by default
```


### Usage Examples
```js
electron_builder: {
  dist: {
    options: {
      src: __dirname+'/app/',
      dest: './build'
    }
  },
},
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
09/31/15: 0.1.0: Firs release
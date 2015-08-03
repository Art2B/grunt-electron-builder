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

The plugin actually only build for Linux and Windows electron app. Mac support should come soon.

## The "electron_builder" task

### Overview
In your project's Gruntfile, add a section named `electron_builder` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  electron_builder: {
    options: {
      // Task-specific options go here.
      appName: 'My appName',
      dest: './build', // Build folder you want to use. './build' by default
      src: __dirname+'/app', // Relative path to your electron app folder
      platforms: ['linux-x64'] // Array of platforms on which you want your app to run. Actually only support 'linux-64' and 'win32-x64'
    },
    your_target: {
      // Target-specific file lists and/or options go here.
      // Same as options
    },
  },
});
```
### Usage Examples
```js
electron_builder: {
  options: {
    appName: 'My awesome Electron app'
  },
  dist: {
    options: {
      src: __dirname+'/app/',
      dest: './build',
      platforms: ['win32-x64']
    }
  },
},
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
09/31/15: 0.1.0: First release
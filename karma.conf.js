'use strict';

/* global process */

// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox', 'IE', 'PhantomJS' ]
var browsers =
  (process.env.TEST_BROWSERS || 'PhantomJS')
    .replace(/^\s+|\s+$/, '')
    .split(/\s*,\s*/g)
    .map(function(browser) {
      if (browser === 'ChromeHeadless') {
        process.env.CHROME_BIN = require('puppeteer').executablePath();

        // workaround https://github.com/GoogleChrome/puppeteer/issues/290
        if (process.platform === 'linux') {
          return 'ChromeHeadless_Linux';
        }
      } else {
        return browser;
      }
    });


module.exports = function(karma) {
  karma.set({

    frameworks: [
      'browserify',
      'mocha',
      'sinon-chai'
    ],

    files: [
      'test/**/*.spec.js'
    ],

    preprocessors: {
      'test/**/*.spec.js': [ 'browserify' ]
    },

    reporters: [ 'spec' ],

    browsers: browsers,

    customLaunchers: {
      ChromeHeadless_Linux: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ],
        debug: true
      }
    },

    autoWatch: false,
    singleRun: true,

    // browserify configuration
    browserify: {
      debug: true
    }
  });
};

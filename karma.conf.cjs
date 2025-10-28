/** eslint-env node */

// configures browsers to run test against
// any of [ 'ChromeHeadless', 'ChromeHeadlessDev', 'Chrome', 'ChromeDev', 'Firefox' ]
const browsers = (process.env.TEST_BROWSERS || 'ChromeHeadlessDev').split(',');

// use puppeteer provided Chrome for testing
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(karma) {
  karma.set({

    frameworks: [
      'mocha',
      'webpack'
    ],

    files: [
      'test/**/*.spec.js'
    ],

    preprocessors: {
      'test/intersect.spec.js': [ 'webpack' ]
    },

    browsers: browsers,

    autoWatch: false,
    singleRun: true,

    webpack: {
      mode: 'development',
      devtool: 'eval-source-map'
    },

    customLaunchers: {
      ChromeDev: {
        base: 'Chrome',
        displayName: 'ChromeDev',
        flags: [
          // disable chromium safe storage access request security prompt on macOS
          '--use-mock-keychain',
        ]
      },
      ChromeHeadlessDev: {
        base: 'ChromeHeadless',
        displayName: 'ChromeHeadlessDev',
        flags: [
          // disable chromium safe storage access request security prompt on macOS
          '--use-mock-keychain',
        ]
      }
    }

  });
};

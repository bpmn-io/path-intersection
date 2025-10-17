/** eslint-env node */

// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox' ]
const browsers = (process.env.TEST_BROWSERS || 'ChromeHeadless').split(',');

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
    }
  });
};

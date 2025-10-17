import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  source: [
    '*.js',
    '*.mjs'
  ],
  test: [
    'test/**/*.js'
  ]
};

export default [

  // source
  ...bpmnIoPlugin.configs.recommended.map(config => {
    return {
      ...config,
      files: files.source
    };
  }),

  // test
  ...bpmnIoPlugin.configs.mocha.map(config => {
    return {
      ...config,
      files: files.test
    };
  })
];
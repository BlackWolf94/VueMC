module.exports = {
  roots: ['./test'],
  testRegex: '.*(spec|test)\\.ts$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './html-report',
        filename: 'report.html',
        expand: true,
      },
    ],
  ],
};

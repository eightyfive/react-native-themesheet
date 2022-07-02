// https://kulshekhar.github.io/ts-jest/docs/guides/react-native/

module.exports = {
  preset: 'react-native',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
      babelConfig: true,
    },
  },
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [],
};

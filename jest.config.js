// https://kulshekhar.github.io/ts-jest/docs/guides/react-native/

module.exports = {
  preset: '@react-native/jest-preset',
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        babelConfig: true,
      },
    ],
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

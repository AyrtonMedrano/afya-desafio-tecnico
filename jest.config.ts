import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          esModuleInterop: true,
          verbatimModuleSyntax: false,
          jsx: 'react-jsx',
          target: 'ES2022',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        },
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/test/__mocks__/fileMock.js',
  },
}

export default config
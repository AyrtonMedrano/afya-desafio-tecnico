import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          isolatedModules: true,
          esModuleInterop: true,
          verbatimModuleSyntax: false,
          jsx: 'react-jsx',
          target: 'ES2022',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          types: ['jest', 'node', '@testing-library/jest-dom'],
        },
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
  moduleNameMapper: {
    'styled-components': '<rootDir>/test/__mocks__/styled-components.js',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/test/__mocks__/fileMock.js',
  },
}

export default config
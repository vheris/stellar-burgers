const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    ...tsJestTransformCfg,
  },
  
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/tests/" 
  ],

  moduleNameMapper: {
    "^@api$": "<rootDir>/src/utils/burger-api",
    "^@utils-types$": "<rootDir>/src/utils/types",
    "^@pages$": "<rootDir>/src/pages",
    "^@components$": "<rootDir>/src/components",
    "^@ui$": "<rootDir>/src/components/ui",
    "^@slices/(.*)$": "<rootDir>/src/services/slices/$1",
    "^src/(.*)$": "<rootDir>/src/$1"
  }
};
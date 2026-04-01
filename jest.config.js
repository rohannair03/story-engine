// ── Add to package.json scripts ────────────────────────────────────────────
// "test:coverage": "jest --coverage",
//
// ── Add to jest.config.js (or package.json "jest" key) ─────────────────────

/** @type {import('jest').Config} */
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx"],
  setupFilesAfterEnv: ["./tests/setup.js"],
  collectCoverageFrom: [
  "src/**/*.{js,jsx}",
  "!src/main.jsx",
  "!src/utils/api.js",
  "!src/utils/imageGenerator.js",
  "!src/**/*.test.{js,jsx}",
  ],
  coverageReporters: ["text", "lcov", "json-summary"],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 65,
      functions: 70,
      lines: 70,
    },
  },
};

// ── package.json scripts section (merge with existing) ─────────────────────
// {
//   "scripts": {
//     "dev":            "vite",
//     "build":          "vite build",
//     "test":           "jest",
//     "test:coverage":  "jest --coverage",
//     "test:e2e":       "cypress open",
//     "test:e2e:run":   "cypress run"
//   }
// }

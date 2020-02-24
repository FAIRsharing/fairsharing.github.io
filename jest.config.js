module.exports = {
    preset: "@vue/cli-plugin-unit-jest",
    collectCoverage: true,
    coverageReporters: [
        "lcov"
    ],
    collectCoverageFrom: [
        "src/**/*.{js,vue}",
        "!src/main.js",
        "!src/documentation/process_doc.js",
        "!src/components/Records/FiltersLabelMapping.js",
        "!src/store/index.js",
        "!src/plugins/**"
    ],
    testMatch: [
        "**/**.spec.js", "**/**/**.spec.js"
    ],
    setupFiles: [
      "./jest-setup.js"
    ],
    transform: { '^.*\\.js$': 'babel-jest' },
    transformIgnorePatterns: ['node_modules/(?!vue-router|@babel|vuetify)']
};

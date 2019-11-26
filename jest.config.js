module.exports = {
    preset: '@vue/cli-plugin-unit-jest',
    collectCoverage: true,
    coverageReporters: ["lcov"],
    collectCoverageFrom: [
        'src/**/*.{js,vue}',
        '!src/main.js',
    ],
    testMatch: ["**/**.spec.js", "**/**/**.spec.js"]
};

module.exports = {
    preset: '@vue/cli-plugin-unit-jest',
    collectCoverage: true,
    coverageReporters: ["lcov"],
    collectCoverageFrom: [
        'src/**/*.{js,vue}',
        '!src/main.js', // No need to cover bootstrap file
    ]
};

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
        "!src/components/Records/FiltersLabelMapping.js"
    ],
    testMatch: [
        "**/**.spec.js", "**/**/**.spec.js"
    ]
};

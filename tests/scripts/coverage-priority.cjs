const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const coverageFile = path.join(root, "coverage/coverage-final.json");

if (!fs.existsSync(coverageFile)) {
  console.error("Coverage JSON not found. Run Vitest with coverage first.");
  process.exit(1);
}

const coverage = JSON.parse(fs.readFileSync(coverageFile, "utf8"));

function percentage(covered, total) {
  return total ? ((covered / total) * 100).toFixed(2) : "100.00";
}

function getMetrics(values) {
  const total = values.length;
  const covered = values.filter((value) => value > 0).length;

  return {
    total,
    covered,
    uncovered: total - covered,
    percentage: percentage(covered, total),
  };
}

const results = Object.entries(coverage)
  .filter(([file]) => file.endsWith(".vue"))
  .map(([file, data]) => {
    const statements = getMetrics(Object.values(data.s || {}));
    const functions = getMetrics(Object.values(data.f || {}));
    const branches = getMetrics(Object.values(data.b || {}).flat());

    const relativeFile = path.relative(root, file);

    const priority =
      statements.uncovered + functions.uncovered * 2 + branches.uncovered * 2;

    return {
      file: relativeFile,
      statements,
      functions,
      branches,
      priority,
    };
  })
  .sort((a, b) => b.priority - a.priority);

console.table(
  results.slice(0, 20).map((item) => ({
    file: item.file,
    statements: `${item.statements.percentage}%`,
    branches: `${item.branches.percentage}%`,
    functions: `${item.functions.percentage}%`,
    priority: item.priority,
  })),
);

const markdown = [
  "# Vitest Coverage Improvement Priorities",
  "",
  "Target: 90% statements, branches, functions and lines.",
  "",
];

for (const [index, item] of results.slice(0, 10).entries()) {
  const componentName = path.basename(item.file, ".vue");

  const specFiles = [];

  function findSpecs(directory) {
    if (!fs.existsSync(directory)) return;

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        findSpecs(fullPath);
      } else if (
        entry.name === `${componentName}.spec.js` ||
        entry.name === `${componentName}.test.js`
      ) {
        specFiles.push(path.relative(root, fullPath));
      }
    }
  }

  findSpecs(path.join(root, "tests/unit"));

  markdown.push(
    `## ${index + 1}. ${item.file}`,
    "",
    `Priority score: ${item.priority}`,
    "",
    `- Statements: ${item.statements.percentage}%`,
    `- Branches: ${item.branches.percentage}%`,
    `- Functions: ${item.functions.percentage}%`,
    `- Existing tests: ${specFiles.join(", ") || "Not found"}`,
    "",
    "### AI Test Generation Prompt",
    "",
    "```text",
    `Increase meaningful Vitest coverage for ${item.file}.`,
    `Existing test files: ${specFiles.join(", ") || "Create an appropriate spec file"}.`,
    "",
    "Analyze uncovered functions, branches and template handlers.",
    "Reuse existing mocks, fixtures and Vuetify stubs.",
    "Add tests for API success/error paths, watchers, computed properties,",
    "conditional rendering, v-model bindings and user interactions.",
    "",
    "Run the affected tests and fix failures.",
    "Do not modify production Vue files or coverage configuration.",
    "Do not add coverage-ignore comments or meaningless assertions.",
    "Report coverage improvements after completing the tests.",
    "```",
    "",
  );
}

const output = path.join(root, "coverage/test-priorities.md");

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, markdown.join("\n"));

console.log(`\nCoverage priorities saved to: ${output}`);

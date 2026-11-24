const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = process.cwd();
const coverageFile = path.join(root, "coverage/coverage-summary.json");
const threshold = 90;
const metricNames = ["statements", "branches", "functions", "lines"];

const reportOnly = process.argv.includes("--report-only");
const unknownArguments = process.argv.slice(2).filter((arg) => arg !== "--report-only");
if (unknownArguments.length) {
  console.error("Usage: node tests/scripts/coverage-priority.cjs [--report-only]");
  process.exit(1);
}

if (!reportOnly) {
  console.log("Running the complete Vitest suite to generate current project coverage...");
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "coverage-priority-"));
  const testReport = path.join(temporaryDirectory, "tests.json");
  const previousReport = fs.existsSync(coverageFile)
    ? fs.statSync(coverageFile).mtimeMs
    : null;
  try {
    const run = spawnSync("npx", [
      "vitest", "run", "--coverage",
      "--reporter=default", "--reporter=json",
      `--outputFile.json=${testReport}`,
    ], { cwd: root, stdio: "inherit" });
    if (run.error || run.signal || !fs.existsSync(testReport)) {
      throw new Error("Vitest did not complete. No coverage priorities were generated.");
    }
    const tests = JSON.parse(fs.readFileSync(testReport, "utf8"));
    if (tests.numFailedTests || tests.numFailedTestSuites || !tests.numTotalTests) {
      throw new Error("Fix the failing tests before generating project coverage priorities.");
    }
    if (!fs.existsSync(coverageFile) || fs.statSync(coverageFile).mtimeMs === previousReport) {
      throw new Error("Vitest did not generate a fresh coverage summary.");
    }
    if (run.status !== 0) {
      const summary = JSON.parse(fs.readFileSync(coverageFile, "utf8"));
      const belowThreshold = metricNames.some((metric) => summary.total[metric].pct < threshold);
      if (run.status !== 1 || !belowThreshold) {
        throw new Error(`Vitest exited with status ${run.status}. Check its output before using coverage.`);
      }
      console.log("Tests passed; coverage is below the configured threshold. Listing files to improve.");
    }
  }
  catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
  finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
  if (process.exitCode) process.exit(process.exitCode);
}
else {
  console.warn("Reading existing coverage only. A filtered test run may have overwritten project coverage.");
}

if (!fs.existsSync(coverageFile)) {
  console.error("Coverage summary not found. Run npx vitest run --coverage first.");
  process.exit(1);
}

const coverage = JSON.parse(fs.readFileSync(coverageFile, "utf8"));
const generatedAt = fs.statSync(coverageFile).mtime.toISOString();
console.log(`Coverage source: ${coverageFile} (updated ${generatedAt})`);

function getMetrics({ total, covered, pct }) {
  return {
    total,
    covered,
    uncovered: total - covered,
    percentage: total ? Number(pct).toFixed(2) : "100.00",
  };
}

function findSpecs(directory, specFiles = []) {
  if (!fs.existsSync(directory)) return specFiles;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      findSpecs(fullPath, specFiles);
    }
    else if (
      /\.(spec|test)\.[cm]?[jt]sx?$/.test(entry.name)
    ) {
      specFiles.push(path.relative(root, fullPath));
    }
  }
  return specFiles;
}

const specFiles = findSpecs(path.join(root, "tests/unit"));
const specContents = new Map(specFiles.map((spec) => [
  spec, fs.readFileSync(path.join(root, spec), "utf8"),
]));

function matchingSpecs(file) {
  const sourcePath = path.resolve(root, file);
  const sourceStem = sourcePath.slice(0, -path.extname(sourcePath).length);
  const mirroredStem = path.join("tests/unit", path.relative("src", file))
    .replace(/\.[^.]+$/, "");
  const mirrored = specFiles.filter((spec) =>
    spec.replace(/\.(spec|test)\.[cm]?[jt]sx?$/, "").toLowerCase() === mirroredStem.toLowerCase(),
  );
  if (mirrored.length) return mirrored;

  // Non-mirrored specs may have the same name as unrelated components.
  // Match their imports to the source path rather than guessing by basename.
  return specFiles.filter((spec) => {
    const contents = specContents.get(spec);
    const imports = contents.matchAll(/(?:from\s*|import\s*\(?\s*|require\s*\(\s*)["']([^"']+)["']/g);
    return [...imports].some(([, imported]) => {
      const target = imported.startsWith("@/")
        ? path.resolve(root, "src", imported.slice(2))
        : imported.startsWith(".")
          ? path.resolve(root, path.dirname(spec), imported)
          : null;
      return target === sourcePath || target === sourceStem;
    });
  });
}

const results = Object.entries(coverage)
  .filter(([file]) => file !== "total")
  .map(([file, data]) => {
    const statements = getMetrics(data.statements);
    const functions = getMetrics(data.functions);
    const branches = getMetrics(data.branches);
    const lines = getMetrics(data.lines);

    const relativeFile = path.relative(root, file);

    const priority =
      statements.uncovered + functions.uncovered * 2 + branches.uncovered * 2;

    return {
      file: relativeFile,
      specFiles: matchingSpecs(relativeFile),
      statements,
      functions,
      branches,
      lines,
      priority,
    };
  })
  .filter((item) => metricNames.some((metric) => Number(item[metric].percentage) < threshold))
  .sort((a, b) => b.priority - a.priority);

console.log(`Files below ${threshold}% in at least one metric: ${results.length}`);
console.table(
  results.flatMap((item) => (item.specFiles.length ? item.specFiles : ["No matching spec found"]).map((spec) => ({
    spec,
    statements: `${item.statements.percentage}%`,
    branches: `${item.branches.percentage}%`,
    functions: `${item.functions.percentage}%`,
    lines: `${item.lines.percentage}%`,
    priority: item.priority,
  }))),
);

const markdown = [
  "# Vitest Coverage Improvement Priorities",
  "",
  "Target: 90% statements, branches, functions and lines.",
  `Coverage source: ${path.relative(root, coverageFile)} (updated ${generatedAt}).`,
  `Report scope: ${reportOnly ? "existing report; may contain only a filtered test run" : "complete Vitest suite"}.`,
  `Files below target in at least one metric: ${results.length}.`,
  "",
];

if (!results.length) {
  markdown.push("All reported files meet the coverage target.", "");
}

for (const [index, item] of results.entries()) {
  const specFiles = item.specFiles;

  markdown.push(
    `## ${index + 1}. ${item.file}`,
    "",
    `Priority score: ${item.priority}`,
    "",
    `- Statements: ${item.statements.percentage}%`,
    `- Branches: ${item.branches.percentage}%`,
    `- Functions: ${item.functions.percentage}%`,
    `- Lines: ${item.lines.percentage}%`,
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

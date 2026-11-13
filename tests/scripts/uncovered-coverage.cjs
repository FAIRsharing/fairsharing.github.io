const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { spawnSync } = require("node:child_process");

const root = process.cwd();

const coverageDir = path.join(root, "coverage-json");

const coveragePath = path.join(coverageDir, "coverage-final.json");

const target = process.argv[2];
const suppliedSpec = process.argv[3];

// ============================================================
// 1. Validate arguments
// ============================================================

if (!target) {
  console.error(
    "Usage: node tests/scripts/uncovered-coverage.cjs " +
      "<Component.vue> [path/to/Component.spec.js]",
  );

  process.exit(1);
}

// ============================================================
// 2. Find matching spec file
// ============================================================

const walk = (directory) => {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return walk(fullPath);
    }

    return entry.isFile() ? [fullPath] : [];
  });
};

const specName = `${path.parse(target).name}.spec.js`;

const matches = suppliedSpec
  ? [path.resolve(root, suppliedSpec)]
  : walk(path.join(root, "tests")).filter(
    (file) => path.basename(file) === specName,
  );

let specFile = null;

if (matches.length === 1 && fs.existsSync(matches[0])) {
  specFile = matches[0];
}
else if (matches.length > 1) {
  console.warn(
    "Multiple spec files match. Pass the desired spec path explicitly:",
  );

  matches.forEach((file) => {
    console.warn(`  ${path.relative(root, file)}`);
  });
}
else {
  console.warn(`No spec file found for ${target}; skipping test execution.`);
}

// ============================================================
// 3. Initialize report
// ============================================================

const report = {
  component: target,

  specFile: specFile ? path.relative(root, specFile) : null,

  coverageSource: fs.existsSync(coveragePath)
    ? path.relative(root, coveragePath)
    : null,

  coverageNote:
    "Coverage comes from the most recent coverage-final.json. " +
    "Running the spec below does not regenerate coverage.",

  uncoveredStatements: [],
  uncoveredFunctions: [],
  uncoveredBranches: [],

  testRun: null,
};

// ============================================================
// 4. Read existing coverage data
// ============================================================

if (fs.existsSync(coveragePath)) {
  const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf8"));

  const normalizedTarget = target.replace(/\\/g, "/");

  const entries = Object.entries(coverage).filter(([file]) =>
    file.replace(/\\/g, "/").endsWith(normalizedTarget),
  );

  if (entries.length === 1) {
    const [file, data] = entries[0];

    report.component = path.relative(root, file);

    const source = fs.readFileSync(file, "utf8").split(/\r?\n/);

    // --------------------------------------------------------
    // Uncovered statements
    // --------------------------------------------------------

    report.uncoveredStatements = Object.entries(data.s)
      .filter(([, count]) => count === 0)
      .map(([id]) => ({
        line: data.statementMap[id].start.line,

        code: source[data.statementMap[id].start.line - 1]?.trim() ?? "",
      }));

    // --------------------------------------------------------
    // Uncovered functions
    // --------------------------------------------------------

    report.uncoveredFunctions = Object.entries(data.f)
      .filter(([, count]) => count === 0)
      .map(([id]) => ({
        name: data.fnMap[id].name,

        line: data.fnMap[id].loc.start.line,

        code: source[data.fnMap[id].loc.start.line - 1]?.trim() ?? "",
      }));

    // --------------------------------------------------------
    // Uncovered branches
    // --------------------------------------------------------

    report.uncoveredBranches = Object.entries(data.b).flatMap(([id, counts]) =>
      counts.flatMap((count, index) => {
        if (count > 0) {
          return [];
        }

        const branch = data.branchMap[id];

        return [
          {
            type: branch.type,

            line: branch.line,

            location: branch.locations[index] ?? null,

            code: source[branch.line - 1]?.trim() ?? "",
          },
        ];
      }),
    );
  }
  else {
    report.coverageNote =
      entries.length === 0
        ? `No coverage entry found for ${target}. ` +
          "Generate a fresh JSON coverage report."
        : `Multiple coverage entries match ${target}. ` +
          "Supply a longer relative component path.";
  }
}
else {
  report.coverageNote =
    "coverage-json/coverage-final.json not found. " +
    "Generate it separately using Vitest with JSON coverage.";
}

// ============================================================
// 5. Execute the matching Vitest spec
// ============================================================

if (specFile) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "vitest-failures-"));

  const resultsPath = path.join(tempDir, "results.json");

  const specArg = path.relative(root, specFile);

  const command = process.platform === "win32" ? "npx.cmd" : "npx";

  try {
    const result = spawnSync(
      command,
      [
        "vitest",
        "run",
        specArg,
        "--reporter=json",
        `--outputFile=${resultsPath}`,
      ],
      {
        cwd: root,
        encoding: "utf8",
        maxBuffer: 20 * 1024 * 1024,
      },
    );

    report.testRun = {
      exitCode: result.status,
      total: 0,
      passed: 0,
      failed: 0,
      failures: [],
    };

    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));

      report.testRun.total = results.numTotalTests ?? 0;

      report.testRun.passed = results.numPassedTests ?? 0;

      report.testRun.failed = results.numFailedTests ?? 0;

      // ------------------------------------------------------
      // Collect failed test cases
      // ------------------------------------------------------

      report.testRun.failures = (results.testResults ?? []).flatMap((suite) =>
        (suite.assertionResults ?? [])
          .filter((test) => test.status === "failed")
          .map((test) => ({
            suite: suite.name,

            test:
              test.fullName ||
              [...(test.ancestorTitles || []), test.title].join(" > "),

            errors: test.failureMessages ?? [],
          })),
      );

      // ------------------------------------------------------
      // Collect suite-level errors
      // ------------------------------------------------------

      report.testRun.suiteErrors = (results.testResults ?? []).flatMap(
        (suite) =>
          suite.message && !(suite.assertionResults ?? []).length
            ? [
              {
                suite: suite.name,
                error: suite.message,
              },
            ]
            : [],
      );
    }
    else {
      report.testRun.runnerError =
        result.error?.message ||
        result.stderr ||
        result.stdout ||
        "Vitest produced no JSON result.";
    }
  }
  finally {
    // Remove temporary files only.
    // Existing coverage folders are untouched.
    fs.rmSync(tempDir, {
      recursive: true,
      force: true,
    });
  }
}

// ============================================================
// 6. Save combined JSON report
// ============================================================

fs.mkdirSync(coverageDir, {
  recursive: true,
});

const output = path.join(
  coverageDir,
  `${path.parse(target).name}-uncovered.json`,
);

fs.writeFileSync(output, JSON.stringify(report, null, 2));

console.log(`Report generated: ${path.relative(root, output)}`);

// ============================================================
// 7. Print summary in terminal
// ============================================================

console.log("\n========== COVERAGE SUMMARY ==========");

console.log(`Uncovered statements: ${report.uncoveredStatements.length}`);

console.log(`Uncovered functions: ${report.uncoveredFunctions.length}`);

console.log(`Uncovered branches: ${report.uncoveredBranches.length}`);

if (report.testRun) {
  console.log("\n========== TEST SUMMARY ==========");

  console.log(`Total tests: ${report.testRun.total}`);

  console.log(`Passed: ${report.testRun.passed}`);

  console.log(`Failed: ${report.testRun.failed}`);

  console.log(`Exit code: ${report.testRun.exitCode}`);

  if (report.testRun.failures.length > 0) {
    console.log("\n========== FAILED TESTS ==========");

    report.testRun.failures.forEach((failure) => {
      console.log(`\nFAIL: ${failure.test}`);

      failure.errors.forEach((error) => {
        console.log(error);
      });
    });
  }

  if (report.testRun.suiteErrors?.length > 0) {
    console.log("\n========== SUITE ERRORS ==========");

    report.testRun.suiteErrors.forEach((failure) => {
      console.log(`\nSUITE: ${failure.suite}`);
      console.log(failure.error);
    });
  }

  if (report.testRun.runnerError) {
    console.log("\n========== RUNNER ERROR ==========");
    console.log(report.testRun.runnerError);
  }
}

console.log("\n======================================");

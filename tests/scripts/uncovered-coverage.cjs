const fs = require("node:fs");
const path = require("node:path");

const coveragePath = path.resolve(
  process.cwd(),
  "coverage-json",
  "coverage-final.json",
);

if (!fs.existsSync(coveragePath)) {
  console.error(
    "ERROR: coverage-final.json not found.\n" +
      "Generate it using:\n" +
      "npx vitest run --coverage --coverage.reporter=json",
  );

  process.exit(1);
}

const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf8"));

const target = process.argv[2];

if (!target) {
  console.error(
    "Usage: node scripts/uncovered-coverage.cjs <ComponentName.vue>",
  );
  process.exit(1);
}

const entry = Object.entries(coverage).find(([file]) => file.endsWith(target));

if (!entry) {
  console.error(`No coverage found for ${target}`);
  process.exit(1);
}

const [file, data] = entry;

const source = fs.readFileSync(file, "utf8").split(/\r?\n/);

const uncoveredStatements = Object.entries(data.s)
  .filter(([, count]) => count === 0)
  .map(([id]) => ({
    line: data.statementMap[id].start.line,
    code: source[data.statementMap[id].start.line - 1]?.trim(),
  }));

const uncoveredFunctions = Object.entries(data.f)
  .filter(([, count]) => count === 0)
  .map(([id]) => ({
    name: data.fnMap[id].name,
    line: data.fnMap[id].loc.start.line,
    code: source[data.fnMap[id].loc.start.line - 1]?.trim(),
  }));

const uncoveredBranches = Object.entries(data.b).flatMap(([id, counts]) =>
  counts.flatMap((count, index) => {
    if (count > 0) return [];

    const branch = data.branchMap[id];

    return [
      {
        type: branch.type,
        line: branch.line,
        location: branch.locations[index],
        code: source[branch.line - 1]?.trim(),
      },
    ];
  }),
);

const report = {
  component: path.relative(process.cwd(), file),
  uncoveredStatements,
  uncoveredFunctions,
  uncoveredBranches,
};

const output = `coverage-json/${path.basename(target, ".vue")}-uncovered.json`;

fs.writeFileSync(output, JSON.stringify(report, null, 2));

console.log(`Report generated: ${output}`);

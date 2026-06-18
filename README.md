![Project Status](https://img.shields.io/badge/Status-production-warning)
[![Actions Status](https://github.com/FAIRsharing/fairsharing.github.io/workflows/CI/badge.svg)](https://github.com/FAIRsharing/fairsharing.github.io/actions)
[![Coverage Status](https://coveralls.io/repos/github/FAIRsharing/fairsharing.github.io/badge.svg?branch=master)](https://coveralls.io/github/FAIRsharing/fairsharing.github.io?branch=master)
[![Actions Status](https://github.com/FAIRsharing/fairsharing.github.io/workflows/Doc/badge.svg)](https://fairsharing.github.io/documentation/html/)
[![Actions Status](https://github.com/FAIRsharing/fairsharing.github.io/workflows/njsscan/badge.svg)](https://github.com/FAIRsharing/fairsharing.github.io/actions)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e5d5a125a61b4b7a91a13cf85015ff89)](https://www.codacy.com/gh/FAIRsharing/fairsharing.github.io?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=FAIRsharing/fairsharing.github.io&amp;utm_campaign=Badge_Grade)
[![Netlify Status](https://api.netlify.com/api/v1/badges/22cbc339-165f-4d87-ba40-4d28bcb14af6/deploy-status)](https://app.netlify.com/sites/fairsharing/deploys)

[![FAIRsharing.org](https://api.fairsharing.org/FAIRsharing-sdp.svg)](https://fairsharing.org/)

# FAIRsharing.org

Welcome to the new FAIRsharing.org website.

## Compiles and hot-reloads for development

```bash
npm run dev
```

## Test with vitest & generate coverage

```bash
npm run test:ui
```

## Generate the documentation locally

```bash
npm run doc:full
```

## Build and prerender

```bash
npm run build
```

The site uses Vike prerendering with a batched build process so large route sets can be generated safely.

### Build modes

`VITE_FULL_PRERENDER` controls the build behavior.

#### Full build

Fetches API data, generates the prerender JSON files, and runs the full batched prerender:

```bash
FULL_PRERENDER=true npm run build
```

#### Run the light build path:

```VITE_FULL_PRERENDER=false npm run build```

The light build path skips the long prerender loop and is useful for limited build environments such as Netlify.

How the build works

The build script:

1. Fetches record data and organisation data from the API,
2. Writes generated JSON files into src/lib/Prerender/,
3. Writes the current batch context into src/lib/Prerender/build-context.json,
4. Prerenders routes in batches,
5. Copies the final prerender output into dist/client.

#### Environment variables

* FULL_PRERENDER controls whether the full batch prerender runs.
* BATCH_SIZE controls how many record pages are processed per batch.
* BUILD_CONTEXT is written during the build so Vike can read the current batch information.

#### Generated files

These files are created during build and should not be committed:

* src/lib/Prerender/fairsharingRecords.generated.json
* src/lib/Prerender/organisations.generated.json
* src/lib/Prerender/build-context.json
* .prerender-output/
* dist/





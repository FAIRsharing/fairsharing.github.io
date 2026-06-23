# Project Architecture: SEO Optimization via Vike Implementation

This document provides a comprehensive technical overview of the architectural changes introduced to the *
*FAIRsharing.org** repository following the integration of **Vike**. These modifications successfully transitioned the
platform from a client-side rendered model to an SEO-optimized, route-aware, pre-rendered system.

---

## 1. Overview & Strategic Objectives

The primary goal of this architectural shift was to replace the legacy client-side Single-Page Application (SPA)
behavior with a robust **Static Site Generation (SSG)** and pre-rendered framework.

### Core Benefits Realized:

* **Instantaneous Indexing:** Search engine crawlers receive fully structured, meaningful HTML layouts directly on the
  initial HTTP request.
* **Dynamic Metadata Generation:** Page-specific titles, descriptions, and OpenGraph/Twitter card tags are populated at
  build time based on real registry data.
* **Optimized Core Web Vitals:** Drastically reduced Time to First Byte (TTFB) and First Contentful Paint (FCP) for
  direct deep-link hits.

---

## 2. Before vs. After: The Architectural Shift

The transition from a pure client-side model to Static Site Generation (SSG) fundamentally changes how data and HTML
interact:

| Feature                   | Before Vike (SPA)                               | After Vike (SSG / Pre-rendered)                          |
|:--------------------------|:------------------------------------------------|:---------------------------------------------------------|
| **Initial HTML Delivery** | Blank canvas (`<div id="app"></div>`)           | Fully populated HTML content with metadata               |
| **SEO Indexability**      | Low/Delayed (Reliant on crawler JS execution)   | **Excellent** (Instantaneous indexing of text and links) |
| **Data Fetching**         | Occurs in the user's browser on every page load | Cached locally and compiled into HTML at build time      |
| **Server/API Load**       | High volume of concurrent runtime API hits      | Zero runtime API dependency                              |

---

## 3. Core Technical Upgrades

To handle thousands of database records without crashing the build server or overloading external APIs, three core
engineering patterns were introduced:

### 3.1. Dynamic Route Discovery

Vike utilizes a specialized hook called `onBeforePrerenderStart`. This hook programmatically intercepts the build
process, looks at the dataset, and dynamically registers thousands of URL paths (e.g., `/1`, `/2`, `/3`) so Vite knows
exactly which pages require independent HTML files.

### 3.2. Memory Management via Sharded Batching

Prerendering over 8,000 dense data pages in a single execution thread causes Node.js to encounter `Out of Memory (OOM)`
errors. To bypass this limit, an orchestrating Bash script splits the build into micro-batches:

* The system calculates the highest available record ID dynamically.
* The build is segmented into chunks of **750 pages** at a time.
* Vite compiles a chunk, exports the built assets to an isolated folder, wipes the memory clean, and moves to the next
  batch.
* Once all chunks are safely built, they are merged back into a unified `dist/client` directory.

### 3.3. Performance Optimization: File-Based API Caching

The application maximizes build speed and efficiency by reducing network dependencies to **exactly one API call**.
Before
the sharded build loop even begins, the orchestrating Bash script executes an isolated query using the project's
existing getAllFairsharingRecords.json and getAllOrganisationsSEO.json layouts. The entire data payload is written
directly into a temporary, generated Prerender folder. Every subsequent Vike batch then reads these local files from
disk in under a millisecond, ensuring blistering fast compilation times.

> **The Problem This Solves:**
> Because the build engine runs over 30 separate iterations, making a fresh network request to pull thousands of dense
> records on every single loop would drastically stall the pipeline. This proactive caching strategy safely immunizes the
> build process against API rate limits, server firewalls, and network latency spikes..

---

## 4. Summary of File Modifications

### 📁 `scripts/build-prerender.sh` *(New Automation Engine)*

* **Purpose:** The central coordinator of the build pipeline.
* **Key Logic:** Loads local `.env` variables cleanly, reads the shared GraphQL query file, executes the single API
  fetch, writes the local JSON cache, computes the maximum ID, runs the isolated chunk loop, and compiles the final
  directory.

### 📁 `+onBeforePrerenderStart.js` *(Modified Vike Hook)*

* **Purpose:** Feeds Vike the precise list of paths to generate.
* **Key Logic:** Houses the list of global static routes (e.g., `/advancedsearch`, `/summary-statistics`). Instead of
  making independent network calls, it reads from the local `.prerender-records-cache.json` file created by the Bash
  script, filters out records belonging to the active `VITE_BUILD_BATCH` boundary, and feeds them directly to Vike's
  renderer.

### 📁 `lib/GraphClient/queries/getAllFairsharingRecords.json` *(Reused Project Query)*

* **Purpose:** The single source of truth for the GraphQL schema layout.
* **Key Logic:** Shared cleanly between runtime configurations and the pre-build Bash script, guaranteeing zero code
  duplication for the API request payload.

---

## 5. Detailed Vike Project Directory Structure

The core routing control panel lives entirely inside the `src/pages/` directory. Vike relies on a specific file-naming
convention where directory structures define application routing paths.

| Control File Name                | Functional Scope & Architectural Responsibility                                                                             |
|:---------------------------------|:----------------------------------------------------------------------------------------------------------------------------|
| **`+Page.vue`**                  | The foundational single-file Vue UI component. Dictates what the end user sees.                                             |
| **`+data.js`**                   | Orchestrates build-time or navigation-time data fetching for the corresponding page tree.                                   |
| **`+title.js`**                  | Evaluates route arguments to return precise HTML `<title>` strings for browser frames and indexing bots.                    |
| **`+description.js`**            | Outputs structural meta descriptions mapped directly to individual pages.                                                   |
| **`+onBeforePrerenderStart.js`** | Programmatically calculates and registers the full array of URLs that Vike must compile into hard HTML files at build time. |
| **`+onCreateApp.js`**            | Initializes the browser application environment (e.g., loading pinia stores, global mixins, or UI plugins).                 |
| **`+layout.vue`**                | Provides unified visual wrappers (e.g., standard site headers, system menus, and footer blocks).                            |
| **`+config.js`**                 | Sets page-level Vike configurations, including custom prerendering behaviors.                                               |

---

## 6. Current Layout Mapping & Routing Areas

### 📁 `src/pages/all/*`

Manages general application routing, static pages, and the main registry records.

* **Core Tasks:** Record-level SEO title/description mapping, high-volume route pre-calculation, DOI resolution, and
  core platform views (such as advanced search filters, metadata summaries, and structural policy guidelines).

### 📁 `src/pages/organisations/*`

Manages institutional indexes and profiles.

* **Core Tasks:** Pre-compiling lists of registered institutions, resolving independent profile data, configuring meta
  headers for organizations, and defining organization-specific build routes.

---

## 7. Verifying SEO Compatibility Locally

Because Vike shifts page generation to build time, you can completely audit your SEO status right on your machine before
pushing code to production.

1. Run the optimized build pipeline locally:
   ```bash
   npm run build
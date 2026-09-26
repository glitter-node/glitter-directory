# Glitter Directory Agent Guide

## Project Identity

- Product: Glitter Directory
- Template ID: `glitter-directory`
- Namespace: `GlitterDirectory`
- Vendor/Author: Glitter.kr
- License: MIT
- Type: GnuBoard7 User Template
- Version: `0.10.0` (from `template.json`)

The repository-level G7Official `AGENTS.md` has precedence over this guide.

## Architecture

Glitter Directory is not a separate Directory CMS. It provides presentation, information architecture, and a content adapter over existing G7 data.

```text
Board       → Directory
Category    → Category
Post        → Listing
Post Detail → Listing Detail
```

G7 Core and `sirsoft-board` own the source data and backend capabilities.

## UX Model

The primary flow is:

```text
Discover → Browse → Search → Listing Detail
```

Do not turn this template into a Knowledge or documentation reader. Do not add document TOC, reading progress, current-section tracking, or documentation-oriented reader navigation as default Directory behavior.

## Backend Boundary

Do not create a Directory DB, Listing DB, Category DB, authentication or permission backend, search engine, review/rating, reservation, commerce/payment, location/geocoding, recommendation, workflow, or AI/RAG backend in this template. Reuse existing G7 capabilities or propose a separate Module when backend capability is required.

## Data Contract

Check the actual G7/sirsoft-board contract before changing the adapter. Do not invent structured listing fields such as address, price, rating, phone, opening hours, distance, or arbitrary tags when the contract does not provide them.

## Layout/i18n

Follow the parent G7Official i18n Layout Rule:

- Layouts use translation keys, not visible hardcoded sentences.
- Language files contain visible sentences.
- Dynamic values use translation parameters.
- KO/EN key parity must be maintained.

## Search Contract

The search form relies on the G7 Form binding contract:

```text
Form:          dataKey="directorySearch"
Input:         name="q"
Query hydrate: query.q
Submit:        $event.target.q.value
```

Do not remove the Form `dataKey` while keeping the controlled Input value binding. Preserve category, search, pagination, and Listing Detail context, and do not emit empty query/category parameters.

## Theme and Responsive Behavior

Use the shared `g7_color_scheme` preference and its `auto`, `light`, and `dark` modes. Use semantic color tokens. Review Desktop, 767px, and 390px layouts and avoid horizontal overflow.

## Source Rules

The source of truth is:

```text
templates/_bundled/glitter-directory/
```

Never edit installed or active copies directly. Never edit generated `dist` files directly. Frontend changes must be produced through the static build.

## Environment and Editing

- Synology NAS; Docker is not used.
- PHP: `/usr/local/bin/php83`
- Composer: `/usr/local/bin/php83 /usr/local/bin/composer`
- Do not use bare `php` or `composer`.
- Do not use `npm run dev`, Vite dev server, or HMR.
- Source edits use Codex `tools.apply_patch`.
- Do not use shell redirection, `sed -i`, `perl -pi`, Python file writers, `git apply`, or nested Codex writers.

## Production Safety

Check `APP_ENV` and database/cache/filesystem isolation before stateful tests. If production isolation cannot be structurally proven, do not run database, PHPUnit, Vitest, E2E, or fixture tests. Report:

```text
SKIPPED: production isolation could not be proven
```

An explicitly requested official template deployment lifecycle is distinct from test isolation. It may be used for deployment, but must not create or modify production content.

## Lifecycle and Build

The normal flow is:

```text
Bundled source → official install/update → activate when explicitly required → layout/cache refresh → runtime verification
```

For frontend source changes, verify the package scripts, type-check, static build, build freshness, and native binary execution. Docs, language, and JSON-only changes that do not affect the bundle do not require an unnecessary frontend build; record that reason.

## Git Safety and Release Hygiene

Agents must not run `git add`, `git commit`, `git push`, create tags or releases, merge, rebase, or force-push. Only status and diff inspection are allowed.

Review behavior changes against the `0.1.0` manifest, README, CHANGELOG, license, package metadata, and source version. Do not add debug, test, playground, fixture endpoints, or hardcoded production content/domain data.

CHANGELOG version headings do not include release dates. Use `## [x.y.z]`, not `## [x.y.z] - YYYY-MM-DD`.

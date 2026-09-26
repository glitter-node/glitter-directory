# Changelog

## [0.10.0]

### Added

- Organized search, category, sorting, view, and reset controls into a clearer Explorer area.
- Added active exploration context and a filtered empty-state reset path while preserving existing query semantics.

## [0.9.0]

### Added

- Added semantic sorting for Board default, newest, oldest, and most viewed listings.
- Preserved sort context across search, category, Grid/List, pagination, and detail return links.
- Hid Previous/Next listing navigation for custom sorting because the current navigation API uses Board ordering.

## [0.8.0]

### Added

- Added bounded numeric pagination that distinguishes exact totals from inexact lower bounds.
- Preserved category, search, view, and per-page context across page links.
- Added accessible responsive pagination navigation without inventing an inexact last page.

## [0.7.0]

### Added

- Added URL-backed Grid/List view switching with preserved directory navigation context.
- Added responsive list presentation while retaining the shared ListingCard metadata contract.

## [0.6.0]

### Added

- Added contract-backed ListingCard metadata for author, formatted creation time, conditional view count, and new-item status.
- Preserved optional thumbnail rendering and omitted unavailable metadata without empty UI fragments.

## [0.5.1]

### Fixed

- Preserved category, search, and page context across listing navigation.
- Reset pagination when changing category filters.
- Avoided optional Glitter Translate requests unless the plugin is active.
- Removed a duplicate mobile menu media rule and synchronized template metadata.

## [0.5.0]

### Added

- Added optional Glitter Translate batch title resolution for listing cards.
- Kept original sirsoft-board titles when the plugin, resolver, or current translation is unavailable.

### Boundary

- Listing integration uses one batch request per loaded page and requests title translations only.
- Translated search, category translation, and listing content translation remain unsupported.

## [0.4.0]

### Added

- Added optional Glitter Translate integration for Listing Detail title and content.
- Kept original sirsoft-board Post values as the fallback when the plugin or current translation is unavailable.

### Boundary

- Glitter Translate is optional; sirsoft-board remains the required Post dependency.
- Listing cards keep the original Post title/content preview to avoid per-card resolver requests.
- Translated search, category translation, and automatic translation remain unsupported.

## [0.3.0]

### Added

- Directory header authentication navigation for guest and authenticated users.
- Login and registration presentation backed by G7 Core auth APIs, including the existing two-factor login challenge.
- Account presentation backed by G7 Core `/api/me` and `/api/me/password` APIs.
- Authenticated account menu with conditional admin, locale, account, and logout actions.
- Responsive header refinement with keyboard-safe theme and account menus.

### Fixed

- Joined the official G7 theme contract by synchronizing `G7Core.state.theme` with the shared `g7_color_scheme` preference and document theme.
- Removed the Directory-only theme event protocol while preserving System-mode media preference updates.
- Fixed Dark semantic tokens being overridden by a later duplicate Light `:root` declaration.
- Ensured the compact mobile Header replaces desktop controls at narrow responsive widths.
- Kept Board, Listing, and account values outside Template translation while localizing Directory-owned labels and category text.

## [0.2.0]

### Improved

- Clarified active category and search context during listing discovery.
- Added filtered listing result range summaries using the existing board pagination contract.
- Added an accessible all-listings reset link to category navigation.

## [0.1.0]

First Seed User Template release of Glitter Directory.

### Added

- Directory discovery based on public G7 boards.
- Board → Directory, Category → Category, and Post → Listing mapping.
- Category browsing with current-category navigation.
- Board-scoped listing search.
- Search query hydration and category/query context preservation.
- Listing cards using available post metadata.
- Listing detail with sanitized text and HTML rendering capability.
- Previous/Next listing navigation using `sirsoft-board`.
- System, Light, and Dark theme support using the G7 color-scheme preference.
- Korean and English translations.
- Responsive Desktop, tablet, and mobile layout behavior.
- Semantic navigation and focus-oriented accessibility features.
- 403, 404, and 500 error layouts.

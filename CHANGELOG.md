# Changelog

All notable changes to this project will be documented in this file.

## [22.4.3] - 2026-08-17

### Fixed

- **The package shipped without its licence notice.** `package.json` declared MIT, but no `LICENSE` file travelled in the tarball — and MIT itself requires the copyright notice to be included in distributions. The notice ships now.

## [22.4.2] - 2026-08-08

### Fixed

- Documentation links now point at the canonical localized URLs. The README linked to `https://hubui.dev/<path>` with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.

## [22.4.1] - 2026-07-28

### Fixed

- The active (last) crumb now declares `aria-current="page"`, so assistive technology announces which entry represents the current page. The `<nav aria-label="breadcrumb">` landmark was already in place.

## [22.4.0] - 2026-07-07

### Changed

- **BREAKING (packaging) — SCSS ships at `ng-hub-ui-breadcrumbs/styles`.** The theme mixin now builds to `dist/breadcrumbs/styles/...` (was `dist/breadcrumbs/src/lib/styles/...`), so `@use 'ng-hub-ui-breadcrumbs/styles'` resolves. Update any `@use` that reached into `src/lib/styles`.

## [22.3.1] - 2026-07-06

### Fixed

- Docs: `docs/css-variables-reference.md` default values resynchronized with the actual code declarations (`--hub-breadcrumb-item-padding-x`, `--hub-breadcrumb-accent`, `--hub-breadcrumb-link-hover-color`), now guarded by the repo-level `tokens-parity` check F.

## [22.3.0] - 2026-06-29

### Added

- **Opt-in per-item truncation** via the new `truncateItems` input on `hub-breadcrumb`. When enabled, each label is clipped to the new `--hub-breadcrumb-max-item-width` CSS variable (default `12rem`) with an ellipsis. Off by default, so the standard layout and wrapping are unchanged.
- **`HubBreadcrumbLabelDirective`** (`[hubBreadcrumbLabel]`) — surfaces a truncated label's full text as a tooltip only when it actually overflows.
- **Optional hub-ui tooltip integration** — `HUB_BREADCRUMB_TOOLTIP_ADAPTER` token, `provideHubBreadcrumbTooltip()` provider and the `HubBreadcrumbTooltipAdapter` / `HubBreadcrumbTooltipHandle` contract. By default truncated labels use the native `title` attribute (zero dependencies); provide an adapter (e.g. `hubTooltipAdapter` from `ng-hub-ui-utils`) to upgrade them to the richer, themeable hub-ui tooltip — `provideHubBreadcrumbTooltip(hubTooltipAdapter)`. The native `title` is suppressed when the adapter is active to avoid double tooltips.

## [22.2.0] - 2026-06-26

### Changed

- **Accent system migrated to the open-set "local accent slot" pattern.** `<hub-breadcrumb variant="…">` now re-bases a single `--hub-breadcrumb-accent` slot (defaulting to `--hub-sys-color-primary`), and the link hover (`--hub-breadcrumb-link-hover-color`) is derived **locally** as `--hub-breadcrumb-accent-emphasis` with `color-mix(in oklch, …)`, mirroring the `ng-hub-ui-ds` engine — instead of reading the per-variant `--hub-sys-color-<variant>-emphasis` token directly. The built-in variant list grew from 5 to the **nine canonical accents** (`primary · secondary · success · danger · warning · info · neutral · light · dark`), and a bare `[data-variant]` block re-derives the family from the slot so **any custom accent** the host app adds to the ds `$hub-accents` map (e.g. `brand`) recolours the links at runtime with one CSS rule — no library recompilation.

### Added

- New tokens `--hub-breadcrumb-accent-emphasis` (link hover), `--hub-breadcrumb-accent-subtle` and `--hub-breadcrumb-accent-on` (contrast colour), all derived locally from the accent slot.

## [22.1.2] - 2026-06-26

### Fixed

- Corrected the Angular peer dependency range to `>=18.0.0`. The library uses APIs introduced in Angular 17 (signal `input()`/`output()`, the `@if` control flow and/or signal queries), whose real minimum is Angular 17.3, so the previous `>=17.0.0` range was too low and let it install on incompatible versions.

## [22.1.1] - 2026-06-25

### Fixed

- Design-token consistency pass: aligned inline fallback defaults with the canonical `ng-hub-ui-ds` values and routed hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) through their `--hub-sys-*` / `--hub-ref-*` tokens, so they follow the active theme. No visual change when the ds tokens are loaded.

## [22.1.0] - 2026-06-24

### Added

- New **`variant` input** on `<hub-breadcrumb>` selecting a **semantic accent** for the links: `<hub-breadcrumb variant="success">` recolours the links (and their hover) to the matching design-system family while the current item stays muted. The built-in values (`primary` / `success` / `danger` / `warning` / `info`) use the exact tints via a CSS `@each` loop; **any other string is also accepted** — the link colour reads `--hub-sys-color-<variant>`. Defaults to the standard link colour (no visual change). New token `--hub-breadcrumb-accent` (the link colour now follows it).
- New **`hub-breadcrumb-theme()` Sass mixin** (`styles/mixins/breadcrumb-theme`) — theme a breadcrumb in one call: surface, spacing, divider, current-item colour, links and accent. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-breadcrumb-*` overrides. Token-based, no Bootstrap dependency.

## [22.0.0] - 2026-06-17

### Changed

- Aligned with Angular 22.
- README documentation standardized.


## [21.1.0] - 2026-03-17

### Changed

- Refactored internal component structure: renamed `hub-breadcrumbs` to `hub-breadcrumb`.
- Improved style encapsulation: manual style import is no longer required as styles are now bundled within the component.

## [21.0.0] - 2026-03-09

### Added

- User list visualization with API integration.

### Changed

- Refactored and renamed `hub-breadcrumbs` service and module for clarity (breaking change).
- Refactored and renamed `hub-breadcrumb` components and directives for consistency (breaking change).

# Changelog

All notable changes to this project will be documented in this file.

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

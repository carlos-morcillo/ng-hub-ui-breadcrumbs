# Changelog

All notable changes to this project will be documented in this file.

## [22.5.2] - 2026-09-02

### Fixed

- **A breadcrumb asked for before the first navigation no longer throws.**

    `breadcrumbs$` opens with `startWith(undefined)`, so the route tree is walked the moment
    anything subscribes — and a page shell that draws its breadcrumb on the first paint
    subscribes while the initial navigation is still in flight. An `ActivatedRoute` carries
    `_futureSnapshot` from the moment it is recognised and `snapshot` only once it is
    activated, so in that window a child exists with no snapshot and `child.snapshot.url`
    threw.

    It did not fail quietly: the exception escaped into the subscription that draws the
    shell, so what a consumer saw was not a missing breadcrumb but the whole header gone,
    with `TypeError: Cannot read properties of undefined (reading 'url')` repeated per load
    and nothing in it naming this service.

    Present in **every release from 21.0.0 onwards**, not only in the two it was observed on:
    `startWith(undefined)` and the unguarded `child.snapshot.url` are both already in
    `v21.0.0`, byte for byte. Whether it surfaces depends on how early the consumer
    subscribes, which is why it went so long unreported — but a reader on 22.4 or on 21.x is
    affected and should not conclude otherwise from where it happened to be measured.

    A route with no snapshot is skipped rather than guessed at: it has no segments and no
    resolved data, so there is nothing to name yet.

## [22.5.1] - 2026-09-01

### Changed

- **The `homepage` in the manifest points at this library's own documentation page** rather than at
  the site root. It is the link a registry shows beside the package and the one a reader clicks from
  it, and landing on a front page they then have to search is a worse answer than landing on the
  reference for the package they were already looking at. Metadata only — no code, no types, no
  styles change, and nothing a consumer imports is affected.

## [22.5.0] - 2026-08-29

### Added

- **Collapsing for long trails.** `maxItems` folds the middle of the trail behind an indicator; `itemsBeforeCollapse` (default `1`) and `itemsAfterCollapse` (default `1`) decide how many crumbs survive at each end. The indicator is a real `<button>`: it takes keyboard focus, carries the accessible name given by the new `collapsedAriaLabel` input, opens the trail in place, and emits the new `collapsedClick` output. An expansion answers one trail — the next navigation collapses it again. Undefined `maxItems` (the default) never collapses, so nothing changes for existing consumers.
- **Crumbs whose destination is not an Angular route.** `BreadcrumbItem` accepts `href`, `target`, `rel` and `download`; a crumb carrying `href` renders a plain anchor instead of a `routerLink`. A `_blank` crumb with no `rel` of its own gets `rel="noopener noreferrer"`, so the destination never inherits a handle on the opener.
- **Two ways in for those crumbs.** A route may declare the object form `data: { breadcrumb: { label, href, target, rel, download } }` (the string and function forms are untouched), and the new `items` input takes over the whole trail when the route tree cannot express it — an ancestor served by another application, or a trail assembled by hand. Left `null`, the component keeps reading `HubBreadcrumbsService`.
- **Keyboard focus ring** on the links and on the collapsed indicator, built on the design-system focus tokens and exposed as `--hub-breadcrumb-link-focus-color`, `--hub-breadcrumb-focus-bg` and `--hub-breadcrumb-focus-ring-width` / `-color` / `-radius`. The outline is traded for the ring, never simply removed. Until now the component styled `:hover` only and left keyboard focus to whatever the host page happened to apply.
- **Collapsed indicator tokens**: `--hub-breadcrumb-collapsed-color`, `--hub-breadcrumb-collapsed-hover-color`, `--hub-breadcrumb-collapsed-bg` and `--hub-breadcrumb-collapsed-hover-bg`.

### Changed

- `BreadcrumbItem` and `BreadcrumbTemplateContext` are now exported from the public API. Consumers of the new `items` input need the type, and reaching into `ng-hub-ui-breadcrumbs/src/lib/models/...` was the only way to get it before.
- `BreadcrumbItem.data` is now optional, so a hand-written trail no longer has to carry `data: {}` on every crumb. The service still fills it with the route's data.

### Fixed

- **The separator sat on the wrong side of every crumb under `dir="rtl"`.** It was floated to the physical left, so in a right-to-left trail it hung off the wrong edge: the first and second crumbs ran together with no separator between them, and a stray one dangled past the last. The pseudo-element is now inline and spaced with logical padding, which puts it on the side the trail comes from in both directions.
- **The README's theming snippet documented a selector that does not win.** The component declares its token defaults on `:host`, so a bare `.hub-breadcrumb { --hub-breadcrumb-accent: … }` rule in an application stylesheet ties on specificity and loses on source order — and a token set on an ancestor element never reaches the component at all. Measured in the browser and corrected: the accent has to be set on the crumb element itself with a selector that outranks `:host` (or inline), while the tokens the stylesheet reads directly — the focus ring, the collapsed indicator — can also be set on `.hub-breadcrumb__list`.

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

# Changelog

All notable changes to this project will be documented in this file.

## [22.7.0] - 2026-09-07

### Fixed

- **`truncateItems` now clips a crumb rendered by a `hubBreadcrumbItem` template.** The clipping
  rules named only the classes the component draws, and the elements a custom template renders
  belong to the consuming component, where a scoped rule cannot reach them — so a consumer who
  had personalised the markup set the input and got nothing at all, in silence. The component now
  draws the clipping box itself, a `span.hub-breadcrumb__custom` wrapped around the projected
  content, and the same rule clips it to `--hub-breadcrumb-max-item-width`. It sits inside the
  item and outside the separator, so a custom crumb gets exactly the width a built-in one gets;
  clipping the `<li>` instead would have folded the separator into the same box and shortened
  every custom label by its width.

### Changed

- **A custom crumb gets the overflow tooltip too.** The new box carries `hubBreadcrumbLabel`, so
  the full text of a clipped custom label is exposed the way a built-in one's is — the native
  `title`, or the hub-ui tooltip when `provideHubBreadcrumbTooltip()` is wired. Applying the
  directive by hand inside the template is no longer needed, and is now only for overriding the
  tooltip text.

- **A `hubBreadcrumbItem` template renders one element deeper.** See `BREAKING_CHANGES.md`.

## [22.6.0] - 2026-09-06

### Added

- **`HubBreadcrumbsService.breadcrumbs`, the trail as a signal.** The service published one
  member, an Observable, so every consumer that wanted the trail in a signal-based component
  wrote the same `toSignal(svc.breadcrumbs$, { initialValue: [] })` — this library's own
  component included. It is wrapped once now, inside the service, and subscribed once for the
  whole application instead of once per breadcrumb on screen. `breadcrumbs$` stays exactly as
  it was for code already composing with rxjs.

### Changed

- **`HubBreadcrumbComponent` no longer re-exports `breadcrumbs$`.** The component carried the
  service's Observable as a public field *and* a signal derived from it, so one trail had two
  public surfaces on the same class and neither was the one the template rendered. It now reads
  `HubBreadcrumbsService.breadcrumbs` directly. Anyone who was reading the field can inject the
  service — that is where the trail was coming from anyway — and anyone substituting the service
  must publish `breadcrumbs`. See `BREAKING_CHANGES.md`.

- **`HubBreadcrumbComponent` now declares `ChangeDetectionStrategy.OnPush`.** The trail, the collapse
  state and the accent are all `computed`, so the component never needed a check it had not been
  marked for, and Angular 22 reads a component that names no strategy as OnPush anyway — nothing
  changes for an application on the current major. The declaration is what carries the strategy into
  the published package: partial compilation only writes it when the source states it, and this
  library's peer range still admits Angular 18, whose linker falls back to `Eager`.

### Deprecated

- **`HubBreadcrumbsModule`, marked for removal in 23.0.0.** The class carried no `@deprecated` tag,
  so an editor gave no hint and neither did the build: a consumer had no way of learning the module
  was on its way out before it stopped existing. It now says so. The module imports and exports
  `HubBreadcrumbComponent` and `HubBreadcrumbItemDirective` — both standalone, both already exported
  from the entry point — and provides nothing of its own, so importing them directly is the whole
  migration. `HubBreadcrumbsService` is `providedIn: 'root'` and never travelled through the module.
  See `BREAKING_CHANGES.md`.

### Fixed

- **Opening a collapsed trail from the keyboard no longer leaves focus on the page body.** The
  `…` indicator is the element the reader activates, and expanding removes it from the DOM —
  the browser answers that by focusing `<body>`, so someone who had just pressed Enter had to
  tab from the top of the page to reach the crumbs they asked for. Focus is now handed to the
  first crumb the gesture reveals (the one at `itemsBeforeCollapse`), which is where reading
  continues; a crumb that renders as plain text takes it through a temporary `tabindex="-1"`,
  so focus is never dropped. Consumers who moved focus by hand in `(collapsedClick)` can drop
  that code.

- **The current crumb is announced as the current page even when the consumer renders it.**
  `aria-current="page"` sat on the default `<span>` — the one branch a `hubBreadcrumbItem`
  template replaces — so a trail with a custom template reached assistive technology with
  nothing marking the current page, while the docs kept promising the attribute unqualified.
  It now sits on the `<li>`, which wraps every branch, custom templates included. Note that it
  **moved**: a stylesheet or a test selecting `.hub-breadcrumb__text[aria-current]` should read
  `.hub-breadcrumb__item[aria-current]` instead (the `hub-breadcrumb__item--active` modifier is
  unchanged and is still the styling hook).

- **`--hub-breadcrumb-accent` set from the application reaches the component again.** The slot
  was declared on `:host`, which under emulated encapsulation is a `[_nghost]` rule (0,1,0) on
  the crumb element itself: a consumer's `hub-breadcrumb { --hub-breadcrumb-accent: … }` (0,0,1)
  lost, `.hub-breadcrumb { … }` tied and lost on source order, and a value inherited from an
  ancestor — a wrapper div, a scope class, the `hub-breadcrumb-theme()` mixin included on one —
  never reached the links at all, because a declaration on the element always beats inheritance.
  22.5.0 measured this and documented the workaround; the cascade itself is now fixed. The slot
  is no longer declared on the host: it is read where it is consumed as
  `var(--hub-breadcrumb-accent, var(--hub-sys-color-primary, #0d6efd))`, so the default look is
  byte-identical, `variant` still wins over a consumer rule (that is what a variant is for), and
  a plain tag or class rule — or any ancestor — now recolours the links and everything derived
  from them. Measured in a browser against the compiled and shimmed CSS. The remaining
  `--hub-breadcrumb-*` defaults still live on `:host`, so overriding those still means the crumb
  element itself or `.hub-breadcrumb__list`.

- **The built-in variant list in the component now names the same nine accents its stylesheet
  emits.** 22.2.0 grew the accent set from five to the nine canonical ones in the SCSS `@each`
  loop, but `BUILT_IN_VARIANTS` was left at the original five, so `secondary`, `neutral`, `light`
  and `dark` were treated as custom accents and got an inline `--hub-breadcrumb-accent` on the
  host on top of the stylesheet rule that already set them. Nothing rendered differently — both
  paths resolve to the same token — but an inline style outranks anything a consumer writes in a
  sheet, so overriding the accent for one of those four took an `!important` it should never have
  needed. The `variant` JSDoc listed the same stale five and now names all nine.

- **The documentation described an API this library does not have, and taught a mixin selector
  that does not win.** The README opened its reference with "exposes a single optional input"
  above a table of seven inputs and one output, listed five built-in variants against the nine
  the stylesheet emits, never named `HubBreadcrumbLabelDirective` or the tooltip adapter
  contract although both are exported, promised truncation without saying that a
  `hubBreadcrumbItem` template renders its own elements — which the component's scoped styles
  cannot reach, so they get neither the ellipsis nor the tooltip — and still announced v21.1.0
  as the latest release. The `hub-breadcrumb-theme()` snippet included the mixin on a bare
  class, which ties with `:host` and loses on source order, or on a wrapper, from where every
  token but the accent is shut out by the host's own declaration; it now lands on the crumb
  element with a selector that outranks `:host`, measured in a browser against the shimmed CSS.
  `BREAKING_CHANGES.md` was titled after v21.1.0 over a 22.4.0 section, `FUNCTIONALITIES.md`
  marked `(collapsedClick)` and the tooltip adapter as uncovered while the examples exercise
  both, and `docs/css-variables-reference.md` referenced the three derived `-accent-*` tokens
  from other rows without documenting any of them. Documentation only — no code, no types and
  no styles change.

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

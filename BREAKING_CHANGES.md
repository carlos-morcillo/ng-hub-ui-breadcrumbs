# Breaking Changes

Every release of `ng-hub-ui-breadcrumbs` that asks something of a consumer, newest first. The
major tracks the Angular major this library targets, so a breaking change ships inside a minor
and this file is the notice semver cannot give.

## [22.7.0] - 2026-09-07
### A `hubBreadcrumbItem` template renders inside a `span.hub-breadcrumb__custom`

- **Change**: the component now wraps the projected content of a custom item template in a
  `<span class="hub-breadcrumb__custom">` of its own. That span is what `truncateItems` clips —
  scoped styles cannot reach elements the consuming component owns, which is why the input used
  to be ignored whenever the markup had been taken over.
- **Impact**: the crumb's markup is one element deeper. A selector written against the old shape
  — `.hub-breadcrumb__item > a`, `li > .my-crumb`, a `:first-child` counted from the item — stops
  matching. Nothing in TypeScript notices; the styles simply stop applying.
- **Migration**: drop the direct-child combinator (`.hub-breadcrumb__item a`), or target the new
  box (`.hub-breadcrumb__custom > .my-crumb`). If the template clipped its own label to work
  around the old limitation, that CSS can go: the box clips it now, and a width set on both is
  applied twice.

## [22.6.0] - 2026-09-06
### `HubBreadcrumbComponent.breadcrumbs$` is gone

- **Change**: the component no longer re-exports the service's Observable. It reads the new
  `HubBreadcrumbsService.breadcrumbs` signal, which is the single surface for the trail.
- **Impact**: `@ViewChild(HubBreadcrumbComponent).breadcrumbs$` — or any other read of the field
  — is now `undefined`. TypeScript catches it; a template or a JavaScript consumer does not.
- **Migration**: inject `HubBreadcrumbsService` and read `breadcrumbs()` (or `breadcrumbs$`, which
  the service still publishes). The trail was always the service's; the component only forwarded it.

### A replacement `HubBreadcrumbsService` must publish `breadcrumbs`

- **Change**: the component reads `breadcrumbs`, the signal, instead of subscribing to `breadcrumbs$`.
- **Impact**: a stand-in provided for the token — a test double, a facade over another source —
  that offers only `breadcrumbs$` leaves the component with nothing to read, and it fails at
  construction with `Cannot read properties of undefined`.
- **Migration**: publish the trail as a signal, e.g. `readonly breadcrumbs = signal<BreadcrumbItem[]>([])`
  (or `toSignal(yourStream, { initialValue: [] })`). Keeping `breadcrumbs$` alongside it is optional.


### Announced: `HubBreadcrumbsModule` is removed in 23.0.0

- **Change**: the class is now marked `@deprecated`. Nothing is removed here and nothing changes at
  runtime — this release is the notice, and the removal lands in 23.0.0, the next version that tracks
  a new Angular major.
- **Impact**: from 23.0.0 the symbol is gone from the entry point, so `import { HubBreadcrumbsModule }`
  and `imports: [HubBreadcrumbsModule]` stop compiling.
- **Migration**: import the two standalone declarables the module re-exported. `HubBreadcrumbsService`
  is `providedIn: 'root'` and never travelled through the module, so nothing else moves.

  ```ts
  // Before
  @NgModule({ imports: [HubBreadcrumbsModule] })
  export class AppModule {}

  // After
  @Component({ imports: [HubBreadcrumbComponent, HubBreadcrumbItemDirective] })
  export class ShellComponent {}
  ```

## [22.4.0] - 2026-07-07

### SCSS ships at `ng-hub-ui-breadcrumbs/styles` (packaging path)

- **Change**: the theming mixin now builds to `dist/breadcrumbs/styles/...` instead of `dist/breadcrumbs/src/lib/styles/...`, and a `styles/index.scss` root entry forwards it.
- **Impact**: a `@use` that reached into the old `src/lib/styles/...` path no longer resolves.
- **Migration**: `@use 'ng-hub-ui-breadcrumbs/styles' as *;`

## [21.1.0] - 2026-03-17

Structural changes to improve consistency across the `ng-hub-ui` library family.

### Component Renaming

The main component has been renamed for better alignment with Angular best practices and other components in the library.

#### Breadcrumb Component
- **Old Selector**: `hub-breadcrumbs`
- **New Selector**: `hub-breadcrumb`
- **Old Class**: `HubBreadcrumbsComponent`
- **New Class**: `HubBreadcrumbComponent`

**Migration Steps:**
1. Update your templates to use `<hub-breadcrumb>` instead of `<hub-breadcrumbs>`.
2. Update your TypeScript imports to use `HubBreadcrumbComponent`.

### Style Management

Starting from v21.1.0, the component styles are automatically included when you use the component.

#### CSS/SCSS Imports
- **Change**: You no longer need to manually import `ng-hub-ui-breadcrumbs/styles/breadcrumbs.scss` or similar in your global styles.
- **Migration Steps**: Remove any manual imports of the breadcrumb styles from your `styles.scss` or `angular.json`.

### Internal Structure

The internal file structure has been reorganized. If you were importing internal files directly (which is not recommended), you may need to update your import paths. Always prefer importing from the public API: `ng-hub-ui-breadcrumbs`.

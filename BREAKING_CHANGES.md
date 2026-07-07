# Breaking Changes - v21.1.0

This version introduces structural changes to improve consistency across the `ng-hub-ui` library family.

## [22.4.0] - 2026-07-07

### SCSS ships at `ng-hub-ui-breadcrumbs/styles` (packaging path)

- **Change**: the theming mixin now builds to `dist/breadcrumbs/styles/...` instead of `dist/breadcrumbs/src/lib/styles/...`, and a `styles/index.scss` root entry forwards it.
- **Impact**: a `@use` that reached into the old `src/lib/styles/...` path no longer resolves.
- **Migration**: `@use 'ng-hub-ui-breadcrumbs/styles' as *;`

## Component Renaming

The main component has been renamed for better alignment with Angular best practices and other components in the library.

### Breadcrumb Component
- **Old Selector**: `hub-breadcrumbs`
- **New Selector**: `hub-breadcrumb`
- **Old Class**: `HubBreadcrumbsComponent`
- **New Class**: `HubBreadcrumbComponent`

**Migration Steps:**
1. Update your templates to use `<hub-breadcrumb>` instead of `<hub-breadcrumbs>`.
2. Update your TypeScript imports to use `HubBreadcrumbComponent`.

## Style Management

Starting from v21.1.0, the component styles are automatically included when you use the component.

### CSS/SCSS Imports
- **Change**: You no longer need to manually import `ng-hub-ui-breadcrumbs/styles/breadcrumbs.scss` or similar in your global styles.
- **Migration Steps**: Remove any manual imports of the breadcrumb styles from your `styles.scss` or `angular.json`.

## Internal Structure

The internal file structure has been reorganized. If you were importing internal files directly (which is not recommended), you may need to update your import paths. Always prefer importing from the public API: `ng-hub-ui-breadcrumbs`.

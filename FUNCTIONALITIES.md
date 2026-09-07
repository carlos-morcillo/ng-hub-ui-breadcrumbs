# Functionalities of Breadcrumbs Library

This table details the functionalities of the `ng-hub-ui-breadcrumbs` library and indicates which ones are covered by interactive examples.

## Breadcrumb (`hub-breadcrumb`)

| Category         | Functionality                                                | Example Covered |
| :--------------- | :----------------------------------------------------------- | :-------------: |
| **Trail source** | Explicit trail (`items`)                                     |       [x]       |
|                  | Router-derived trail (`HubBreadcrumbsService.breadcrumbs`)   |       [ ]       |
|                  | Trail that changes as the user navigates                     |       [x]       |
|                  | Trail read outside the component (`breadcrumbs` signal)      |       [x]       |
| **Item content** | Label and link per item                                      |       [x]       |
|                  | Icons on an item                                             |       [x]       |
|                  | External links                                               |       [x]       |
|                  | Custom item template                                         |       [x]       |
| **Collapsing**   | `maxItems` — collapse past a length                          |       [x]       |
|                  | `itemsBeforeCollapse` / `itemsAfterCollapse`                 |       [x]       |
|                  | `collapsedAriaLabel` — accessible name for the expander      |       [ ]       |
|                  | `(collapsedClick)` — the expander was pressed                |       [x]       |
| **Truncation**   | `truncateItems` — ellipsise a long label                     |       [x]       |
|                  | Tooltip on a truncated label (`provideHubBreadcrumbTooltip`) |       [x]       |
|                  | Truncation of a `hubBreadcrumbItem` crumb                    |       [ ]       |
| **Appearance**   | `variant`                                                    |       [x]       |
|                  | CSS variables theming                                        |       [x]       |
|                  | `hub-breadcrumb-theme()` mixin                               |       [x]       |
|                  | Focus ring                                                   |       [x]       |
|                  | RTL layout                                                   |       [x]       |

Examples live in the documentation site under `src/app/pages/examples/breadcrumbs/`.

Worth naming, because the table above would otherwise mislead: **no example renders a
router-derived trail**. Most of them replace the service through `breadcrumbs-demo.providers.ts`
with a stand-in publishing a trail the demo controls; the two that do not — external links and
the focus ring — inject the real `HubBreadcrumbsService` and then discard whatever it emits by
passing `[items]`. Either way the router-walking code, including the first-navigation window fixed in
22.5.2, never reaches the screen. That path is covered by specs, not by a demo, and it cannot be
staged in one: by the time a docs example renders, the router has long since activated.

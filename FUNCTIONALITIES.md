# Functionalities of Breadcrumbs Library

This table details the functionalities of the `ng-hub-ui-breadcrumbs` library and indicates which ones are covered by interactive examples.

## Breadcrumb (`hub-breadcrumb`)

| Category         | Functionality                                                | Example Covered |
| :--------------- | :----------------------------------------------------------- | :-------------: |
| **Trail source** | Explicit trail (`items`)                                     |       [x]       |
|                  | Router-derived trail (`HubBreadcrumbsService.breadcrumbs$`)  |       [ ]       |
|                  | Trail that changes as the user navigates                     |       [x]       |
| **Item content** | Label and link per item                                      |       [x]       |
|                  | Icons on an item                                             |       [x]       |
|                  | External links                                               |       [x]       |
|                  | Custom item template                                         |       [x]       |
| **Collapsing**   | `maxItems` — collapse past a length                          |       [x]       |
|                  | `itemsBeforeCollapse` / `itemsAfterCollapse`                 |       [x]       |
|                  | `collapsedAriaLabel` — accessible name for the expander      |       [ ]       |
|                  | `(collapsedClick)` — the expander was pressed                |       [ ]       |
| **Truncation**   | `truncateItems` — ellipsise a long label                     |       [x]       |
|                  | Tooltip on a truncated label (`provideHubBreadcrumbTooltip`) |       [ ]       |
| **Appearance**   | `variant`                                                    |       [x]       |
|                  | CSS variables theming                                        |       [x]       |
|                  | `hub-breadcrumb-theme()` mixin                               |       [x]       |
|                  | Focus ring                                                   |       [x]       |
|                  | RTL layout                                                   |       [x]       |

Examples live in the documentation site under `src/app/pages/examples/breadcrumbs/`.

Worth naming, because the table above would otherwise mislead: **the examples never exercise
`HubBreadcrumbsService`**. `breadcrumbs-demo.providers.ts` replaces it with a static service that
returns a fixed trail, so the router-walking code — including the first-navigation window fixed in
22.5.2 — is unreachable from any page. That path is covered by specs, not by a demo, and it cannot
be staged in one: by the time a docs example renders, the router has long since activated.

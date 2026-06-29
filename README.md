# ng-hub-ui-breadcrumbs

[Español](./README.es.md) | **English**

![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-breadcrumbs)
![License](https://img.shields.io/npm/l/ng-hub-ui-breadcrumbs)

A flexible and reusable breadcrumb component for Angular applications that automatically generates breadcrumbs entirely based on your routing configuration.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/breadcrumbs/overview/
- Live examples: https://hubui.dev/breadcrumbs/examples/
- Hub UI: https://hubui.dev/

## 🧩 Library Family `ng-hub-ui`

This library is part of the **ng-hub-ui** ecosystem:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) (deprecated — use ng-hub-ui-panels)
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs) ← You are here
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-dropdown**](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Styling](#styling)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Description

`ng-hub-ui-breadcrumbs` is a lightweight, fully reactive breadcrumb component for Angular standalone applications. Instead of manually maintaining breadcrumb trails, the library subscribes to the Angular `Router` and rebuilds the breadcrumb list automatically on every navigation, reading a `breadcrumb` entry from each route's `data` configuration.

It supports static labels, dynamic labels resolved from route data (via functions or `{key}` interpolation), lazy-loaded routes, and full template customization through a structural directive. Styling is handled entirely through CSS custom properties, so the component adapts to any design system or Bootstrap theme without overriding internal markup.

## Features

- **Automatic Breadcrumb Generation**: Automatically builds breadcrumbs from your Angular `Routes` configuration.
- **Dynamic Labels**: Supports dynamic labels via functions or string interpolation using resolved data.
- **Custom Templates**: Full control over how each breadcrumb item is rendered using a structural directive.
- **RTL Support**: Ships a flipped divider token (`--hub-breadcrumb-divider-flipped`) for Right-to-Left layouts.
- **Opt-in Truncation + Tooltip**: Set `truncateItems` to clip long labels with an ellipsis (bounded by `--hub-breadcrumb-max-item-width`) and reveal the full text on hover — the native `title` by default, or the richer hub-ui tooltip when wired (see below).
- **Lazy Loading Compatible**: Works seamlessly with lazy-loaded routes.
- **Zero Manual Style Import**: Styles are bundled within the component — no separate SCSS import is required.

## Installation

```bash
npm install ng-hub-ui-breadcrumbs
```

## Quick Start

Get up and running in under five minutes.

### 1. Install

```bash
npm install ng-hub-ui-breadcrumbs
```

### 2. Import the component

```typescript
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';

@Component({
	// ...
	imports: [HubBreadcrumbComponent]
})
export class AppComponent {}
```

### 3. Add breadcrumb data to your routes

```typescript
const routes: Routes = [
	{ path: '', data: { breadcrumb: 'Home' } },
	{ path: 'products', data: { breadcrumb: 'Products' } }
];
```

### 4. Drop the component in your layout

```html
<hub-breadcrumb></hub-breadcrumb>
```

**💡 That's it!** The breadcrumb trail now updates automatically as the user navigates.

## Usage

### 1. Import the Component

You can import the `HubBreadcrumbComponent` directly in your standalone component, or use `HubBreadcrumbsModule` in a module-based setup.

```typescript
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';

@Component({
	// ...
	imports: [HubBreadcrumbComponent]
})
export class AppComponent {}
```

### 2. Add to Template

Place the component in your application's main layout or wherever you want breadcrumbs to appear.

```html
<hub-breadcrumb></hub-breadcrumb>
```

### 3. Configure Routes

The most critical part is adding `data: { breadcrumb: '...' }` to your routes.

```typescript
const routes: Routes = [
	{
		path: '',
		data: { breadcrumb: 'Home' } // Standard static label
	},
	{
		path: 'products',
		data: { breadcrumb: 'Products' },
		children: [
			// ... child routes
		]
	}
];
```

### 4. Working with Lazy Loading

For lazy-loaded routes, configure the parent route with breadcrumb data:

```typescript
// app.routes.ts
const routes: Routes = [
	{
		path: 'admin',
		data: { breadcrumb: 'Administration' },
		loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES)
	}
];

// admin.routes.ts
const adminRoutes: Routes = [
	{
		path: 'users',
		data: { breadcrumb: 'Users' }
	}
];
```

This will generate breadcrumbs like: Home > Administration > Users

### Dynamic Labels with Functions

You can use a function to generate the breadcrumb label dynamically based on route data. The function receives the resolved route `data`.

```typescript
const routes: Routes = [
	{
		path: 'dashboard',
		resolve: { userInfo: UserResolver },
		data: {
			breadcrumb: (data: any) => `User: ${data.userInfo.name}` // Function creates label from resolved data
		}
	}
];
```

### Dynamic Labels with Interpolation

Alternatively, you can use string interpolation `{key}` if your data is under a `resolvedData` property.

```typescript
const routes: Routes = [
	{
		path: 'product/:id',
		resolve: {
			resolvedData: ProductResolver // Must be named 'resolvedData' for interpolation
		},
		data: {
			breadcrumb: 'Product: {name}' // Replaces {name} with resolvedData.name
		}
	}
];
```

### Custom Icons

You can attach arbitrary data (like icons) to your route config and use it in a custom template via the `hubBreadcrumbItem` directive.

```typescript
// Route Configuration
{
	path: 'settings',
	data: {
		breadcrumb: 'Settings',
		icon: 'fa fa-cog' // Custom data property
	}
}
```

```html
<!-- Custom Template Implementation -->
<hub-breadcrumb>
	<ng-template hubBreadcrumbItem let-item let-isLast="isLast">
		<!-- 'item.data' contains the entire route data object -->
		@if (item.data.icon) {
		<i [class]="item.data.icon"></i>
		}
		<a [routerLink]="item.url">{{ item.label }}</a>
	</ng-template>
</hub-breadcrumb>
```

### Custom Template & Separators

Fully customize the structure, including separators/dividers.

```html
<hub-breadcrumb>
	<ng-template hubBreadcrumbItem let-item let-isLast="isLast">
		<span class="my-breadcrumb-item">
			<a [routerLink]="item.url">{{ item.label }}</a>
		</span>
		<!-- Custom Separator -->
		@if (!isLast) {
		<span class="separator"> / </span>
		}
	</ng-template>
</hub-breadcrumb>
```

## API Reference

### HubBreadcrumbComponent

The main container component. It reads the breadcrumb trail directly from the Angular `Router` and exposes a single optional input for theming the links.

| Selector         | Host class        |
| ---------------- | ----------------- |
| `hub-breadcrumb` | `.hub-breadcrumb` |

#### Inputs

| Input     | Type     | Default     | Description                                                                                                                                                                                                                                                                                                                  |
| --------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant` | `string` | `undefined` | Selects a **semantic accent** for the breadcrumb links and their hover. The built-in values (`primary`, `success`, `danger`, `warning`, `info`) map to the exact design-system tints; **any other string is also accepted** and resolves through `--hub-sys-color-<variant>`. The current (last) item always stays muted. When omitted, links use the standard link colour (no visual change). |
| `truncateItems` | `boolean` | `false` | When `true`, clips each label to `--hub-breadcrumb-max-item-width` (default `12rem`) with an ellipsis and shows the full text as a tooltip when a label overflows. Off by default, so the standard layout and wrapping are unchanged. |

```html
<!-- Built-in semantic accent -->
<hub-breadcrumb variant="success"></hub-breadcrumb>

<!-- Custom accent — resolves to var(--hub-sys-color-brand) -->
<hub-breadcrumb variant="brand"></hub-breadcrumb>

<!-- Clip long labels and reveal the full text on hover -->
<hub-breadcrumb [truncateItems]="true"></hub-breadcrumb>
```

#### Tooltip on truncated labels (optional)

When `truncateItems` is on, a clipped label exposes its full text on hover. By
default this uses the native browser `title` attribute (zero dependencies). To
upgrade every truncated label to the richer, themeable hub-ui tooltip, provide an
adapter once — e.g. the one shipped by `ng-hub-ui-utils`:

```ts
import { provideHubBreadcrumbTooltip } from 'ng-hub-ui-breadcrumbs';
import { hubTooltipAdapter } from 'ng-hub-ui-utils';

export const appConfig: ApplicationConfig = {
  providers: [provideHubBreadcrumbTooltip(hubTooltipAdapter)]
};
```

Remove the provider and breadcrumbs gracefully fall back to the native tooltip.

It projects a single optional content template via the `hubBreadcrumbItem` directive (read through `contentChild`). When no template is provided, the component renders a default breadcrumb list.

### HubBreadcrumbItemDirective

A structural directive used to define a custom template for breadcrumb items.

| Selector              | Context Type                |
| --------------------- | --------------------------- |
| `[hubBreadcrumbItem]` | `BreadcrumbTemplateContext` |

### HubBreadcrumbsService

An injectable (`providedIn: 'root'`) service that exposes the reactive breadcrumb stream. The component uses it internally; you can also inject it directly when you need the breadcrumb data elsewhere.

| Member          | Type                          | Description                                                                   |
| --------------- | ----------------------------- | ----------------------------------------------------------------------------- |
| `breadcrumbs$`  | `Observable<BreadcrumbItem[]>` | Emits the current breadcrumb trail on every `NavigationEnd` (and on startup). |

### HubBreadcrumbsModule

An optional `NgModule` that imports and exports `HubBreadcrumbComponent` and `HubBreadcrumbItemDirective` for module-based applications.

### Interfaces

#### BreadcrumbItem

| Property | Type     | Description                                              |
| -------- | -------- | -------------------------------------------------------- |
| `label`  | `string` | The resolved text to display for the breadcrumb.         |
| `url`    | `string` | The full URL path to navigate to.                        |
| `data`   | `any`    | The original route data object (useful for icons, etc.). |

#### BreadcrumbTemplateContext

| Property    | Type             | Description                                                    |
| ----------- | ---------------- | -------------------------------------------------------------- |
| `$implicit` | `BreadcrumbItem` | The current breadcrumb item object (bound via `let-item`).     |
| `isLast`    | `boolean`        | `true` if this item is the last one in the list (current page). |

## Styling

`ng-hub-ui-breadcrumbs` is fully style-configurable through CSS custom properties. Styles are bundled within the component, so no manual import is required.

For a complete and up-to-date token catalog, see [CSS Variables Reference](./docs/css-variables-reference.md).

### Quick customization example (framework-agnostic)

```scss
.hub-breadcrumb__list {
	--hub-breadcrumb-bg: #f8f9fa;
	--hub-breadcrumb-divider: '→';
	--hub-breadcrumb-link-color: #0d6efd;
	--hub-breadcrumb-item-active-color: #6c757d;
}
```

### Semantic accent token

The link colour follows the `--hub-breadcrumb-accent` token (which itself defaults to the standard link colour). Setting a `variant` re-bases this token; you can also override it directly:

```scss
.hub-breadcrumb {
	--hub-breadcrumb-accent: var(--hub-sys-color-info);
}
```

### Bootstrap integration (optional)

```scss
.hub-breadcrumb__list {
	--hub-breadcrumb-bg: var(--bs-light);
	--hub-breadcrumb-link-color: var(--bs-primary);
	--hub-breadcrumb-link-hover-color: var(--bs-primary-text-emphasis);
	--hub-breadcrumb-item-active-color: var(--bs-secondary-color);
}
```

### Theming with the `hub-breadcrumb-theme()` Sass mixin

For a one-call theme that sets surface, spacing, divider, current-item colour, links and accent, use the `hub-breadcrumb-theme()` mixin. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-breadcrumb-*` overrides. It is token-based with no Bootstrap dependency.

```scss
@use 'ng-hub-ui-breadcrumbs/styles/mixins/breadcrumb-theme' as *;

.docs-breadcrumb {
	@include hub-breadcrumb-theme(
		$bg: #f8fafc,
		$padding-x: 0.75rem,
		$divider: "'/'", // keep the inner quotes — it feeds CSS `content`
		$accent: var(--hub-sys-color-info)
	);
}
```

## Changelog

All notable changes are documented in the [CHANGELOG.md](./CHANGELOG.md). For breaking changes, see [BREAKING_CHANGES.md](./BREAKING_CHANGES.md).

The latest release is **v21.1.0**, which renamed the selector from `hub-breadcrumbs` to `hub-breadcrumb` and bundled the component styles (manual style imports are no longer required).

## Contributing

We appreciate your interest in contributing to Hub Breadcrumb! Here's how you can help:

### Development Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/carlos-morcillo/ng-hub-ui-breadcrumbs.git
    cd ng-hub-ui-breadcrumbs
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Start the development server**

    ```bash
    npm start
    ```

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactors
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:

```bash
git commit -m "feat: add custom divider support"
```

## Support

If you find this project helpful and would like to support its development, you can buy me a coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

Your support is greatly appreciated and helps maintain and improve this project!

For bugs and feature requests, please open an issue at https://github.com/carlos-morcillo/ng-hub-ui-breadcrumbs/issues.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Carlos Morcillo Fernández](https://www.carlosmorcillo.com)

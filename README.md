# ng-hub-ui-breadcrumbs

![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-breadcrumbs)
![License](https://img.shields.io/npm/l/ng-hub-ui-breadcrumbs)

A flexible and reusable breadcrumb component for Angular applications that automatically generates breadcrumbs entirely based on your routing configuration.

## 🧩 Library Family `ng-hub-ui`

This library is part of the **ng-hub-ui** ecosystem:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [API Reference](#api-reference)
- [Styling](#styling)
- [Support & License](#support--license)

## Features

- **Automatic Breadcrumb Generation**: Automatically builds breadcrumbs from your Angular `Routes` configuration.
- **Dynamic Labels**: Supports dynamic labels via functions or string interpolation using resolved data.
- **Custom Templates**: Full control over how each breadcrumb item is rendered using directives.
- **RTL Support**: Built-in support for Right-to-Left languages.
- **Lazy Loading Compatible**: Works seamlessly with lazy-loaded modules.

## Installation

```bash
npm install ng-hub-ui-breadcrumbs
```

## Usage

### 1. Import the Component

You can import the `HubBreadcrumbsComponent` directly in your standalone component or module.

```typescript
import { HubBreadcrumbsComponent } from 'ng-hub-ui-breadcrumbs';

@Component({
	// ...
	imports: [HubBreadcrumbsComponent]
})
export class AppComponent {}
```

### 2. Add to Template

Place the component in your application's main layout or wherever you want breadcrumbs to appear.

```html
<hub-breadcrumbs></hub-breadcrumbs>
```

### 3. Configure Routes

The most critical part is adding `data: { breadcrumb: '...' }` to your routes.

````typescript
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
````

### 4. Working with Lazy Loading

For lazy-loaded modules, configure the parent route with breadcrumb data:

```typescript
// app-routing.module.ts
const routes: Routes = [
	{
		path: 'admin',
		data: { breadcrumb: 'Administration' },
		loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule)
	}
];

// admin-routing.module.ts
const adminRoutes: Routes = [
	{
		path: 'users',
		data: { breadcrumb: 'Users' }
	}
];
```

This will generate breadcrumbs like: Home > Administration > Users

## Examples

### Dynamic Labels with Functions

You can use a function to generate the breadcrumb label dynamically based on route data.

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

You can attach arbitrary data (like icons) to your route config and use it in a custom template.

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
<hub-breadcrumbs>
	<ng-template hubBreadcrumbItem let-item let-isLast="isLast">
		<!-- 'item.data' contains the entire route data object -->
		@if (item.data.icon) {
		<i [class]="item.data.icon"></i>
		}
		<a [routerLink]="item.url">{{ item.label }}</a>
	</ng-template>
</hub-breadcrumbs>
```

### Custom Template & Separators

Fully customize the structure, including separators/dividers.

```html
<hub-breadcrumbs>
	<ng-template hubBreadcrumbItem let-item let-isLast="isLast">
		<span class="my-breadcrumb-item">
			<a [routerLink]="item.url">{{ item.label }}</a>
		</span>
		<!-- Custom Separator -->
		@if (!isLast) {
		<span class="separator"> / </span>
		}
	</ng-template>
</hub-breadcrumbs>
```

## API Reference

### HubBreadcrumbsComponent

The main container component. It doesn't have any inputs as it reads directly from the Router.

| Selector          | Exported As      |
| ----------------- | ---------------- |
| `hub-breadcrumbs` | `hubBreadcrumbs` |

### HubBreadcrumbItemDirective

A structural directive used to define a custom template for breadcrumb items.

| Selector              | Context Type                |
| --------------------- | --------------------------- |
| `[hubBreadcrumbItem]` | `BreadcrumbTemplateContext` |

### Interfaces

#### BreadcrumbItem

| Property | Type     | Description                                             |
| -------- | -------- | ------------------------------------------------------- |
| `label`  | `string` | The resolved text to display for the breadcrumb.        |
| `url`    | `string` | The full URL path to navigate to.                       |
| `data`   | `any`    | The original route data object (useful for icons, etc). |

#### BreadcrumbTemplateContext

| Property    | Type             | Description                                                   |
| ----------- | ---------------- | ------------------------------------------------------------- |
| `$implicit` | `BreadcrumbItem` | The current breadcrumb item object.                           |
| `isLast`    | `boolean`        | True if this item is the last one in the list (current page). |

## Styling

You can customize the appearance using CSS variables or SCSS variables if you are using Sass.

### CSS Variables

These variables are exposed for runtime customization:

| Variable                             | Default   | Description                          |
| ------------------------------------ | --------- | ------------------------------------ |
| `--hub-breadcrumb-padding-x`         | `1rem`    | Horizontal padding of the container. |
| `--hub-breadcrumb-padding-y`         | `0.25rem` | Vertical padding of the container.   |
| `--hub-breadcrumb-margin-bottom`     | `0`       | Bottom margin of the container.      |
| `--hub-breadcrumb-bg`                | `white`   | Background color.                    |
| `--hub-breadcrumb-border-radius`     | `50rem`   | Border radius of the container.      |
| `--hub-breadcrumb-divider-color`     | `black`   | Color of the separator.              |
| `--hub-breadcrumb-item-padding-x`    | `0.5rem`  | Horizontal padding of each item.     |
| `--hub-breadcrumb-item-active-color` | `black`   | Color of the active (last) item.     |

### SCSS Variables

These SCSS variables set the default values and can be overridden:

| Variable                      | Default               | Description                |
| ----------------------------- | --------------------- | -------------------------- |
| `$border-radius-pill`         | `50rem`               | Default border radius.     |
| `$secondary-color`            | `black`               | Default secondary color.   |
| `$breadcrumb-font-size`       | `null`                | Font size (null inherits). |
| `$breadcrumb-padding-y`       | `0.25rem`             | Vertical padding.          |
| `$breadcrumb-padding-x`       | `1rem`                | Horizontal padding.        |
| `$breadcrumb-item-padding-x`  | `0.5rem`              | Item horizontal padding.   |
| `$breadcrumb-margin-bottom`   | `0`                   | Bottom margin.             |
| `$breadcrumb-bg`              | `white`               | Background color.          |
| `$breadcrumb-divider-color`   | `$secondary-color`    | Divider color.             |
| `$breadcrumb-active-color`    | `$secondary-color`    | Active item color.         |
| `$breadcrumb-divider`         | `quote('>')`          | Divider character.         |
| `$breadcrumb-divider-flipped` | `$breadcrumb-divider` | Divider for RTL.           |
| `$breadcrumb-border-radius`   | `$border-radius-pill` | Border radius.             |

### Customizing Styles

1. **Override SCSS variables** (compile-time):

    ```scss
    // your-styles.scss
    $breadcrumb-bg: #f8f9fa;
    $breadcrumb-divider: quote('→');
    $breadcrumb-active-color: #6c757d;
    ```

2. **Override CSS variables** (runtime):

    ```css
    .hub-breadcrumbs__list {
    	--hub-breadcrumb-bg: #f8f9fa;
    	--hub-breadcrumb-divider-color: #6c757d;
    }
    ```

3. **Override classes directly**:
    ```scss
    .hub-breadcrumbs__item {
    	&--active {
    		font-weight: bold;
    	}
    }
    ```

### Inline Style Customization

You can customize the breadcrumb directly in your template using inline styles:

```html
<hub-breadcrumbs
	style="
  --hub-breadcrumb-divider: '🐸';
  --hub-breadcrumb-bg: #e9ecef;
  --hub-breadcrumb-item-active-color: #0d6efd;
"
></hub-breadcrumbs>
```

Common use cases:

- **Custom divider**:

    ```html
    <hub-breadcrumbs style="--hub-breadcrumb-divider: '→'"></hub-breadcrumbs>
    <hub-breadcrumbs style="--hub-breadcrumb-divider: '>'"></hub-breadcrumbs>
    <hub-breadcrumbs style="--hub-breadcrumb-divider: '/'"></hub-breadcrumbs>
    ```

- **Custom colors**:

    ```html
    <hub-breadcrumbs
    	style="
      --hub-breadcrumb-bg: transparent;
      --hub-breadcrumb-divider-color: #6c757d;
      --hub-breadcrumb-item-active-color: #0d6efd;
    "
    ></hub-breadcrumbs>
    ```

- **Custom spacing**:
    ```html
    <hub-breadcrumbs
    	style="
      --hub-breadcrumb-padding-x: 0;
      --hub-breadcrumb-padding-y: 0;
      --hub-breadcrumb-item-padding-x: 1rem;
    "
    ></hub-breadcrumbs>
    ```

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

### Testing

Run the test suite:

```bash
# Unit tests
npm run test

# E2E tests
npm run e2e

# Test coverage
npm run test:coverage
```

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code refactors
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:

```bash
git commit -m "feat: add custom divider support"
```

## Support & License

If you find this project helpful and would like to support its development, you can buy me a coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

Your support is greatly appreciated and helps maintain and improve this project!

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Carlos Morcillo Fernández]

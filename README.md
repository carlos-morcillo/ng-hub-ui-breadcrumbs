# Hub UI Breadcrumb

A flexible and reusable breadcrumb component for Angular applications that automatically generates breadcrumbs based on your routing configuration.

## Installation

```bash
npm install ng-hub-ui-breadcrumbs
```

## Features

- Automatic breadcrumb generation from route configuration
- Customizable through CSS variables
- RTL support
- Templating support for custom breadcrumb items
- Bootstrap-compatible styling

## Usage

## Basic Setup

You can use this component in two ways:

### 1. Standalone Components

Import the required artifacts in your component:

```typescript
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';
import { HubBreadcrumbItemDirective } from 'ng-hub-ui-breadcrumbs';

@Component({
  // ...
  imports: [HubBreadcrumbComponent, HubBreadcrumbItemDirective]
})
```

### 2. Module Import

If you prefer using NgModules, import the HubBreadcrumbModule:

```typescript
import { HubBreadcrumbModule } from 'ng-hub-ui-breadcrumbs';

@NgModule({
  imports: [HubBreadcrumbModule]
})
export class AppModule { }
```

### Route Configuration

Configure your routes with breadcrumb data:

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
	path: '',
	data: { breadcrumb: 'Home' }
  },
  {
	path: 'products',
	data: { breadcrumb: 'Products' },
	children: [
	  {
		path: ':id',
		resolve: {
		  resolvedData: ProductResolver
		},
		data: { 
		  breadcrumb: '{name}' // Will use the product name from resolver
		}
	  }
	]
  }
];
```

### Add to Template

Add the component to your template:

```html
<hub-breadcrumbs></hub-breadcrumbs>
```

<!-- ### Dynamic Labels

You can use resolved data in your breadcrumb labels:

```typescript
const routes: Routes = [
  {
	path: 'product/:id',
	resolve: {
	  resolvedData: ProductResolver
	},
	data: { 
	  breadcrumb: '{name}' // Will be replaced with resolvedData.name
	}
  }
];
``` -->

### Function Labels

You can also use functions to generate dynamic labels:

```typescript
const routes: Routes = [
  {
	path: 'products',
	resolve: { info: infoResolver },
	data: { breadcrumb: (data: any) => `${data.info.title}` },
  }
];
```

### Component Features

The breadcrumb component automatically:
- Listens to route changes
- Extracts breadcrumb data from route configuration
- Builds the breadcrumb path
- Handles template customization
- Supports RTL languages

### Working with Lazy Loading

For lazy-loaded modules, configure the parent route with breadcrumb data:

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
	path: 'admin',
	data: { breadcrumb: 'Administration' },
	loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
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

## Custom Template

You can customize how each breadcrumb item is rendered using a template.

### Basic Template

```html
<hub-breadcrumbs>
  <ng-template hubBreadcrumbItem let-item let-isLast="isLast">
	@if (!isLast) {
	  <a [routerLink]="item.url" class="hub-breadcrumb__link">
		{{ item.label }}
	  </a>
	} @else {
	  <span class="hub-breadcrumb__text">{{ item.label }}</span>
	}
  </ng-template>
</hub-breadcrumbs>
```

### Template Context

The template context provides these properties:

```typescript
interface BreadcrumbTemplateContext {
  $implicit: BreadcrumbItem;  // The current breadcrumb item
  isLast: boolean;           // Whether this is the last item
}

interface BreadcrumbItem {
  label: string;    // The text to display
  url: string;      // The route URL
  data: any;        // Additional data from route configuration
}
```

### Examples

With icons:
```html
<hub-breadcrumbs>
  <ng-template hubBreadcrumbItem let-item let-isLast="isLast">
	@if (!isLast) {
	  <a [routerLink]="item.url" class="hub-breadcrumb__link">
		<i [class]="item.data?.icon"></i>
		{{ item.label }}
	  </a>
	} @else {
	  <span class="hub-breadcrumb__text">
		<i [class]="item.data?.icon"></i>
		{{ item.label }}
	  </span>
	}
  </ng-template>
</hub-breadcrumbs>
```

Route configuration for icons:
```typescript
const routes: Routes = [
  {
	path: 'products',
	data: {
	  breadcrumb: 'Products',
	  icon: 'fa fa-box'  // Will be available in template
	}
  }
];
```

With custom separators:
```html
<hub-breadcrumbs>
  <ng-template hubBreadcrumbItem let-item let-isLast="isLast">
	@if (!isLast) {
	  <a [routerLink]="item.url" class="hub-breadcrumb__link">
		{{ item.label }}
	  </a>
	  <span class="hub-breadcrumb__separator">→</span>
	} @else {
	  <span class="hub-breadcrumb__text">{{ item.label }}</span>
	}
  </ng-template>
</hub-breadcrumbs>
```

Note: When using a custom template, you're responsible for:
- Handling the navigation with `routerLink`
- Managing active/inactive states
- Applying appropriate styles
- Handling RTL if needed

## Styling

The breadcrumb component uses CSS variables for styling, making it highly customizable. It's designed to work with or without Bootstrap.

### Default SCSS Variables

These SCSS variables set the default values:

```scss
$border-radius-pill: 50rem !default;
$secondary-color: black !default;
$breadcrumb-font-size: null !default;
$breadcrumb-padding-y: 0.25rem !default;
$breadcrumb-padding-x: 1rem !default;
$breadcrumb-item-padding-x: 0.5rem !default;
$breadcrumb-margin-bottom: 0 !default;
$breadcrumb-bg: white !default;
$breadcrumb-divider-color: $secondary-color !default;
$breadcrumb-active-color: $secondary-color !default;
$breadcrumb-divider: quote('>') !default;
$breadcrumb-divider-flipped: $breadcrumb-divider !default;
$breadcrumb-border-radius: $border-radius-pill !default;
```

### CSS Variables

These variables are exposed for runtime customization:

```css
.hub-breadcrumb__list {
  --hub-breadcrumb-padding-x: 1rem;
  --hub-breadcrumb-padding-y: 0.25rem;
  --hub-breadcrumb-margin-bottom: 0;
  --hub-breadcrumb-bg: white;
  --hub-breadcrumb-border-radius: 50rem;
  --hub-breadcrumb-divider-color: black;
  --hub-breadcrumb-item-padding-x: 0.5rem;
  --hub-breadcrumb-item-active-color: black;
}
```

### Customizing Styles

1. Override SCSS variables (compile-time):
```scss
// your-styles.scss
$breadcrumb-bg: #f8f9fa;
$breadcrumb-divider: quote('→');
$breadcrumb-active-color: #6c757d;
```

2. Override CSS variables (runtime):
```css
.hub-breadcrumb__list {
  --hub-breadcrumb-bg: #f8f9fa;
  --hub-breadcrumb-divider-color: #6c757d;
}
```

3. Override classes directly:
```scss
.hub-breadcrumb__item {
  &--active {
	font-weight: bold;
  }
}
```

### RTL Support

The component automatically handles RTL languages by flipping the divider. You can customize the flipped divider using:

```scss
$breadcrumb-divider-flipped: quote('<');
```

### Class Structure

The component uses BEM methodology:
- `.hub-breadcrumb` - Block (host component)
- `.hub-breadcrumb__list` - Element (container)
- `.hub-breadcrumb__item` - Element (each breadcrumb)
- `.hub-breadcrumb__item--active` - Modifier (active state)

### Integration with Bootstrap

While the component works independently, it's designed to be compatible with Bootstrap's breadcrumb styles. If you're using Bootstrap, the styles will automatically align with your Bootstrap theme.

### Inline Style Customization

You can customize the breadcrumb directly in your template using inline styles:

```html
<hub-breadcrumbs style="
  --hub-breadcrumb-divider: '🐸';
  --hub-breadcrumb-bg: #e9ecef;
  --hub-breadcrumb-item-active-color: #0d6efd;
"></hub-breadcrumbs>
```

Common use cases:

1. Custom divider:
```html
<hub-breadcrumbs style="--hub-breadcrumb-divider: '→'"></hub-breadcrumbs>
<hub-breadcrumbs style="--hub-breadcrumb-divider: '>'"></hub-breadcrumbs>
<hub-breadcrumbs style="--hub-breadcrumb-divider: '/'"></hub-breadcrumbs>
<hub-breadcrumbs style="--hub-breadcrumb-divider: '🐸'"></hub-breadcrumbs>
```

2. Custom colors:
```html
<hub-breadcrumbs style="
  --hub-breadcrumb-bg: transparent;
  --hub-breadcrumb-divider-color: #6c757d;
  --hub-breadcrumb-item-active-color: #0d6efd;
"></hub-breadcrumbs>
```

3. Custom spacing:
```html
<hub-breadcrumbs style="
  --hub-breadcrumb-padding-x: 0;
  --hub-breadcrumb-padding-y: 0;
  --hub-breadcrumb-item-padding-x: 1rem;
"></hub-breadcrumbs>
```

Note: When using emojis or special characters as dividers, make sure to wrap them in quotes.

## API

### Components

#### HubBreadcrumbComponent
```typescript
@Component({
  selector: 'hub-breadcrumb',
  standalone: true
})
```

A standalone component that automatically generates breadcrumbs from route configuration.

### Directives

#### HubBreadcrumbItemDirective
```typescript
@Directive({
  selector: '[hubBreadcrumbItem]',
  standalone: true
})
```

Template directive for customizing breadcrumb item rendering.

### Interfaces

#### BreadcrumbItem
```typescript
interface BreadcrumbItem {
  label: string;    // Display text
  url: string;      // Navigation URL
  data: any;        // Additional data from route configuration
}
```

#### BreadcrumbTemplateContext
```typescript
interface BreadcrumbTemplateContext {
  $implicit: BreadcrumbItem;  // Current breadcrumb item
  isLast: boolean;            // Whether this is the last item
}
```

### Route Configuration

The component reads breadcrumb configuration from route data:

```typescript
interface BreadcrumbRouteData {
  breadcrumb: string | ((data: any) => string);  // Static text or function
  icon?: string;                                 // Optional icon class
  [key: string]: any;                           // Additional custom data
}
```

### CSS Custom Properties

| Property | Description | Default |
|----------|-------------|---------|
| `--hub-breadcrumb-padding-x` | Horizontal padding | `1rem` |
| `--hub-breadcrumb-padding-y` | Vertical padding | `0.25rem` |
| `--hub-breadcrumb-margin-bottom` | Bottom margin | `0` |
| `--hub-breadcrumb-bg` | Background color | `white` |
| `--hub-breadcrumb-border-radius` | Border radius | `50rem` |
| `--hub-breadcrumb-divider-color` | Divider color | `black` |
| `--hub-breadcrumb-item-padding-x` | Item spacing | `0.5rem` |
| `--hub-breadcrumb-item-active-color` | Active item color | `black` |

### SCSS Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `$breadcrumb-padding-y` | Vertical padding | `0.25rem` |
| `$breadcrumb-padding-x` | Horizontal padding | `1rem` |
| `$breadcrumb-margin-bottom` | Bottom margin | `0` |
| `$breadcrumb-bg` | Background color | `white` |
| `$breadcrumb-divider` | Divider character | `'>'` |
| `$breadcrumb-divider-flipped` | RTL divider character | Same as `$breadcrumb-divider` |
| `$breadcrumb-border-radius` | Border radius | `50rem` |
| `$breadcrumb-active-color` | Active item color | `black` |


## Contributing

We appreciate your interest in contributing to Hub Breadcrumb! Here's how you can help:

### Development Setup

1. Clone the repository
```bash
git clone https://github.com/carlos-morcillo/ng-hub-ui-breadcrumbs.git
cd ng-hub-ui-breadcrumbs
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
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

### Project Structure

```
ng-hub-ui-breadcrumbs/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── hub-breadcrumb.component.ts
│   │   │   ├── hub-breadcrumb.component.spec.ts
│   │   │   └── hub-breadcrumb.component.scss
│   │   ├── directives/
│   │   │   └── hub-breadcrumb-item.directive.ts
│   │   ├── services/
│   │   │   └── hub-breadcrumb.service.ts
│   │   └── interfaces/
│   │       └── breadcrumb-item.ts
│   └── public-api.ts
├── README.md
└── package.json
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

### Pull Request Process

1. Fork the repository
2. Create a new branch:
```bash
git checkout -b feat/my-new-feature
```
3. Make your changes
4. Add tests for any new functionality
5. Update documentation if needed
6. Submit a Pull Request

### Development Guidelines

- Write unit tests for new features
- Follow Angular style guide
- Update documentation for API changes
- Maintain backward compatibility
- Add comments for complex logic

### Issues

Before creating an issue, please:

- Check existing issues
- Use the issue template
- Include reproduction steps
- Specify your environment

### Code Style

We follow the [Angular Style Guide](https://angular.io/guide/styleguide):

- Use TypeScript
- Follow BEM for CSS
- Maintain consistent naming
- Add JSDoc comments

## Support the Project

If you find this project helpful and would like to support its development, you can buy me a coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/carlosmorcillo)

Your support is greatly appreciated and helps maintain and improve this project!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Carlos Morcillo Fernández]


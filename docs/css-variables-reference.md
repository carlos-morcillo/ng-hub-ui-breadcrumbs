# ng-hub-ui-breadcrumbs - CSS Variables Reference

Complete reference of all CSS custom properties exposed by `ng-hub-ui-breadcrumbs`.
Use these variables to customize visual behavior without editing component source code.

---

## Table of Contents

- [How it Works](#how-it-works)
- [Importing Styles](#importing-styles)
- [Base System Fallbacks](#base-system-fallbacks)
- [Breadcrumbs Variables](#breadcrumbs-variables)
- [Customization Examples](#customization-examples)
- [Best Practices](#best-practices)

---

## How it Works

The breadcrumbs component uses a token fallback chain:

```text
component token -> sys token -> ref token -> literal fallback
```

This allows:

- consistent theming across components,
- safe defaults when global tokens are not provided,
- runtime customization through CSS variables.

---

## Importing Styles

Add breadcrumbs styles to your global stylesheet:

```scss
@use 'ng-hub-ui-breadcrumbs/src/lib/styles/breadcrumbs.scss';
```

---

## Base System Fallbacks

`ng-hub-ui-breadcrumbs` defines and/or consumes these base tokens:

| Variable | Default |
|---|---|
| `--hub-ref-space-0` | `0` |
| `--hub-ref-space-1` | `0.5rem` |
| `--hub-ref-space-3` | `1rem` |
| `--hub-ref-radius-md` | `0.375rem` |
| `--hub-sys-surface-page` | `transparent` |
| `--hub-sys-text-primary` | `#212529` |
| `--hub-sys-text-muted` | `#6c757d` |
| `--hub-sys-link-color` | `#0d6efd` |
| `--hub-sys-link-hover-color` | `#0a58ca` |

---

## Breadcrumbs Variables

Defined and consumed by `projects/breadcrumbs/src/lib/styles/breadcrumbs.scss`.

### Core

| Variable | Default |
|---|---|
| `--hub-breadcrumb-padding-x` | `var(--hub-ref-space-3, 1rem)` |
| `--hub-breadcrumb-padding-y` | `0.25rem` |
| `--hub-breadcrumb-margin-bottom` | `var(--hub-ref-space-0, 0)` |
| `--hub-breadcrumb-bg` | `var(--hub-sys-surface-page, transparent)` |
| `--hub-breadcrumb-color` | `var(--hub-sys-text-primary, #212529)` |
| `--hub-breadcrumb-border-radius` | `var(--hub-ref-radius-md, 0.375rem)` |
| `--hub-breadcrumb-item-padding-x` | `var(--hub-ref-space-1, 0.5rem)` |

### Divider

| Variable | Default |
|---|---|
| `--hub-breadcrumb-divider` | `'>'` |
| `--hub-breadcrumb-divider-flipped` | `'<'` |
| `--hub-breadcrumb-divider-color` | `var(--hub-sys-text-muted, #6c757d)` |

### States and Links

| Variable | Default |
|---|---|
| `--hub-breadcrumb-item-active-color` | `var(--hub-sys-text-muted, #6c757d)` |
| `--hub-breadcrumb-link-color` | `var(--hub-sys-link-color, #0d6efd)` |
| `--hub-breadcrumb-link-hover-color` | `var(--hub-sys-link-hover-color, #0a58ca)` |
| `--hub-breadcrumb-link-decoration` | `none` |
| `--hub-breadcrumb-link-hover-decoration` | `underline` |

---

## Customization Examples

### Framework-Agnostic

```scss
.hub-breadcrumbs__list {
  --hub-breadcrumb-bg: #f8f9fa;
  --hub-breadcrumb-divider: '→';
  --hub-breadcrumb-link-color: #0d6efd;
  --hub-breadcrumb-link-hover-color: #084298;
  --hub-breadcrumb-item-active-color: #6c757d;
}
```

### Bootstrap Integration (Optional)

```scss
.hub-breadcrumbs__list {
  --hub-breadcrumb-bg: var(--bs-light);
  --hub-breadcrumb-link-color: var(--bs-primary);
  --hub-breadcrumb-link-hover-color: var(--bs-primary-text-emphasis);
  --hub-breadcrumb-item-active-color: var(--bs-secondary-color);
}
```

### Dark Surface

```scss
.app-theme-dark .hub-breadcrumbs__list {
  --hub-breadcrumb-bg: #212529;
  --hub-breadcrumb-color: #f8f9fa;
  --hub-breadcrumb-divider-color: #adb5bd;
  --hub-breadcrumb-link-color: #6ea8fe;
  --hub-breadcrumb-link-hover-color: #9ec5fe;
  --hub-breadcrumb-item-active-color: #adb5bd;
}
```

---

## Best Practices

- Prefer overriding component tokens (`--hub-breadcrumb-*`) instead of hardcoded selectors.
- Override `--hub-sys-*` tokens for global consistency across multiple components.
- Keep divider tokens quoted (`'>'`, `'/'`, `'→'`) so `content` renders correctly.
- Keep Bootstrap usage optional and explicit in integration examples.

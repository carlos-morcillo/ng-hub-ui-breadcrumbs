# ng-hub-ui-breadcrumbs

**Español** | [English](./README.md)

![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-breadcrumbs)
![License](https://img.shields.io/npm/l/ng-hub-ui-breadcrumbs)

Un componente de breadcrumbs flexible y reutilizable para aplicaciones Angular que genera las migas de pan automáticamente a partir de la configuración de rutas.

## Documentación y ejemplos en vivo

Este paquete forma parte de [Hub UI](https://hubui.dev/), una colección de bibliotecas de componentes Angular para aplicaciones standalone.

- Documentación: https://hubui.dev/breadcrumbs/overview/
- Ejemplos en vivo: https://hubui.dev/breadcrumbs/examples/
- Hub UI: https://hubui.dev/

## 🧩 Familia de bibliotecas `ng-hub-ui`

Esta biblioteca forma parte del ecosistema **ng-hub-ui**:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) (obsoleta — usa ng-hub-ui-panels)
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs) ← Estás aquí
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

## Tabla de contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Instalación](#instalación)
- [Inicio rápido](#inicio-rápido)
- [Uso](#uso)
- [Referencia de la API](#referencia-de-la-api)
- [Estilos](#estilos)
- [Changelog](#changelog)
- [Contribución](#contribución)
- [Soporte](#soporte)
- [Licencia](#licencia)

## Descripción

`ng-hub-ui-breadcrumbs` es un componente de breadcrumbs ligero y totalmente reactivo para aplicaciones Angular standalone. En lugar de mantener manualmente las rutas de navegación, la biblioteca se suscribe al `Router` de Angular y reconstruye la lista de breadcrumbs automáticamente en cada navegación, leyendo una entrada `breadcrumb` de la propiedad `data` de cada ruta.

Admite etiquetas estáticas, etiquetas dinámicas resueltas a partir de los datos de la ruta (mediante funciones o interpolación `{key}`), rutas con carga diferida (lazy loading) y personalización completa de la plantilla mediante una directiva estructural. Los estilos se gestionan íntegramente con propiedades personalizadas CSS, de modo que el componente se adapta a cualquier sistema de diseño o tema de Bootstrap sin sobrescribir el marcado interno.

## Características

- **Generación automática de breadcrumbs**: construye las migas de pan automáticamente a partir de la configuración de `Routes` de Angular.
- **Etiquetas dinámicas**: admite etiquetas dinámicas mediante funciones o interpolación de cadenas usando datos resueltos.
- **Plantillas personalizadas**: control total sobre cómo se renderiza cada elemento mediante una directiva estructural.
- **Soporte RTL**: incluye un token de separador invertido (`--hub-breadcrumb-divider-flipped`) para diseños de derecha a izquierda.
- **Compatible con lazy loading**: funciona sin problemas con rutas cargadas de forma diferida.
- **Sin importación manual de estilos**: los estilos están incluidos en el componente, no se requiere una importación SCSS aparte.

## Instalación

```bash
npm install ng-hub-ui-breadcrumbs
```

## Inicio rápido

Ponlo en marcha en menos de cinco minutos.

### 1. Instala

```bash
npm install ng-hub-ui-breadcrumbs
```

### 2. Importa el componente

```typescript
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';

@Component({
	// ...
	imports: [HubBreadcrumbComponent]
})
export class AppComponent {}
```

### 3. Añade datos de breadcrumb a tus rutas

```typescript
const routes: Routes = [
	{ path: '', data: { breadcrumb: 'Inicio' } },
	{ path: 'products', data: { breadcrumb: 'Productos' } }
];
```

### 4. Coloca el componente en tu layout

```html
<hub-breadcrumb></hub-breadcrumb>
```

**💡 ¡Listo!** La ruta de breadcrumbs se actualiza automáticamente a medida que el usuario navega.

## Uso

### 1. Importa el componente

Puedes importar `HubBreadcrumbComponent` directamente en tu componente standalone, o usar `HubBreadcrumbsModule` en una configuración basada en módulos.

```typescript
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';

@Component({
	// ...
	imports: [HubBreadcrumbComponent]
})
export class AppComponent {}
```

### 2. Añádelo a la plantilla

Coloca el componente en el layout principal de tu aplicación o donde quieras que aparezcan los breadcrumbs.

```html
<hub-breadcrumb></hub-breadcrumb>
```

### 3. Configura las rutas

La parte más importante es añadir `data: { breadcrumb: '...' }` a tus rutas.

```typescript
const routes: Routes = [
	{
		path: '',
		data: { breadcrumb: 'Inicio' } // Etiqueta estática estándar
	},
	{
		path: 'products',
		data: { breadcrumb: 'Productos' },
		children: [
			// ... rutas hijas
		]
	}
];
```

### 4. Trabajar con lazy loading

Para rutas con carga diferida, configura la ruta padre con datos de breadcrumb:

```typescript
// app.routes.ts
const routes: Routes = [
	{
		path: 'admin',
		data: { breadcrumb: 'Administración' },
		loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES)
	}
];

// admin.routes.ts
const adminRoutes: Routes = [
	{
		path: 'users',
		data: { breadcrumb: 'Usuarios' }
	}
];
```

Esto generará breadcrumbs como: Inicio > Administración > Usuarios

### Etiquetas dinámicas con funciones

Puedes usar una función para generar la etiqueta del breadcrumb de forma dinámica a partir de los datos de la ruta. La función recibe el `data` resuelto de la ruta.

```typescript
const routes: Routes = [
	{
		path: 'dashboard',
		resolve: { userInfo: UserResolver },
		data: {
			breadcrumb: (data: any) => `Usuario: ${data.userInfo.name}` // La función crea la etiqueta a partir de los datos resueltos
		}
	}
];
```

### Etiquetas dinámicas con interpolación

Como alternativa, puedes usar interpolación de cadenas `{key}` si tus datos están bajo una propiedad `resolvedData`.

```typescript
const routes: Routes = [
	{
		path: 'product/:id',
		resolve: {
			resolvedData: ProductResolver // Debe llamarse 'resolvedData' para la interpolación
		},
		data: {
			breadcrumb: 'Producto: {name}' // Reemplaza {name} por resolvedData.name
		}
	}
];
```

### Iconos personalizados

Puedes adjuntar datos arbitrarios (como iconos) a la configuración de la ruta y usarlos en una plantilla personalizada mediante la directiva `hubBreadcrumbItem`.

```typescript
// Configuración de la ruta
{
	path: 'settings',
	data: {
		breadcrumb: 'Ajustes',
		icon: 'fa fa-cog' // Propiedad de datos personalizada
	}
}
```

```html
<!-- Implementación de plantilla personalizada -->
<hub-breadcrumb>
	<ng-template hubBreadcrumbItem let-item let-isLast="isLast">
		<!-- 'item.data' contiene todo el objeto data de la ruta -->
		@if (item.data.icon) {
		<i [class]="item.data.icon"></i>
		}
		<a [routerLink]="item.url">{{ item.label }}</a>
	</ng-template>
</hub-breadcrumb>
```

### Plantilla personalizada y separadores

Personaliza completamente la estructura, incluidos los separadores/divisores.

```html
<hub-breadcrumb>
	<ng-template hubBreadcrumbItem let-item let-isLast="isLast">
		<span class="my-breadcrumb-item">
			<a [routerLink]="item.url">{{ item.label }}</a>
		</span>
		<!-- Separador personalizado -->
		@if (!isLast) {
		<span class="separator"> / </span>
		}
	</ng-template>
</hub-breadcrumb>
```

## Referencia de la API

### HubBreadcrumbComponent

El componente contenedor principal. Lee la ruta de breadcrumbs directamente del `Router` de Angular y expone un único input opcional para tematizar los enlaces.

| Selector         | Clase del host    |
| ---------------- | ----------------- |
| `hub-breadcrumb` | `.hub-breadcrumb` |

#### Inputs

| Input     | Tipo     | Por defecto | Descripción                                                                                                                                                                                                                                                                                                                                       |
| --------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant` | `string` | `undefined` | Selecciona un **acento semántico** para los enlaces del breadcrumb y su hover. Los valores integrados (`primary`, `success`, `danger`, `warning`, `info`) mapean a los tintes exactos del sistema de diseño; **también se acepta cualquier otra cadena**, que se resuelve a través de `--hub-sys-color-<variant>`. El elemento actual (el último) permanece siempre atenuado. Si se omite, los enlaces usan el color de enlace estándar (sin cambio visual). |

```html
<!-- Acento semántico integrado -->
<hub-breadcrumb variant="success"></hub-breadcrumb>

<!-- Acento personalizado — se resuelve a var(--hub-sys-color-brand) -->
<hub-breadcrumb variant="brand"></hub-breadcrumb>
```

Proyecta una única plantilla de contenido opcional mediante la directiva `hubBreadcrumbItem` (leída a través de `contentChild`). Cuando no se proporciona ninguna plantilla, el componente renderiza una lista de breadcrumbs por defecto.

### HubBreadcrumbItemDirective

Una directiva estructural que se usa para definir una plantilla personalizada para los elementos del breadcrumb.

| Selector              | Tipo de contexto            |
| --------------------- | --------------------------- |
| `[hubBreadcrumbItem]` | `BreadcrumbTemplateContext` |

### HubBreadcrumbsService

Un servicio inyectable (`providedIn: 'root'`) que expone el flujo reactivo de breadcrumbs. El componente lo usa internamente; también puedes inyectarlo directamente cuando necesites los datos de breadcrumb en otro lugar.

| Miembro         | Tipo                           | Descripción                                                                       |
| --------------- | ------------------------------ | --------------------------------------------------------------------------------- |
| `breadcrumbs$`  | `Observable<BreadcrumbItem[]>` | Emite la ruta de breadcrumbs actual en cada `NavigationEnd` (y al iniciarse).     |

### HubBreadcrumbsModule

Un `NgModule` opcional que importa y exporta `HubBreadcrumbComponent` y `HubBreadcrumbItemDirective` para aplicaciones basadas en módulos.

### Interfaces

#### BreadcrumbItem

| Propiedad | Tipo     | Descripción                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| `label`   | `string` | El texto resuelto que se muestra para el breadcrumb.             |
| `url`     | `string` | La ruta URL completa a la que navegar.                           |
| `data`    | `any`    | El objeto data original de la ruta (útil para iconos, etc.).     |

#### BreadcrumbTemplateContext

| Propiedad   | Tipo             | Descripción                                                            |
| ----------- | ---------------- | ---------------------------------------------------------------------- |
| `$implicit` | `BreadcrumbItem` | El objeto del elemento actual (enlazado mediante `let-item`).          |
| `isLast`    | `boolean`        | `true` si este elemento es el último de la lista (página actual).      |

## Estilos

`ng-hub-ui-breadcrumbs` es totalmente configurable mediante propiedades personalizadas CSS. Los estilos están incluidos en el componente, por lo que no se requiere ninguna importación manual.

Para un catálogo completo y actualizado de tokens, consulta la [Referencia de variables CSS](./docs/css-variables-reference.md).

### Ejemplo de personalización rápida (agnóstico de framework)

```scss
.hub-breadcrumb__list {
	--hub-breadcrumb-bg: #f8f9fa;
	--hub-breadcrumb-divider: '→';
	--hub-breadcrumb-link-color: #0d6efd;
	--hub-breadcrumb-item-active-color: #6c757d;
}
```

### Token de acento semántico

El color del enlace sigue al token `--hub-breadcrumb-accent` (que a su vez toma por defecto el color de enlace estándar). Al definir un `variant` se re-basa este token; también puedes sobrescribirlo directamente:

```scss
.hub-breadcrumb {
	--hub-breadcrumb-accent: var(--hub-sys-color-info);
}
```

### Integración con Bootstrap (opcional)

```scss
.hub-breadcrumb__list {
	--hub-breadcrumb-bg: var(--bs-light);
	--hub-breadcrumb-link-color: var(--bs-primary);
	--hub-breadcrumb-link-hover-color: var(--bs-primary-text-emphasis);
	--hub-breadcrumb-item-active-color: var(--bs-secondary-color);
}
```

### Tematización con el mixin Sass `hub-breadcrumb-theme()`

Para un tema en una sola llamada que ajuste la superficie, el espaciado, el separador, el color del elemento actual, los enlaces y el acento, usa el mixin `hub-breadcrumb-theme()`. Cada parámetro es opcional y vale `null` por defecto, de modo que solo se emiten como sobrescrituras `--hub-breadcrumb-*` los que pases. Está basado en tokens y no depende de Bootstrap.

```scss
@use 'ng-hub-ui-breadcrumbs/styles/mixins/breadcrumb-theme' as *;

.docs-breadcrumb {
	@include hub-breadcrumb-theme(
		$bg: #f8fafc,
		$padding-x: 0.75rem,
		$divider: "'/'", // mantén las comillas interiores — alimenta `content` de CSS
		$accent: var(--hub-sys-color-info)
	);
}
```

## Changelog

Todos los cambios relevantes están documentados en el [CHANGELOG.md](./CHANGELOG.md). Para los cambios incompatibles, consulta [BREAKING_CHANGES.md](./BREAKING_CHANGES.md).

La última versión es la **v21.1.0**, que renombró el selector de `hub-breadcrumbs` a `hub-breadcrumb` e incluyó los estilos dentro del componente (ya no se requieren importaciones manuales de estilos).

## Contribución

¡Agradecemos tu interés en contribuir a Hub Breadcrumb! Así puedes ayudar:

### Configuración del entorno de desarrollo

1.  **Clona el repositorio**

    ```bash
    git clone https://github.com/carlos-morcillo/ng-hub-ui-breadcrumbs.git
    cd ng-hub-ui-breadcrumbs
    ```

2.  **Instala las dependencias**

    ```bash
    npm install
    ```

3.  **Arranca el servidor de desarrollo**

    ```bash
    npm start
    ```

### Convenciones de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nuevas funcionalidades
- `fix:` Correcciones de errores
- `docs:` Cambios en la documentación
- `style:` Cambios de estilo de código (formato, etc.)
- `refactor:` Refactorizaciones de código
- `test:` Añadir o actualizar tests
- `chore:` Tareas de mantenimiento

Ejemplo:

```bash
git commit -m "feat: add custom divider support"
```

## Soporte

Si este proyecto te resulta útil y quieres apoyar su desarrollo, puedes invitarme a un café:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

¡Tu apoyo es muy apreciado y ayuda a mantener y mejorar este proyecto!

Para errores y peticiones de funcionalidades, abre una incidencia en https://github.com/carlos-morcillo/ng-hub-ui-breadcrumbs/issues.

## Licencia

Este proyecto está licenciado bajo la licencia MIT; consulta el archivo [LICENSE](LICENSE) para más detalles.

---

Hecho con ❤️ por [Carlos Morcillo Fernández](https://www.carlosmorcillo.com)

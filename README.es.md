# ng-hub-ui-breadcrumbs

**Español** | [English](./README.md)

![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-breadcrumbs)
![License](https://img.shields.io/npm/l/ng-hub-ui-breadcrumbs)

Un componente de breadcrumbs flexible y reutilizable para aplicaciones Angular que genera las migas de pan automáticamente a partir de la configuración de rutas.

## Documentación y ejemplos en vivo

Este paquete forma parte de [Hub UI](https://hubui.dev/en/), una colección de bibliotecas de componentes Angular para aplicaciones standalone.

- Documentación: https://hubui.dev/en/breadcrumbs/overview/
- Ejemplos en vivo: https://hubui.dev/en/breadcrumbs/examples/
- Hub UI: https://hubui.dev/en/

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
- **Truncado + tooltip (opt-in)**: activa `truncateItems` para recortar etiquetas largas con puntos suspensivos (acotado por `--hub-breadcrumb-max-item-width`) y mostrar el texto completo al pasar el ratón — el `title` nativo por defecto, o el tooltip de hub-ui si se cablea (ver abajo).
- **Colapso de rutas largas**: `maxItems` pliega el centro tras un botón `…` que expande la ruta en el sitio, conservando `itemsBeforeCollapse` / `itemsAfterCollapse` migas a cada lado.
- **Destinos fuera del router**: una miga puede llevar `href`, `target`, `rel` y `download` y renderizarse como enlace simple — para ancestros servidos fuera de la aplicación Angular, o un archivo descargable.
- **Anillo de foco de teclado**: los enlaces y el indicador colapsado toman el anillo de foco del sistema de diseño, retintable mediante `--hub-breadcrumb-focus-*`.
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

Importa `HubBreadcrumbComponent` directamente en tu componente. (`HubBreadcrumbsModule` sigue funcionando en una configuración basada en módulos, pero está obsoleto: consulta [HubBreadcrumbsModule](#hubbreadcrumbsmodule).)

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

El componente contenedor principal. Lee la ruta de breadcrumbs directamente del `Router` de Angular —o la toma de `items` cuando le pasas una— y expone siete inputs, un output y una plantilla de elemento opcional.

| Selector         | Clase del host    |
| ---------------- | ----------------- |
| `hub-breadcrumb` | `.hub-breadcrumb` |

#### Inputs

| Input                 | Tipo                       | Por defecto                          | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------- | -------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`             | `string`                   | `undefined`                          | Selecciona un **acento semántico** para los enlaces del breadcrumb y su hover. Los valores integrados (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `neutral`, `light`, `dark`) mapean a los tintes exactos del sistema de diseño; **también se acepta cualquier otra cadena**, que se resuelve a través de `--hub-sys-color-<variant>`. El elemento actual (el último) permanece siempre atenuado. Si se omite, los enlaces usan el color de enlace estándar (sin cambio visual).                  |
| `truncateItems`       | `boolean`                  | `false`                              | Si es `true`, recorta cada etiqueta a `--hub-breadcrumb-max-item-width` (por defecto `12rem`) con puntos suspensivos y muestra el texto completo como tooltip cuando una etiqueta desborda. Desactivado por defecto, así el layout estándar no cambia. También alcanza a una plantilla `hubBreadcrumbItem`: el componente dibuja la caja de recorte (`span.hub-breadcrumb__custom`) alrededor del contenido proyectado, porque los estilos encapsulados no llegan a elementos que pertenecen al componente consumidor. |
| `items`               | `BreadcrumbItem[] \| null` | `null`                               | Ruta proporcionada por ti, que sustituye a la derivada del router. Es la vía para las migas que el árbol de rutas no puede expresar: un ancestro servido por otra aplicación, o una ruta compuesta a mano. Si se deja en `null`, el componente sigue leyendo `HubBreadcrumbsService`.                                                                                                                                                                                                                                  |
| `maxItems`            | `number \| undefined`      | `undefined`                          | Longitud a partir de la cual la ruta se colapsa tras un indicador. `undefined` no colapsa nunca, por larga que sea la ruta.                                                                                                                                                                                                                                                                                                                                                                                            |
| `itemsBeforeCollapse` | `number`                   | `1`                                  | Migas que se conservan al principio de una ruta colapsada.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `itemsAfterCollapse`  | `number`                   | `1`                                  | Migas que se conservan al final de una ruta colapsada, incluida la página actual.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `collapsedAriaLabel`  | `string`                   | `'Show the hidden breadcrumb items'` | Nombre accesible del indicador colapsado. Es un input porque es la única cadena que anuncia este componente, y la librería no incluye traducciones propias.                                                                                                                                                                                                                                                                                                                                                            |

#### Outputs

| Output           | Tipo   | Descripción                                                                                                                                                                                                   |
| ---------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `collapsedClick` | `void` | Se emite al activar el indicador colapsado. La ruta se expande por sí sola; el evento existe para consumidores que además quieran reaccionar — abrir un menú con las migas ocultas, registrar la interacción. |

```html
<!-- Acento semántico integrado -->
<hub-breadcrumb variant="success"></hub-breadcrumb>

<!-- Acento personalizado — se resuelve a var(--hub-sys-color-brand) -->
<hub-breadcrumb variant="brand"></hub-breadcrumb>

<!-- Recorta etiquetas largas y muestra el texto completo al pasar el ratón -->
<hub-breadcrumb [truncateItems]="true"></hub-breadcrumb>

<!-- Pliega una ruta profunda: primera miga, indicador, última miga -->
<hub-breadcrumb [maxItems]="4"></hub-breadcrumb>

<!-- Conserva dos ancestros y las dos últimas migas -->
<hub-breadcrumb [maxItems]="4" [itemsBeforeCollapse]="2" [itemsAfterCollapse]="2"></hub-breadcrumb>
```

#### Colapso de rutas largas

Por encima de `maxItems` migas, el centro se pliega tras un botón `…`. El botón
recibe el foco de teclado, se anuncia con `collapsedAriaLabel`, abre la ruta en el
sitio y emite `collapsedClick`. Al expandirse el botón desaparece, así que el foco
pasa a la primera miga revelada en vez de caer en el cuerpo de la página. Una
expansión responde a una ruta concreta: la siguiente navegación vuelve a colapsarla.

#### Migas que salen de la aplicación

Una miga con `href` se renderiza como enlace simple en lugar de `routerLink`, con
`target`, `rel` y `download` pasados tal cual. Una miga con `target="_blank"` y sin
`rel` propio recibe `rel="noopener noreferrer"`, para que el destino no herede un
control sobre la ventana que lo abrió.

Se declara en la propia ruta:

```ts
{
  path: 'invoices',
  component: InvoicesComponent,
  data: {
    breadcrumb: { label: 'Invoices', href: 'https://legacy.example.com/invoices', target: '_blank' }
  }
}
```

…o se entrega la ruta completa, cuando el árbol de rutas no puede expresarla:

```ts
readonly trail: BreadcrumbItem[] = [
  { label: 'Example.com', url: '/', href: 'https://example.com', target: '_blank' },
  { label: 'Handbook', url: '/handbook', href: '/assets/handbook.pdf', download: 'handbook.pdf' },
  { label: 'Docs', url: '/docs' },
  { label: 'Breadcrumbs', url: '/docs/breadcrumbs' }
];
```

```html
<hub-breadcrumb [items]="trail"></hub-breadcrumb>
```

La última miga nunca es un enlace, declare lo que declare: es la página actual.

#### Tooltip en etiquetas truncadas (opcional)

Con `truncateItems` activo, una etiqueta recortada muestra su texto completo al
pasar el ratón. Por defecto usa el atributo `title` nativo (cero dependencias).
Para subir cada etiqueta truncada al tooltip de hub-ui (temable), provee un
adapter una vez — p.ej. el de `ng-hub-ui-utils`:

```ts
import { provideHubBreadcrumbTooltip } from 'ng-hub-ui-breadcrumbs';
import { hubTooltipAdapter } from 'ng-hub-ui-utils';

export const appConfig: ApplicationConfig = {
	providers: [provideHubBreadcrumbTooltip(hubTooltipAdapter)]
};
```

Quita el provider y los breadcrumbs vuelven al tooltip nativo.

Proyecta una única plantilla de contenido opcional mediante la directiva `hubBreadcrumbItem` (leída a través de `contentChild`). Cuando no se proporciona ninguna plantilla, el componente renderiza una lista de breadcrumbs por defecto.

### HubBreadcrumbItemDirective

Una directiva estructural que se usa para definir una plantilla personalizada para los elementos del breadcrumb.

| Selector              | Tipo de contexto            |
| --------------------- | --------------------------- |
| `[hubBreadcrumbItem]` | `BreadcrumbTemplateContext` |

### HubBreadcrumbLabelDirective

Añade el tooltip de desbordamiento a la etiqueta de una miga. Desde la 22.7.0 el componente
envuelve la plantilla `hubBreadcrumbItem` en su propia caja de recorte, así que una miga
personalizada recibe el tooltip sin pedirlo. Aplica la directiva a mano solo para darle otro
texto.

| Selector               | Input                                                              | Por defecto |
| ---------------------- | ------------------------------------------------------------------ | ----------- |
| `[hubBreadcrumbLabel]` | `hubBreadcrumbLabel: string` (alias) — texto explícito del tooltip | `''`        |

Si se deja vacío, el texto del tooltip es el propio contenido de texto del elemento, y solo
se muestra mientras ese texto esté recortado. La directiva no recorta nada: los puntos
suspensivos vienen de los estilos de `truncateItems`.

Ponerla a mano es opcional. El componente ya la aplica a las etiquetas que renderiza y a la caja
en la que envuelve una plantilla `hubBreadcrumbItem`, así que una miga personalizada se recorta y
recibe su tooltip sin añadir nada. La directiva es para cuando el tooltip deba decir otra cosa
distinta de la etiqueta —una ruta completa, una fecha escrita entera—; en ese caso importa
`HubBreadcrumbLabelDirective` en el componente que declara la plantilla.

```html
<hub-breadcrumb [truncateItems]="true">
	<ng-template hubBreadcrumbItem let-item>
		<a class="my-crumb" [hubBreadcrumbLabel]="item.url" [routerLink]="item.url">{{ item.label }}</a>
	</ng-template>
</hub-breadcrumb>
```

### Adaptador de tooltip

El contrato por el que las etiquetas recortadas alcanzan un tooltip más rico. Está tipado
estructuralmente y declarado aquí en vez de importado, así el paquete mantiene cero
dependencias duras.

| Export                           | Tipo                   | Descripción                                                            |
| -------------------------------- | ---------------------- | ---------------------------------------------------------------------- |
| `provideHubBreadcrumbTooltip()`  | `EnvironmentProviders` | Registra un adaptador una sola vez para toda la aplicación.            |
| `HUB_BREADCRUMB_TOOLTIP_ADAPTER` | `InjectionToken`       | El token que rellena el provider. Inyéctalo con `{ optional: true }`.  |
| `HubBreadcrumbTooltipAdapter`    | interfaz               | `attach(host: HTMLElement, text: string): HubBreadcrumbTooltipHandle`. |
| `HubBreadcrumbTooltipHandle`     | interfaz               | `update(text: string): void` y `destroy(): void`.                      |

### HubBreadcrumbsService

Un servicio inyectable (`providedIn: 'root'`) que publica la ruta de breadcrumbs. El componente lee la señal; también puedes inyectarlo directamente cuando necesites los datos de breadcrumb en otro lugar.

| Miembro        | Tipo                           | Descripción                                                                        |
| -------------- | ------------------------------ | ---------------------------------------------------------------------------------- |
| `breadcrumbs`  | `Signal<BreadcrumbItem[]>`     | La ruta actual. Se lee en una plantilla o en un `computed`, sin nada que envolver. |
| `breadcrumbs$` | `Observable<BreadcrumbItem[]>` | La misma ruta como flujo, para código que ya compone con rxjs.                     |

Sustituir el servicio (un doble de test, una fachada sobre otra fuente) implica publicar
`breadcrumbs`: es el miembro que lee el componente.

### HubBreadcrumbsModule

**Obsoleto: se retira en la 23.0.0.** Un `NgModule` que importa y exporta `HubBreadcrumbComponent` y `HubBreadcrumbItemDirective` para aplicaciones basadas en módulos, y que no aporta nada más. Importa los dos declarables directamente; `HubBreadcrumbsService` es `providedIn: 'root'` y nunca pasó por el módulo. Consulta `BREAKING_CHANGES.md`.

### Interfaces

#### BreadcrumbItem

| Propiedad  | Tipo     | Descripción                                                                                                    |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `label`    | `string` | El texto resuelto que se muestra para el breadcrumb.                                                           |
| `url`      | `string` | El destino dentro de la aplicación, que se pasa a `routerLink`.                                                |
| `data`     | `any`    | Opcional. El objeto data original de la ruta (útil para iconos, etc.).                                         |
| `href`     | `string` | Opcional. Destino externo. Si está presente, la miga se renderiza como enlace simple en lugar de `routerLink`. |
| `target`   | `string` | Opcional. `target` del enlace (p. ej. `_blank`). Solo tiene sentido junto a `href`.                            |
| `rel`      | `string` | Opcional. `rel` del enlace. Si se omite, una miga con `_blank` recibe igualmente `noopener noreferrer`.        |
| `download` | `string` | Opcional. `download` del enlace: la miga apunta a un archivo que se guarda, no a una página que se abre.       |

#### BreadcrumbRouteConfig

La forma de objeto que admite `data.breadcrumb` en una ruta, para las migas cuyo destino está fuera del router. Las formas de cadena y de función siguen siendo válidas y son la opción correcta para una miga interna normal.

| Propiedad  | Tipo                                | Descripción                                                            |
| ---------- | ----------------------------------- | ---------------------------------------------------------------------- |
| `label`    | `string \| ((data: any) => string)` | Etiqueta estática, o función que recibe el `data` resuelto de la ruta. |
| `href`     | `string`                            | Opcional. Igual que en `BreadcrumbItem`.                               |
| `target`   | `string`                            | Opcional. Igual que en `BreadcrumbItem`.                               |
| `rel`      | `string`                            | Opcional. Igual que en `BreadcrumbItem`.                               |
| `download` | `string`                            | Opcional. Igual que en `BreadcrumbItem`.                               |

#### BreadcrumbTemplateContext

| Propiedad   | Tipo             | Descripción                                                       |
| ----------- | ---------------- | ----------------------------------------------------------------- |
| `$implicit` | `BreadcrumbItem` | El objeto del elemento actual (enlazado mediante `let-item`).     |
| `isLast`    | `boolean`        | `true` si este elemento es el último de la lista (página actual). |

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
/* El acento no se declara a propósito en el host del componente, así que cualquier regla
   tuya gana sin trucos de especificidad: el elemento del breadcrumb por etiqueta o por
   clase, o un ancestro del que lo herede. Un `variant` sigue ganando a ambos, que para eso
   está. Los demás tokens conservan sus valores por defecto en `:host`, así que esos van en
   el propio elemento del breadcrumb o en `.hub-breadcrumb__list`. */
hub-breadcrumb {
	--hub-breadcrumb-accent: var(--hub-sys-color-info);
}
```

### Anillo de foco e indicador colapsado

El foco de teclado se dibuja con el anillo del sistema de diseño, de modo que el foco de un breadcrumb se ve como el foco de cualquier otro elemento de la aplicación. Se retinta sin tocar el `outline`:

```scss
/* Estos valores por defecto se declaran en :host, así que la sobrescritura debe caer en
   el propio elemento del breadcrumb o dentro de él: un valor definido en un ancestro nunca
   les llega. (El acento es la excepción: se deja sin declarar a propósito, así que sí se
   hereda.) */
.hub-breadcrumb__list {
	--hub-breadcrumb-focus-ring-color: rgba(25, 135, 84, 0.35);
	--hub-breadcrumb-focus-ring-width: 0.25rem;
	--hub-breadcrumb-focus-ring-radius: 0.25rem;
	--hub-breadcrumb-link-focus-color: #146c43;
	--hub-breadcrumb-focus-bg: rgba(25, 135, 84, 0.08);

	/* El botón `…` que aparece cuando `maxItems` pliega la ruta */
	--hub-breadcrumb-collapsed-color: #6c757d;
	--hub-breadcrumb-collapsed-hover-color: #146c43;
	--hub-breadcrumb-collapsed-bg: transparent;
	--hub-breadcrumb-collapsed-hover-bg: rgba(25, 135, 84, 0.08);
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

Inclúyelo sobre el elemento `<hub-breadcrumb>` con un selector que gane a los valores por
defecto que el componente declara en `:host`: etiqueta más clase basta. Un `.docs-breadcrumb`
a secas empata en especificidad y pierde por orden de carga, y esa misma clase en un envoltorio
no llega nunca al componente, porque una declaración en el elemento siempre gana a un valor
heredado.

```html
<hub-breadcrumb class="docs-breadcrumb"></hub-breadcrumb>
```

```scss
@use 'ng-hub-ui-breadcrumbs/styles/mixins/breadcrumb-theme' as *;

hub-breadcrumb.docs-breadcrumb {
	@include hub-breadcrumb-theme(
		$bg: #f8fafc,
		$padding-x: 0.75rem,
		$divider: "'/'",
		// mantén las comillas interiores — alimenta `content` de CSS
		$accent: var(--hub-sys-color-info)
	);
}
```

Una llamada que solo pase `$accent` es la excepción: el acento no se declara en el host, así
que puede vivir en un ancestro y aun así recolorear los enlaces.

## Changelog

Todos los cambios relevantes están documentados en el [CHANGELOG.md](./CHANGELOG.md). Para los cambios incompatibles, consulta [BREAKING_CHANGES.md](./BREAKING_CHANGES.md).

La última versión es la **v22.5.2**, una corrección para el breadcrumb dibujado antes de que termine la primera navegación. Los inputs de colapso, las migas que apuntan fuera del router y el anillo de foco de teclado llegaron en la **v22.5.0**; la ruta de empaquetado `ng-hub-ui-breadcrumbs/styles`, en la **v22.4.0**.

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

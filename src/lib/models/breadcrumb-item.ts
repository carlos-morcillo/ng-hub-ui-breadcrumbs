/**
 * A single crumb of the trail.
 *
 * `url` is the in-app destination and remains the default one: it is handed to
 * `routerLink`. The optional anchor fields take over when the crumb's canonical
 * destination is not an Angular route — a section still served by a legacy app,
 * another domain, or a file meant to be saved rather than opened.
 */
export interface BreadcrumbItem {
	label: string;
	url: string;
	data?: any;
	/** External destination. When present the crumb renders a plain anchor, not a `routerLink`. */
	href?: string;
	/** Anchor `target` (e.g. `_blank`). Only meaningful alongside `href`. */
	target?: string;
	/** Anchor `rel`. Left unset, a `_blank` crumb still gets `noopener noreferrer`. */
	rel?: string;
	/** Anchor `download`: the crumb points at a file to save instead of a page to open. */
	download?: string;
}

/**
 * Object form accepted by a route's `data.breadcrumb`, for the crumbs whose
 * destination lies outside the router. The string and function forms stay valid
 * and are the right choice for the ordinary in-app crumb.
 *
 * ```ts
 * { path: 'invoices', data: { breadcrumb: { label: 'Invoices', href: 'https://legacy.example.com/invoices' } } }
 * ```
 */
export interface BreadcrumbRouteConfig extends Pick<BreadcrumbItem, 'href' | 'target' | 'rel' | 'download'> {
	/** Static label, or a function receiving the route's resolved `data`. */
	label: string | ((data: any) => string);
}

/** Every shape a route may declare under `data.breadcrumb`. */
export type BreadcrumbRouteData = string | ((data: any) => string) | BreadcrumbRouteConfig;

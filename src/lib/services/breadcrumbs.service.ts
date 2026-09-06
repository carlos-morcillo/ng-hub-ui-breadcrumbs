import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { BreadcrumbItem, BreadcrumbRouteConfig, BreadcrumbRouteData } from '../models/breadcrumb-item';

@Injectable({
	providedIn: 'root'
})
export class HubBreadcrumbsService {
	#router = inject(Router);
	#activatedRoute = inject(ActivatedRoute);

	/** The trail as a stream, for consumers already composing with rxjs. */
	breadcrumbs$ = this.#router.events.pipe(
		filter((event) => event instanceof NavigationEnd),
		startWith(undefined),
		map(() => this.createBreadcrumbs(this.#activatedRoute.root))
	);

	/**
	 * The trail as a signal, and the surface the component reads. Published here
	 * rather than left to each consumer, because a stream that only ever carries
	 * the current trail is one every caller was wrapping in the same `toSignal`
	 * — the component included. Wrapped once, subscribed once.
	 */
	readonly breadcrumbs: Signal<BreadcrumbItem[]> = toSignal(this.breadcrumbs$, { initialValue: [] as BreadcrumbItem[] });

	private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] {
		const children: ActivatedRoute[] = route.children;

		if (children.length === 0) {
			return breadcrumbs;
		}

		for (const child of children) {
			// A route is recognised before it is activated, and carries `_futureSnapshot`
			// in between while `snapshot` is still unset. `breadcrumbs$` opens with
			// `startWith(undefined)`, so a shell that draws its breadcrumb on the first
			// paint walks the tree inside that window — and reading `.url` there threw,
			// out of a subscription that draws the whole page header, taking the header
			// with it. There is nothing to name yet either: a route with no snapshot has
			// no segments and no resolved data, so it is skipped rather than guessed at.
			if (!child.snapshot) {
				continue;
			}

			const routeSegments = child.snapshot.url;

			// URL of this level
			const routeURL: string = routeSegments.map((segment) => segment.path).join('/');

			const nextUrl = routeURL ? `${url}/${routeURL}` : url;

			// Only the routes declaring their own breadcrumb become a crumb
			const hasBreadcrumbData = this.hasOwnBreadcrumbData(child);

			if (hasBreadcrumbData) {
				breadcrumbs.push(this.createItem(child, nextUrl));
			}

			return this.createBreadcrumbs(child, nextUrl, breadcrumbs);
		}

		return breadcrumbs;
	}

	private hasOwnBreadcrumbData(route: ActivatedRoute): boolean {
		const routeConfig = route.routeConfig;
		return !!(routeConfig && routeConfig.data && routeConfig.data['breadcrumb']);
	}

	/**
	 * Builds the crumb for a route. The object form of `data.breadcrumb` carries
	 * anchor metadata for destinations outside the router; whatever accompanies
	 * `label` there travels to the item untouched, so a new anchor attribute needs
	 * no change here.
	 */
	private createItem(route: ActivatedRoute, url: string): BreadcrumbItem {
		const data = route.snapshot.data;
		const config: BreadcrumbRouteData = data['breadcrumb'];

		if (this.isRouteConfig(config)) {
			const { label: labelSource, ...anchor } = config;
			return { label: this.resolveLabel(labelSource, data), url, data, ...anchor };
		}

		return { label: this.resolveLabel(config, data), url, data };
	}

	/** Narrows `data.breadcrumb` to its object form, excluding the function form. */
	private isRouteConfig(config: BreadcrumbRouteData): config is BreadcrumbRouteConfig {
		return typeof config === 'object' && config !== null;
	}

	private resolveLabel(source: string | ((data: any) => string), data: any): string {
		const label = typeof source === 'function' ? source(data) : source;

		return data['resolvedData'] ? this.getResolvedBreadcrumb(label, data['resolvedData']) : label;
	}

	private getResolvedBreadcrumb(template: string, data: any): string {
		return template.replace(/\{([^}]+)\}/g, (match, key) => {
			return data[key] || match;
		});
	}
}

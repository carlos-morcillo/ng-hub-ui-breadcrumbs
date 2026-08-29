import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { BreadcrumbItem, BreadcrumbRouteConfig, BreadcrumbRouteData } from '../models/breadcrumb-item';

@Injectable({
	providedIn: 'root'
})
export class HubBreadcrumbsService {
	#router = inject(Router);
	#activatedRoute = inject(ActivatedRoute);

	breadcrumbs$ = this.#router.events.pipe(
		filter((event) => event instanceof NavigationEnd),
		startWith(undefined),
		map(() => this.createBreadcrumbs(this.#activatedRoute.root))
	);

	private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] {
		const children: ActivatedRoute[] = route.children;

		if (children.length === 0) {
			return breadcrumbs;
		}

		for (const child of children) {
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

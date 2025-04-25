import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { BreadcrumbItem } from '../models/breadcrumb-item';

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

	private createBreadcrumbs(
		route: ActivatedRoute,
		url: string = '',
		breadcrumbs: BreadcrumbItem[] = []
	): BreadcrumbItem[] {
		const children: ActivatedRoute[] = route.children;

		if (children.length === 0) {
			return breadcrumbs;
		}

		for (const child of children) {
			const routeSegments = child.snapshot.url;

			// Construir la URL para este nivel
			const routeURL: string = routeSegments
				.map((segment) => segment.path)
				.join('/');

			const nextUrl = routeURL ? `${url}/${routeURL}` : url;

			// Verificar si esta ruta específica tiene datos de breadcrumb
			const hasBreadcrumbData = this.hasOwnBreadcrumbData(child);

			if (hasBreadcrumbData) {
				const label = this.getBreadcrumbLabel(child);
				breadcrumbs.push({
					label,
					url: nextUrl,
					data: child.snapshot.data
				});
			}

			// Continuar con los hijos
			return this.createBreadcrumbs(child, nextUrl, breadcrumbs);
		}

		return breadcrumbs;
	}

	private hasOwnBreadcrumbData(route: ActivatedRoute): boolean {
		// Verificar si la ruta tiene su propia configuración de breadcrumb
		const routeConfig = route.routeConfig;
		return !!(
			routeConfig &&
			routeConfig.data &&
			routeConfig.data['breadcrumb']
		);
	}

	private getBreadcrumbLabel(route: ActivatedRoute): string {
		const data = route.snapshot.data;
		let label = data['breadcrumb'];

		if (typeof label === 'function') {
			label = label(data);
		}

		if (data['resolvedData']) {
			label = this.getResolvedBreadcrumb(label, data['resolvedData']);
		}

		return label;
	}

	private getResolvedBreadcrumb(template: string, data: any): string {
		return template.replace(/\{([^}]+)\}/g, (match, key) => {
			return data[key] || match;
		});
	}
}

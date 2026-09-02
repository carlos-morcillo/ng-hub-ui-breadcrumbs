import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Routes } from '@angular/router';
import { BreadcrumbItem } from '../models/breadcrumb-item';

import { HubBreadcrumbsService } from './breadcrumbs.service';

@Component({ selector: 'hub-test-host', standalone: true, template: '' })
class TestHostComponent {}

const routes: Routes = [{ path: 'docs', component: TestHostComponent, data: { breadcrumb: 'Docs' } }];

/**
 * The trail is asked for before the router has finished answering.
 *
 * `breadcrumbs$` opens with `startWith(undefined)`, so the tree is walked the moment
 * anything subscribes — and a shell that draws its breadcrumb on the first paint
 * subscribes while the initial navigation is still in flight. An `ActivatedRoute` carries
 * `_futureSnapshot` from the moment it is recognised and `snapshot` only once it is
 * activated, so in that window a child exists with no snapshot at all, and reading
 * `child.snapshot.url` throws.
 *
 * It does not throw quietly. The exception escapes into the subscription that draws the
 * page shell, so what a consumer sees is not a missing breadcrumb: it is the whole header
 * gone — breadcrumb, company switcher, language and avatar — with ten identical
 * `TypeError: Cannot read properties of undefined (reading 'url')` per load and nothing
 * naming this service. Measured in a product on 22.5.0, and still true in 22.5.1.
 */
/**
 * The route tree the service will walk.
 *
 * Provided rather than pushed onto the real one: `ActivatedRoute.children` is a getter
 * over the router's own tree, so anything appended to what it returns is thrown away and
 * the test passes without ever reaching the code it is about.
 */
function treeOf(...children: unknown[]): ActivatedRoute {
	const root = { children, snapshot: { url: [], data: {} }, routeConfig: null };
	return { root } as unknown as ActivatedRoute;
}

/** A route recognised but not yet activated: `snapshot` is not there yet. */
const unactivated = { children: [], snapshot: undefined, routeConfig: null };

/** A route the router has finished activating. */
const activated = {
	children: [],
	snapshot: { url: [{ path: 'docs' }], data: { breadcrumb: 'Docs' } },
	routeConfig: { data: { breadcrumb: 'Docs' } }
};

describe('a breadcrumb asked for before the first navigation', () => {
	/** The trail the service produces for a given tree, read once and unsubscribed. */
	function trailFor(tree: ActivatedRoute): BreadcrumbItem[] | undefined {
		TestBed.resetTestingModule();
		TestBed.configureTestingModule({
			providers: [provideRouter(routes), { provide: ActivatedRoute, useValue: tree }]
		});

		let trail: BreadcrumbItem[] | undefined;
		TestBed.inject(HubBreadcrumbsService)
			.breadcrumbs$.subscribe((value) => (trail = value))
			.unsubscribe();

		return trail;
	}

	it('does not throw when a route has not been activated yet', () => {
		expect(() => trailFor(treeOf(unactivated))).not.toThrow();
		expect(trailFor(treeOf(unactivated))).toEqual([]);
	});

	/** A route that is activated keeps being read exactly as before. */
	it('still reads a route that has been activated', () => {
		const trail = trailFor(treeOf(activated));

		expect(trail?.map((item) => item.label)).toEqual(['Docs']);
		expect(trail?.[0].url).toBe('/docs');
	});
});

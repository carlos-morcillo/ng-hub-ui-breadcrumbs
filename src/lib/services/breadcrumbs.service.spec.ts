import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { BreadcrumbItem } from '../models/breadcrumb-item';

import { HubBreadcrumbsService } from './breadcrumbs.service';

@Component({ selector: 'hub-test-host', standalone: true, template: '' })
class TestHostComponent {}

const routes: Routes = [
	{
		path: 'docs',
		component: TestHostComponent,
		data: { breadcrumb: 'Docs' },
		children: [
			{
				path: 'legacy',
				component: TestHostComponent,
				data: {
					breadcrumb: {
						label: 'Legacy portal',
						href: 'https://legacy.example.com/docs',
						target: '_blank',
						rel: 'nofollow'
					}
				}
			},
			{
				path: 'handbook',
				component: TestHostComponent,
				data: { breadcrumb: { label: 'Handbook', href: '/files/handbook.pdf', download: 'handbook.pdf' } }
			},
			{
				path: 'products/:id',
				component: TestHostComponent,
				data: { breadcrumb: 'Product {name}' },
				resolve: { resolvedData: () => ({ name: 'Widget' }) }
			},
			{
				path: 'reports',
				component: TestHostComponent,
				data: { breadcrumb: (data: Record<string, unknown>) => `Reports (${data['scope']})`, scope: 'monthly' }
			}
		]
	}
];

describe('HubBreadcrumbsService', () => {
	let service: HubBreadcrumbsService;
	let harness: RouterTestingHarness;
	let latest: BreadcrumbItem[];

	beforeEach(async () => {
		TestBed.configureTestingModule({
			providers: [provideRouter(routes)]
		});
		service = TestBed.inject(HubBreadcrumbsService);
		harness = await RouterTestingHarness.create();

		latest = [];
		service.breadcrumbs$.subscribe((items) => (latest = items));
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('builds the trail from the routes that declare breadcrumb data', async () => {
		await harness.navigateByUrl('/docs/reports');

		expect(latest.map((item) => item.label)).toEqual(['Docs', 'Reports (monthly)']);
		expect(latest.map((item) => item.url)).toEqual(['/docs', '/docs/reports']);
	});

	it('interpolates {key} placeholders from the resolved data', async () => {
		await harness.navigateByUrl('/docs/products/42');

		expect(latest.at(-1)?.label).toBe('Product Widget');
	});

	it('carries href, target and rel from the object form', async () => {
		await harness.navigateByUrl('/docs/legacy');

		expect(latest.at(-1)).toMatchObject({
			label: 'Legacy portal',
			href: 'https://legacy.example.com/docs',
			target: '_blank',
			rel: 'nofollow'
		});
	});

	it('carries download from the object form', async () => {
		await harness.navigateByUrl('/docs/handbook');

		expect(latest.at(-1)).toMatchObject({ label: 'Handbook', href: '/files/handbook.pdf', download: 'handbook.pdf' });
	});

	it('leaves plain crumbs without external link metadata', async () => {
		await harness.navigateByUrl('/docs/reports');

		expect(latest[0].href).toBeUndefined();
		expect(latest[0].target).toBeUndefined();
	});
});

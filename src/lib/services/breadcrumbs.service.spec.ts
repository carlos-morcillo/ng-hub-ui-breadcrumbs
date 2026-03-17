import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HubBreadcrumbsService } from './breadcrumbs.service';

describe('HubBreadcrumbsService', () => {
	let service: HubBreadcrumbsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideRouter([])]
		});
		service = TestBed.inject(HubBreadcrumbsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

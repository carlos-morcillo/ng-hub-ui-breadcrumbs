import { TestBed } from '@angular/core/testing';

import { HubBreadcrumbsService } from './breadcrumbs.service';

describe('HubBreadcrumbsService', () => {
	let service: HubBreadcrumbsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(HubBreadcrumbsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

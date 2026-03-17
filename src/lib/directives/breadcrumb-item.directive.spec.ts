import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubBreadcrumbItemDirective } from './breadcrumb-item.directive';

@Component({
	standalone: true,
	imports: [HubBreadcrumbItemDirective],
	template: `
		<ng-template hubBreadcrumbItem let-item="item">
			<span class="breadcrumb-label">{{ item?.label }}</span>
		</ng-template>
	`
})
class TestHostComponent {
	readonly breadcrumbItemDirective = viewChild.required(HubBreadcrumbItemDirective);
}

describe('HubBreadcrumbItemDirective', () => {
	let fixture: ComponentFixture<TestHostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestHostComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(TestHostComponent);
		fixture.detectChanges();
	});

	it('should create an instance', () => {
		const directive = fixture.componentInstance.breadcrumbItemDirective();

		expect(directive).toBeTruthy();
		expect(directive.template).toBeTruthy();
	});
});

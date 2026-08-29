import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BreadcrumbItem } from '../../models/breadcrumb-item';
import { HubBreadcrumbsService } from '../../services/breadcrumbs.service';
import { HubBreadcrumbComponent } from './breadcrumb.component';

/** Router-free stand-in so specs drive the trail directly. */
class FakeBreadcrumbsService {
	readonly source = new BehaviorSubject<BreadcrumbItem[]>([]);
	readonly breadcrumbs$ = this.source.asObservable();
}

const trail = (...labels: string[]): BreadcrumbItem[] => labels.map((label) => ({ label, url: `/${label.toLowerCase()}` }));

describe('HubBreadcrumbComponent', () => {
	let component: HubBreadcrumbComponent;
	let fixture: ComponentFixture<HubBreadcrumbComponent>;
	let service: FakeBreadcrumbsService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HubBreadcrumbComponent],
			providers: [provideRouter([]), { provide: HubBreadcrumbsService, useClass: FakeBreadcrumbsService }]
		}).compileComponents();

		fixture = TestBed.createComponent(HubBreadcrumbComponent);
		component = fixture.componentInstance;
		service = TestBed.inject(HubBreadcrumbsService) as unknown as FakeBreadcrumbsService;
		fixture.detectChanges();
	});

	/** Visible crumb labels, in order, excluding the collapsed indicator. */
	const labels = (): string[] =>
		fixture.debugElement
			.queryAll(By.css('.hub-breadcrumb__link, .hub-breadcrumb__text'))
			.map((el) => (el.nativeElement.textContent ?? '').trim());

	const indicator = () => fixture.debugElement.query(By.css('.hub-breadcrumb__collapsed'));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('renders the trail published by the service', () => {
		service.source.next(trail('Home', 'Products', 'Detail'));
		fixture.detectChanges();

		expect(labels()).toEqual(['Home', 'Products', 'Detail']);
	});

	describe('manual items', () => {
		it('replaces the router trail when [items] is set', () => {
			service.source.next(trail('Home', 'Products'));
			fixture.componentRef.setInput('items', trail('Docs', 'Guides', 'Install'));
			fixture.detectChanges();

			expect(labels()).toEqual(['Docs', 'Guides', 'Install']);
		});

		it('falls back to the router trail when [items] is null', () => {
			service.source.next(trail('Home', 'Products'));
			fixture.componentRef.setInput('items', null);
			fixture.detectChanges();

			expect(labels()).toEqual(['Home', 'Products']);
		});
	});

	describe('collapsing', () => {
		beforeEach(() => {
			service.source.next(trail('One', 'Two', 'Three', 'Four', 'Five', 'Six'));
		});

		it('shows every crumb when maxItems is not set', () => {
			fixture.detectChanges();

			expect(labels().length).toBe(6);
			expect(indicator()).toBeNull();
		});

		it('shows every crumb when the trail fits within maxItems', () => {
			fixture.componentRef.setInput('maxItems', 6);
			fixture.detectChanges();

			expect(labels().length).toBe(6);
			expect(indicator()).toBeNull();
		});

		it('keeps the first and last crumb around the indicator by default', () => {
			fixture.componentRef.setInput('maxItems', 4);
			fixture.detectChanges();

			expect(labels()).toEqual(['One', 'Six']);
			expect(indicator()).not.toBeNull();
		});

		it('honours itemsBeforeCollapse and itemsAfterCollapse', () => {
			fixture.componentRef.setInput('maxItems', 4);
			fixture.componentRef.setInput('itemsBeforeCollapse', 2);
			fixture.componentRef.setInput('itemsAfterCollapse', 2);
			fixture.detectChanges();

			expect(labels()).toEqual(['One', 'Two', 'Five', 'Six']);
		});

		it('does not collapse when the retained ends already cover the trail', () => {
			fixture.componentRef.setInput('maxItems', 2);
			fixture.componentRef.setInput('itemsBeforeCollapse', 4);
			fixture.componentRef.setInput('itemsAfterCollapse', 4);
			fixture.detectChanges();

			expect(labels().length).toBe(6);
			expect(indicator()).toBeNull();
		});

		it('exposes the indicator as a button with a configurable accessible name', () => {
			fixture.componentRef.setInput('maxItems', 4);
			fixture.componentRef.setInput('collapsedAriaLabel', 'Mostrar todas las migas');
			fixture.detectChanges();

			const button: HTMLButtonElement = indicator().nativeElement;
			expect(button.tagName).toBe('BUTTON');
			expect(button.type).toBe('button');
			expect(button.getAttribute('aria-label')).toBe('Mostrar todas las migas');
			expect(button.getAttribute('aria-expanded')).toBe('false');
		});

		it('expands in place and emits collapsedClick when the indicator is clicked', () => {
			fixture.componentRef.setInput('maxItems', 4);
			fixture.detectChanges();

			let emitted = 0;
			component.collapsedClick.subscribe(() => emitted++);

			indicator().nativeElement.click();
			fixture.detectChanges();

			expect(emitted).toBe(1);
			expect(labels().length).toBe(6);
			expect(indicator()).toBeNull();
		});

		it('collapses again when a new trail arrives', () => {
			fixture.componentRef.setInput('maxItems', 4);
			fixture.detectChanges();
			indicator().nativeElement.click();
			fixture.detectChanges();

			service.source.next(trail('A', 'B', 'C', 'D', 'E'));
			fixture.detectChanges();

			expect(indicator()).not.toBeNull();
			expect(labels()).toEqual(['A', 'E']);
		});
	});

	describe('external destinations', () => {
		it('renders an anchor with href, target, rel and download', () => {
			fixture.componentRef.setInput('items', [
				{ label: 'Legacy', url: '/legacy', href: 'https://legacy.example.com', target: '_blank', rel: 'nofollow' },
				{ label: 'Report', url: '/report', href: '/files/report.pdf', download: 'report.pdf' },
				{ label: 'Here', url: '/here' }
			] satisfies BreadcrumbItem[]);
			fixture.detectChanges();

			const [external, file] = fixture.debugElement.queryAll(By.css('a.hub-breadcrumb__link'));

			expect(external.nativeElement.getAttribute('href')).toBe('https://legacy.example.com');
			expect(external.nativeElement.getAttribute('target')).toBe('_blank');
			expect(external.nativeElement.getAttribute('rel')).toBe('nofollow');
			expect(file.nativeElement.getAttribute('href')).toBe('/files/report.pdf');
			expect(file.nativeElement.getAttribute('download')).toBe('report.pdf');
			expect(file.nativeElement.getAttribute('target')).toBeNull();
		});

		it('defends _blank links with noopener noreferrer when no rel is given', () => {
			fixture.componentRef.setInput('items', [
				{ label: 'Legacy', url: '/legacy', href: 'https://legacy.example.com', target: '_blank' },
				{ label: 'Here', url: '/here' }
			] satisfies BreadcrumbItem[]);
			fixture.detectChanges();

			const external = fixture.debugElement.query(By.css('a.hub-breadcrumb__link'));
			expect(external.nativeElement.getAttribute('rel')).toBe('noopener noreferrer');
		});

		it('routes internal crumbs through routerLink', () => {
			fixture.componentRef.setInput('items', trail('Home', 'Products', 'Detail'));
			fixture.detectChanges();

			const first = fixture.debugElement.query(By.css('a.hub-breadcrumb__link'));
			expect(first.nativeElement.getAttribute('href')).toBe('/home');
			expect(first.nativeElement.getAttribute('target')).toBeNull();
		});

		it('never links the current crumb, even when it declares an href', () => {
			fixture.componentRef.setInput('items', [
				{ label: 'Home', url: '/home' },
				{ label: 'Current', url: '/current', href: 'https://example.com' }
			] satisfies BreadcrumbItem[]);
			fixture.detectChanges();

			const current = fixture.debugElement.query(By.css('.hub-breadcrumb__text'));
			expect(current.nativeElement.tagName).toBe('SPAN');
			expect(current.nativeElement.getAttribute('aria-current')).toBe('page');
		});
	});
});

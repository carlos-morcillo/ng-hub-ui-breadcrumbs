import { ApplicationRef, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { HubBreadcrumbItemDirective } from '../../directives/breadcrumb-item.directive';
import { HubBreadcrumbLabelDirective } from '../../directives/breadcrumb-label.directive';
import { BreadcrumbItem } from '../../models/breadcrumb-item';
import { HubBreadcrumbsService } from '../../services/breadcrumbs.service';
import { HubBreadcrumbComponent } from './breadcrumb.component';

/**
 * Router-free stand-in so specs drive the trail directly. It publishes the signal
 * and nothing else — the component must read the service the way the service now
 * offers itself, without a stream to wrap.
 */
class FakeBreadcrumbsService {
	readonly source = signal<BreadcrumbItem[]>([]);
	readonly breadcrumbs = this.source.asReadonly();
}

const trail = (...labels: string[]): BreadcrumbItem[] => labels.map((label) => ({ label, url: `/${label.toLowerCase()}` }));

/** Consumer taking over the markup, the way `hubBreadcrumbItem` is meant to be used. */
@Component({
	imports: [HubBreadcrumbComponent, HubBreadcrumbItemDirective],
	template: `
		<hub-breadcrumb [items]="items">
			<ng-template hubBreadcrumbItem let-item>
				<span class="custom-crumb">{{ item.label }}</span>
			</ng-template>
		</hub-breadcrumb>
	`
})
class CustomTemplateHostComponent {
	readonly items = trail('Home', 'Products', 'Detail');
}

/** The same consumer, asking for truncation — the case `truncateItems` used to ignore. */
@Component({
	imports: [HubBreadcrumbComponent, HubBreadcrumbItemDirective, RouterLink],
	template: `
		<hub-breadcrumb [items]="items" [truncateItems]="true">
			<ng-template hubBreadcrumbItem let-item>
				<a class="custom-crumb" [routerLink]="item.url">{{ item.label }}</a>
			</ng-template>
		</hub-breadcrumb>
	`
})
class TruncatedCustomTemplateHostComponent {
	readonly items = trail('Home', 'A very long products section label', 'Detail');
}

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

	/**
	 * The trail had two public surfaces on the component: the signal it renders from and a
	 * re-exported `breadcrumbs$`. The second is gone, so there is one place to read it — and
	 * a fake service like the one above no longer has to publish a stream nobody consumes.
	 */
	it('does not re-export the service stream', () => {
		expect((component as unknown as Record<string, unknown>)['breadcrumbs$']).toBeUndefined();
	});

	it('renders the trail published by the service', () => {
		service.source.set(trail('Home', 'Products', 'Detail'));
		fixture.detectChanges();

		expect(labels()).toEqual(['Home', 'Products', 'Detail']);
	});

	describe('manual items', () => {
		it('replaces the router trail when [items] is set', () => {
			service.source.set(trail('Home', 'Products'));
			fixture.componentRef.setInput('items', trail('Docs', 'Guides', 'Install'));
			fixture.detectChanges();

			expect(labels()).toEqual(['Docs', 'Guides', 'Install']);
		});

		it('falls back to the router trail when [items] is null', () => {
			service.source.set(trail('Home', 'Products'));
			fixture.componentRef.setInput('items', null);
			fixture.detectChanges();

			expect(labels()).toEqual(['Home', 'Products']);
		});
	});

	describe('collapsing', () => {
		beforeEach(() => {
			service.source.set(trail('One', 'Two', 'Three', 'Four', 'Five', 'Six'));
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

		it('hands focus to the first revealed crumb instead of dropping it on the body', () => {
			fixture.componentRef.setInput('maxItems', 4);
			fixture.detectChanges();

			indicator().nativeElement.focus();
			indicator().nativeElement.click();
			fixture.detectChanges();
			TestBed.inject(ApplicationRef).tick();

			const revealed: HTMLElement = fixture.debugElement.queryAll(By.css('.hub-breadcrumb__link'))[1].nativeElement;
			expect((revealed.textContent ?? '').trim()).toBe('Two');
			expect(document.activeElement).toBe(revealed);
		});

		it('focuses the crumb that itemsBeforeCollapse leaves first in the hidden range', () => {
			fixture.componentRef.setInput('maxItems', 4);
			fixture.componentRef.setInput('itemsBeforeCollapse', 3);
			fixture.detectChanges();

			indicator().nativeElement.click();
			fixture.detectChanges();
			TestBed.inject(ApplicationRef).tick();

			expect((document.activeElement?.textContent ?? '').trim()).toBe('Four');
		});

		it('collapses again when a new trail arrives', () => {
			fixture.componentRef.setInput('maxItems', 4);
			fixture.detectChanges();
			indicator().nativeElement.click();
			fixture.detectChanges();

			service.source.set(trail('A', 'B', 'C', 'D', 'E'));
			fixture.detectChanges();

			expect(indicator()).not.toBeNull();
			expect(labels()).toEqual(['A', 'E']);
		});
	});

	describe('accent variants', () => {
		/** The nine accents the SCSS `@each` loop already emits a rule for. */
		const builtIn = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'neutral', 'light', 'dark'];

		const inlineAccent = (): string => fixture.nativeElement.style.getPropertyValue('--hub-breadcrumb-accent');

		it('leaves every built-in accent to the stylesheet', () => {
			for (const variant of builtIn) {
				fixture.componentRef.setInput('variant', variant);
				fixture.detectChanges();

				expect(fixture.nativeElement.getAttribute('data-variant')).toBe(variant);
				expect(inlineAccent()).toBe('');
			}
		});

		it('inlines the accent slot for a custom variant', () => {
			fixture.componentRef.setInput('variant', 'brand');
			fixture.detectChanges();

			expect(inlineAccent()).toBe('var(--hub-sys-color-brand)');
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
		});
	});

	describe('current page marker', () => {
		/** `aria-current` per rendered crumb, in order. */
		const currentFlags = (from: ComponentFixture<unknown>): (string | null)[] =>
			from.debugElement
				.queryAll(By.css('.hub-breadcrumb__item'))
				.map((el) => el.nativeElement.getAttribute('aria-current'));

		it('marks the last crumb of the default markup', () => {
			fixture.componentRef.setInput('items', trail('Home', 'Products', 'Detail'));
			fixture.detectChanges();

			expect(currentFlags(fixture)).toEqual([null, null, 'page']);
		});

		it('marks the last crumb when a custom template renders it', () => {
			const host = TestBed.createComponent(CustomTemplateHostComponent);
			host.detectChanges();

			expect(host.debugElement.queryAll(By.css('.custom-crumb')).length).toBe(3);
			expect(currentFlags(host)).toEqual([null, null, 'page']);
		});
	});
	// TD-146 — `truncateItems` clipped only the markup the component draws itself, so a
	// consumer who took the markup over with `hubBreadcrumbItem` set the input and got
	// nothing: scoped styles cannot reach an element the consuming component owns. The
	// clipping box is now drawn by the component, around the projected content.
	describe('truncation with a custom template', () => {
		/**
		 * The rule that clips a label, read off the stylesheet Angular actually injected —
		 * jsdom lays nothing out, so the cascade is the only place the clipping is visible.
		 * Whitespace is dropped so the assertions do not depend on how the compiler prints.
		 */
		const truncationRuleFor = (selector: string): string | undefined =>
			Array.from(document.querySelectorAll('style'))
				.map((style) => style.textContent ?? '')
				.join('\n')
				.replace(/\s+/g, '')
				.split('}')
				.filter((rule) => rule.includes('hub-breadcrumb--truncate'))
				.find((rule) => rule.includes(selector));

		it('wraps projected content in a clipping box the component owns', () => {
			const host = TestBed.createComponent(TruncatedCustomTemplateHostComponent);
			host.detectChanges();

			const boxes = host.debugElement.queryAll(By.css('.hub-breadcrumb__item > .hub-breadcrumb__custom'));
			expect(boxes.length, 'one clipping box per crumb').toBe(3);

			for (const box of boxes) {
				expect(box.query(By.css('.custom-crumb')), 'the projected crumb sits inside it').not.toBeNull();
			}
		});

		it('clips that box exactly as it clips a built-in label', () => {
			TestBed.createComponent(TruncatedCustomTemplateHostComponent).detectChanges();

			const builtIn = truncationRuleFor('.hub-breadcrumb__link');
			const projected = truncationRuleFor('.hub-breadcrumb__custom');

			expect(builtIn, 'the built-in label is clipped').toBeDefined();
			expect(projected, 'the projected-content box is clipped by the same rule').toBe(builtIn);
			expect(projected, 'with the same max width').toContain('max-inline-size:var(--hub-breadcrumb-max-item-width,12rem)');
			expect(projected, 'and with an ellipsis').toContain('text-overflow:ellipsis');
		});

		it('gives the projected label the overflow tooltip the built-in one gets', () => {
			const host = TestBed.createComponent(TruncatedCustomTemplateHostComponent);
			host.detectChanges();

			const box = host.debugElement.query(By.css('.hub-breadcrumb__custom'));
			expect(box.injector.get(HubBreadcrumbLabelDirective, null), 'the label directive is applied').not.toBeNull();
		});
	});
});

import { NgTemplateOutlet } from '@angular/common';
import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChild,
	ElementRef,
	inject,
	Injector,
	input,
	linkedSignal,
	output,
	TemplateRef
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { HubBreadcrumbItemDirective } from '../../directives/breadcrumb-item.directive';
import { HubBreadcrumbLabelDirective } from '../../directives/breadcrumb-label.directive';
import { BreadcrumbItem } from '../../models/breadcrumb-item';
import { HubBreadcrumbsService } from '../../services/breadcrumbs.service';

/**
 * Variants with exact design-system token coverage via the SCSS `@each` loop.
 * Kept in step with that loop by hand, because Sass cannot read this file: a name
 * dropped from here is not broken, only paid for twice — once inline and once by
 * the stylesheet.
 */
const BUILT_IN_VARIANTS = new Set<string>([
	'primary',
	'secondary',
	'success',
	'danger',
	'warning',
	'info',
	'neutral',
	'light',
	'dark'
]);

/**
 * One rendered position of the trail. A `null` item is the collapsed indicator,
 * which occupies a position of its own so the separators fall around it exactly
 * as they do around a crumb.
 */
interface BreadcrumbRow {
	item: BreadcrumbItem | null;
	isLast: boolean;
	/** Resolved anchor `rel`, already defended for `_blank` targets. */
	rel: string | null;
}

@Component({
	selector: 'hub-breadcrumb',
	imports: [RouterLink, NgTemplateOutlet, HubBreadcrumbLabelDirective],
	templateUrl: './breadcrumb.component.html',
	styleUrl: './breadcrumb.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'hub-breadcrumb',
		'[class.hub-breadcrumb--truncate]': 'truncateItems()',
		'[attr.data-variant]': 'variant() ?? null',
		'[style.--hub-breadcrumb-accent]': 'customAccent()'
	}
})
export class HubBreadcrumbComponent {
	#breadcrumbsSvc = inject(HubBreadcrumbsService);
	#host = inject<ElementRef<HTMLElement>>(ElementRef);
	#injector = inject(Injector);

	readonly itemTemplate = contentChild(HubBreadcrumbItemDirective, { read: TemplateRef });

	/**
	 * Semantic accent for the breadcrumb links: `'primary'` · `'secondary'` ·
	 * `'success'` · `'danger'` · `'warning'` · `'info'` · `'neutral'` · `'light'` ·
	 * `'dark'`, or any custom string (read as `--hub-sys-color-<variant>`).
	 * Re-bases `--hub-breadcrumb-accent`; the current (last) item stays muted.
	 * Defaults to the standard link colour.
	 */
	readonly variant = input<string>();

	/**
	 * Opt-in per-item truncation. When `true`, each label is clipped to
	 * `--hub-breadcrumb-max-item-width` with an ellipsis and, if it overflows,
	 * exposes its full text as a tooltip (native `title`, or the hub-ui tooltip
	 * when {@link provideHubBreadcrumbTooltip} is wired). Off by default, so the
	 * standard breadcrumb layout is unchanged.
	 *
	 * It reaches a `hubBreadcrumbItem` template as well: the projected elements
	 * belong to the consuming component, so the template wraps them in a
	 * `span.hub-breadcrumb__custom` of its own and clips that instead.
	 */
	readonly truncateItems = input(false);

	/**
	 * Trail supplied by the consumer, replacing the one derived from the router.
	 * It is the way in for crumbs the route tree cannot express — an ancestor
	 * served by another application, or a trail assembled by hand. Left `null`,
	 * the component keeps reading {@link HubBreadcrumbsService}.
	 */
	readonly items = input<BreadcrumbItem[] | null>(null);

	/**
	 * Length above which the trail collapses behind an indicator. Undefined (the
	 * default) never collapses, however long the trail grows.
	 */
	readonly maxItems = input<number | undefined>(undefined);

	/** Crumbs kept at the head of a collapsed trail. */
	readonly itemsBeforeCollapse = input(1);

	/** Crumbs kept at the tail of a collapsed trail, the current page included. */
	readonly itemsAfterCollapse = input(1);

	/**
	 * Accessible name of the collapsed indicator. It is an input rather than a
	 * literal because it is the one string of this component a screen reader
	 * announces, and the library carries no translations of its own.
	 */
	readonly collapsedAriaLabel = input('Show the hidden breadcrumb items');

	/**
	 * Fires when the collapsed indicator is activated. The trail expands in place
	 * on its own; the event is there for consumers who want to react as well —
	 * open a menu of the hidden crumbs, log the interaction.
	 */
	readonly collapsedClick = output<void>();

	/** Effective trail: the manual one when supplied, the router's otherwise. */
	protected readonly trail = computed(() => this.items() ?? this.#breadcrumbsSvc.breadcrumbs());

	/**
	 * Whether the reader has opened a collapsed trail. Derived from the trail so a
	 * new navigation collapses it again — an expansion answers one trail, not the
	 * component's whole lifetime.
	 */
	protected readonly expanded = linkedSignal<BreadcrumbItem[], boolean>({
		source: this.trail,
		computation: () => false
	});

	/** Rendered positions, with the collapsed range folded into one indicator. */
	protected readonly rows = computed<BreadcrumbRow[]>(() => {
		const items = this.trail();
		const before = Math.max(0, this.itemsBeforeCollapse());
		const after = Math.max(0, this.itemsAfterCollapse());
		const max = this.maxItems();

		const rowAt = (item: BreadcrumbItem, index: number): BreadcrumbRow => ({
			item,
			isLast: index === items.length - 1,
			rel: this.resolveRel(item)
		});

		const collapses = max !== undefined && max > 0 && items.length > max && before + after < items.length;

		if (!collapses || this.expanded()) {
			return items.map(rowAt);
		}

		const tailStart = items.length - after;

		return [
			...items.slice(0, before).map(rowAt),
			{ item: null, isLast: false, rel: null },
			...items.slice(tailStart).map((item, index) => rowAt(item, tailStart + index))
		];
	});

	/**
	 * Inline accent for custom (non-built-in) variants — the nine built-in accents
	 * are resolved by the SCSS `@each` loop, so this returns `null` for them.
	 */
	protected readonly customAccent = computed(() => {
		const v = this.variant();
		return v && !BUILT_IN_VARIANTS.has(v) ? `var(--hub-sys-color-${v})` : null;
	});

	/** Opens a collapsed trail and lets the consumer act on the same gesture. */
	protected expand(): void {
		this.expanded.set(true);
		this.collapsedClick.emit();
		afterNextRender(() => this.#focusFirstRevealedCrumb(), { injector: this.#injector });
	}

	/**
	 * Expanding removes the indicator — the element that was holding focus — from the
	 * DOM, and a browser answers that by focusing `<body>`: whoever opened the trail
	 * from the keyboard would have to tab from the top of the page to reach the crumbs
	 * they just asked for. Focus lands on the first revealed crumb instead, which is
	 * where reading continues.
	 */
	#focusFirstRevealedCrumb(): void {
		const crumbs = this.#host.nativeElement.querySelectorAll<HTMLElement>('.hub-breadcrumb__item');
		const revealed = crumbs[Math.max(0, this.itemsBeforeCollapse())];

		if (!revealed) {
			return;
		}

		// A crumb may render as plain text — the current page, or a custom template with
		// no control of its own — and text takes no focus. Make that one crumb
		// programmatically focusable rather than let focus fall back to the body.
		const target = revealed.querySelector<HTMLElement>('a, button, [tabindex]') ?? revealed;
		if (target === revealed) {
			revealed.tabIndex = -1;
		}

		target.focus();
	}

	/**
	 * A crumb opening in a new tab hands the opener to the destination unless it
	 * says otherwise, so the default closes that door rather than leaving it to
	 * each consumer to remember.
	 */
	private resolveRel(item: BreadcrumbItem): string | null {
		return item.rel ?? (item.target === '_blank' ? 'noopener noreferrer' : null);
	}
}

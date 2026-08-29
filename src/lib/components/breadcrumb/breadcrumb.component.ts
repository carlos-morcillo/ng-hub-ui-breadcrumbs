import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChild, inject, input, linkedSignal, output, TemplateRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { HubBreadcrumbItemDirective } from '../../directives/breadcrumb-item.directive';
import { HubBreadcrumbLabelDirective } from '../../directives/breadcrumb-label.directive';
import { BreadcrumbItem } from '../../models/breadcrumb-item';
import { HubBreadcrumbsService } from '../../services/breadcrumbs.service';

/** Variants with exact design-system token coverage via the SCSS `@each` loop. */
const BUILT_IN_VARIANTS = new Set<string>(['primary', 'success', 'danger', 'warning', 'info']);

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
	host: {
		class: 'hub-breadcrumb',
		'[class.hub-breadcrumb--truncate]': 'truncateItems()',
		'[attr.data-variant]': 'variant() ?? null',
		'[style.--hub-breadcrumb-accent]': 'customAccent()'
	}
})
export class HubBreadcrumbComponent {
	#breadcrumbsSvc = inject(HubBreadcrumbsService);

	readonly itemTemplate = contentChild(HubBreadcrumbItemDirective, { read: TemplateRef });

	breadcrumbs$ = this.#breadcrumbsSvc.breadcrumbs$;

	/**
	 * Semantic accent for the breadcrumb links: `'primary'` · `'success'` ·
	 * `'danger'` · `'warning'` · `'info'`, or any custom string (read as
	 * `--hub-sys-color-<variant>`). Re-bases `--hub-breadcrumb-accent`; the
	 * current (last) item stays muted. Defaults to the standard link colour.
	 */
	readonly variant = input<string>();

	/**
	 * Opt-in per-item truncation. When `true`, each label is clipped to
	 * `--hub-breadcrumb-max-item-width` with an ellipsis and, if it overflows,
	 * exposes its full text as a tooltip (native `title`, or the hub-ui tooltip
	 * when {@link provideHubBreadcrumbTooltip} is wired). Off by default, so the
	 * standard breadcrumb layout is unchanged.
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

	/** Trail as published by the service, tracked as a signal. */
	readonly #routerTrail = toSignal(this.breadcrumbs$, { initialValue: [] as BreadcrumbItem[] });

	/** Effective trail: the manual one when supplied, the router's otherwise. */
	protected readonly trail = computed(() => this.items() ?? this.#routerTrail());

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
	 * Inline accent for custom (non-built-in) variants — the built-in five are
	 * resolved by the SCSS `@each` loop, so this returns `null` for them.
	 */
	protected readonly customAccent = computed(() => {
		const v = this.variant();
		return v && !BUILT_IN_VARIANTS.has(v) ? `var(--hub-sys-color-${v})` : null;
	});

	/** Opens a collapsed trail and lets the consumer act on the same gesture. */
	protected expand(): void {
		this.expanded.set(true);
		this.collapsedClick.emit();
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

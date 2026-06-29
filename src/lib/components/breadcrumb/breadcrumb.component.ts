import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChild, inject, input, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HubBreadcrumbItemDirective } from '../../directives/breadcrumb-item.directive';
import { HubBreadcrumbLabelDirective } from '../../directives/breadcrumb-label.directive';
import { HubBreadcrumbsService } from '../../services/breadcrumbs.service';

/** Variants with exact design-system token coverage via the SCSS `@each` loop. */
const BUILT_IN_VARIANTS = new Set<string>(['primary', 'success', 'danger', 'warning', 'info']);

@Component({
	selector: 'hub-breadcrumb',
	imports: [AsyncPipe, RouterLink, NgTemplateOutlet, HubBreadcrumbLabelDirective],
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
	 * Inline accent for custom (non-built-in) variants — the built-in five are
	 * resolved by the SCSS `@each` loop, so this returns `null` for them.
	 */
	protected readonly customAccent = computed(() => {
		const v = this.variant();
		return v && !BUILT_IN_VARIANTS.has(v) ? `var(--hub-sys-color-${v})` : null;
	});
}

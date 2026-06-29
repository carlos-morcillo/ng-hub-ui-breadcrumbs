import { afterNextRender, Directive, effect, ElementRef, inject, input, OnDestroy, signal } from '@angular/core';
import { HUB_BREADCRUMB_TOOLTIP_ADAPTER } from '../breadcrumb-tooltip/breadcrumb-tooltip.token';
import { HubBreadcrumbTooltipHandle } from '../breadcrumb-tooltip/breadcrumb-tooltip.types';

/**
 * Adds an overflow-aware tooltip to a breadcrumb label element.
 *
 * Apply `[hubBreadcrumbLabel]` to the link/text of each breadcrumb item. When the
 * label is truncated (its rendered text is wider than its box — typically because
 * `hub-breadcrumb` truncation is enabled), the directive exposes the full text as
 * a tooltip: the native `title` attribute by default, or the richer hub-ui
 * tooltip when a {@link HUB_BREADCRUMB_TOOLTIP_ADAPTER} is provided. When the
 * label fits, no tooltip is shown.
 */
@Directive({
	selector: '[hubBreadcrumbLabel]'
})
export class HubBreadcrumbLabelDirective implements OnDestroy {
	/**
	 * Explicit tooltip text. When empty, the host's own text content is used, but
	 * only while it is truncated.
	 */
	readonly tooltip = input('', { alias: 'hubBreadcrumbLabel' });

	private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

	/** Optional hub-ui tooltip adapter; absent means native `title` fallback. */
	private readonly adapter = inject(HUB_BREADCRUMB_TOOLTIP_ADAPTER, { optional: true });

	/** Whether the rendered label is wider than its clipping box. */
	private readonly isOverflowing = signal(false);

	/** Trimmed text content of the label, used as the auto tooltip source. */
	private readonly text = signal('');

	/** Becomes true once the browser-only overflow tracking is wired. */
	private readonly ready = signal(false);

	private resizeObserver: ResizeObserver | null = null;
	private mutationObserver: MutationObserver | null = null;
	private handle: HubBreadcrumbTooltipHandle | null = null;

	constructor() {
		afterNextRender(() => this.initOverflowTracking());

		effect(() => {
			if (!this.ready()) {
				return;
			}
			const explicit = this.tooltip().trim();
			const text = explicit || (this.isOverflowing() ? this.text() : '');
			this.applyTooltip(text);
		});
	}

	ngOnDestroy(): void {
		this.resizeObserver?.disconnect();
		this.mutationObserver?.disconnect();
		this.handle?.destroy();
		this.handle = null;
	}

	/** Wires browser-only observers that keep the truncation state in sync. */
	private initOverflowTracking(): void {
		const el = this.host.nativeElement;
		this.measure(el);

		if (typeof ResizeObserver !== 'undefined') {
			this.resizeObserver = new ResizeObserver(() => this.measure(el));
			this.resizeObserver.observe(el);
		}

		if (typeof MutationObserver !== 'undefined') {
			this.mutationObserver = new MutationObserver(() => this.measure(el));
			this.mutationObserver.observe(el, { childList: true, characterData: true, subtree: true });
		}

		this.ready.set(true);
	}

	/** Reads the host's text and truncation state into the signals. */
	private measure(el: HTMLElement): void {
		this.text.set((el.textContent ?? '').trim());
		this.isOverflowing.set(el.scrollWidth > el.clientWidth + 1);
	}

	/**
	 * Applies the effective tooltip text through the hub-ui adapter when present,
	 * or the native `title` attribute otherwise. An empty text removes both.
	 */
	private applyTooltip(text: string): void {
		const el = this.host.nativeElement;

		if (this.adapter) {
			el.removeAttribute('title');
			if (text) {
				if (this.handle) {
					this.handle.update(text);
				} else {
					this.handle = this.adapter.attach(el, text);
				}
			} else if (this.handle) {
				this.handle.destroy();
				this.handle = null;
			}
			return;
		}

		if (text) {
			el.setAttribute('title', text);
		} else {
			el.removeAttribute('title');
		}
	}
}

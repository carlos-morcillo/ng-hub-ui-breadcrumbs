/**
 * Live handle returned by {@link HubBreadcrumbTooltipAdapter.attach}, used by the
 * breadcrumb label directive to update or tear down its tooltip.
 */
export interface HubBreadcrumbTooltipHandle {
	/** Updates the tooltip label. An empty string disables the tooltip. */
	update(text: string): void;
	/** Detaches the tooltip and releases its listeners. */
	destroy(): void;
}

/**
 * Optional, structurally-typed tooltip provider consumed by the breadcrumb label
 * directive.
 *
 * The contract is intentionally tiny and defined here (not imported from another
 * package) so `ng-hub-ui-breadcrumbs` keeps **zero hard dependencies**: when no
 * adapter is provided, truncated labels fall back to the native `title`
 * attribute; when one is provided every truncated label upgrades to the richer
 * tooltip automatically.
 *
 * `ng-hub-ui-utils` ships a ready-made implementation (`hubTooltipAdapter`) that
 * matches this shape.
 */
export interface HubBreadcrumbTooltipAdapter {
	/**
	 * Attaches a tooltip to `host` with the given initial `text`.
	 * @returns A handle to update or destroy the tooltip.
	 */
	attach(host: HTMLElement, text: string): HubBreadcrumbTooltipHandle;
}

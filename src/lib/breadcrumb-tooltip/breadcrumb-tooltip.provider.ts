import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { HUB_BREADCRUMB_TOOLTIP_ADAPTER } from './breadcrumb-tooltip.token';
import { HubBreadcrumbTooltipAdapter } from './breadcrumb-tooltip.types';

/**
 * Registers a tooltip adapter so truncated breadcrumb labels render the rich
 * hub-ui tooltip instead of the native `title` fallback.
 *
 * ```ts
 * import { provideHubBreadcrumbTooltip } from 'ng-hub-ui-breadcrumbs';
 * import { hubTooltipAdapter } from 'ng-hub-ui-utils';
 *
 * providers: [provideHubBreadcrumbTooltip(hubTooltipAdapter)];
 * ```
 *
 * @param adapter Tooltip adapter implementation (e.g. `hubTooltipAdapter` from
 *                `ng-hub-ui-utils`).
 * @returns Environment providers to add to the application config.
 */
export function provideHubBreadcrumbTooltip(adapter: HubBreadcrumbTooltipAdapter): EnvironmentProviders {
	return makeEnvironmentProviders([
		{
			provide: HUB_BREADCRUMB_TOOLTIP_ADAPTER,
			useValue: adapter
		}
	]);
}

import { InjectionToken } from '@angular/core';
import { HubBreadcrumbTooltipAdapter } from './breadcrumb-tooltip.types';

/**
 * Injection token resolving the optional tooltip adapter used by truncated
 * breadcrumb labels.
 *
 * Inject it with `{ optional: true }`; a `null` value means "use the native
 * `title` fallback". Register it through {@link provideHubBreadcrumbTooltip}.
 */
export const HUB_BREADCRUMB_TOOLTIP_ADAPTER = new InjectionToken<HubBreadcrumbTooltipAdapter>('HUB_BREADCRUMB_TOOLTIP_ADAPTER');

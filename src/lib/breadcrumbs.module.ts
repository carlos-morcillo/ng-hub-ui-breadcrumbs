import { NgModule } from '@angular/core';
import { HubBreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { HubBreadcrumbItemDirective } from './directives/breadcrumb-item.directive';

/**
 * Backward-compatibility module for NgModule-based applications.
 *
 * @deprecated Import the standalone `HubBreadcrumbComponent` and `HubBreadcrumbItemDirective`
 * directly; this module only re-exports them and provides nothing of its own. Scheduled for
 * removal in **23.0.0**.
 */
@NgModule({
	declarations: [],
	imports: [HubBreadcrumbComponent, HubBreadcrumbItemDirective],
	exports: [HubBreadcrumbComponent, HubBreadcrumbItemDirective]
})
export class HubBreadcrumbsModule {}

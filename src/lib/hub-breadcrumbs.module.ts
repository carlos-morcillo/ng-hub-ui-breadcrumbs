import { NgModule } from '@angular/core';
import { HubBreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { HubBreadcrumbItemDirective } from './directives/breadcrumb-item.directive';

@NgModule({
	declarations: [],
	imports: [HubBreadcrumbsComponent, HubBreadcrumbItemDirective],
	exports: [HubBreadcrumbsComponent, HubBreadcrumbItemDirective]
})
export class HubBreadcrumbsModule {}

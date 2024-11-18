import { NgModule } from '@angular/core';
import { HubBreadcrumbsComponent } from './components/hub-breadcrumbs/hub-breadcrumbs.component';
import { HubBreadcrumbItemDirective } from './directives/hub-breadcrumb-item.directive';

@NgModule({
	declarations: [],
	imports: [HubBreadcrumbsComponent, HubBreadcrumbItemDirective],
	exports: [HubBreadcrumbsComponent, HubBreadcrumbItemDirective]
})
export class HubBreadcrumbsModule {}

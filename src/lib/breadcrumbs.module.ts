import { NgModule } from '@angular/core';
import { HubBreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { HubBreadcrumbItemDirective } from './directives/breadcrumb-item.directive';

@NgModule({
	declarations: [],
	imports: [HubBreadcrumbComponent, HubBreadcrumbItemDirective],
	exports: [HubBreadcrumbComponent, HubBreadcrumbItemDirective]
})
export class HubBreadcrumbsModule {}

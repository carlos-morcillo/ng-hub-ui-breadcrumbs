import { Directive, inject, TemplateRef } from '@angular/core';
import { BreadcrumbTemplateContext } from '../models/breadcrumb-template-context';

@Directive({
	selector: '[hubBreadcrumbItem]'
})
export class HubBreadcrumbItemDirective {
	template = inject(TemplateRef<BreadcrumbTemplateContext>);
}

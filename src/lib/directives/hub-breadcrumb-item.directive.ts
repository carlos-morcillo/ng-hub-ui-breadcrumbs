import { Directive, inject, TemplateRef } from '@angular/core';
import { BreadcrumbTemplateContext } from '../types/breadcrumb-template-context';

@Directive({
	selector: '[hubBreadcrumbItem]',
	standalone: true
})
export class HubBreadcrumbItemDirective {
	template = inject(TemplateRef<BreadcrumbTemplateContext>);
}

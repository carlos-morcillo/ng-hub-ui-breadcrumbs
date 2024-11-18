import { BreadcrumbItem } from './breadcrumb-item';

export interface BreadcrumbTemplateContext {
	$implicit: BreadcrumbItem;
	isLast: boolean;
}

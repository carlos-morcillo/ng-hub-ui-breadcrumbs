import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, inject, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HubBreadcrumbItemDirective } from '../../directives/breadcrumb-item.directive';
import { HubBreadcrumbsService } from '../../services/breadcrumbs.service';

@Component({
	selector: 'hub-breadcrumb',
	imports: [AsyncPipe, RouterLink, NgTemplateOutlet],
	templateUrl: './breadcrumb.component.html',
	styleUrl: './breadcrumb.component.scss',
	host: {
		class: 'hub-breadcrumb'
	}
})
export class HubBreadcrumbComponent {
	#breadcrumbsSvc = inject(HubBreadcrumbsService);

	readonly itemTemplate = contentChild(HubBreadcrumbItemDirective, { read: TemplateRef });

	breadcrumbs$ = this.#breadcrumbsSvc.breadcrumbs$;
}

import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HubBreadcrumbItemDirective } from '../../directives/breadcrumb-item.directive';
import { HubBreadcrumbsService } from '../../services/breadcrumbs.service';

@Component({
	selector: 'hub-breadcrumbs',
	imports: [AsyncPipe, RouterLink, NgTemplateOutlet],
	templateUrl: './breadcrumbs.component.html',
	styleUrl: './breadcrumbs.component.scss',
	host: {
		class: 'hub-breadcrumbs'
	}
})
export class HubBreadcrumbsComponent {
	#breadcrumbsSvc = inject(HubBreadcrumbsService);

	@ContentChild(HubBreadcrumbItemDirective)
	itemTemplate?: HubBreadcrumbItemDirective;

	breadcrumbs$ = this.#breadcrumbsSvc.breadcrumbs$;
}

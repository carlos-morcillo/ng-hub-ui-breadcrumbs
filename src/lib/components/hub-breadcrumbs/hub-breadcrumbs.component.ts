import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HubBreadcrumbItemDirective } from '../../directives/hub-breadcrumb-item.directive';
import { HubBreadcrumbsService } from '../../services/hub-breadcrumbs.service';

@Component({
	selector: 'hub-breadcrumbs',
	standalone: true,
	imports: [AsyncPipe, RouterLink, NgTemplateOutlet],
	templateUrl: './hub-breadcrumbs.component.html',
	styleUrl: './hub-breadcrumbs.component.scss',
	host: {
		class: 'hub-breadcrumb'
	}
})
export class HubBreadcrumbsComponent {
	#breadcrumbsSvc = inject(HubBreadcrumbsService);

	@ContentChild(HubBreadcrumbItemDirective)
	itemTemplate?: HubBreadcrumbItemDirective;

	breadcrumbs$ = this.#breadcrumbsSvc.breadcrumbs$;
}

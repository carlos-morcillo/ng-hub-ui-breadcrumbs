import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubBreadcrumbComponent } from './hub-breadcrumb.component';

describe('HubBreadcrumbComponent', () => {
  let component: HubBreadcrumbComponent;
  let fixture: ComponentFixture<HubBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubBreadcrumbComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HubBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubBreadcrumbsComponent } from './breadcrumbs.component';

describe('HubBreadcrumbsComponent', () => {
  let component: HubBreadcrumbsComponent;
  let fixture: ComponentFixture<HubBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubBreadcrumbsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HubBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

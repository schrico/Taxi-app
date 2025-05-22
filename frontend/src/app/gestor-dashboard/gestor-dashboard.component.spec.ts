import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorDashboardComponent } from './gestor-dashboard.component';

describe('GestorDashboardComponent', () => {
  let component: GestorDashboardComponent;
  let fixture: ComponentFixture<GestorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestorDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

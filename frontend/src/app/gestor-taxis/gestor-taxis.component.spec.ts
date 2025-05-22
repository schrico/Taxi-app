import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorTaxisComponent } from './gestor-taxis.component';

describe('GestorTaxisComponent', () => {
  let component: GestorTaxisComponent;
  let fixture: ComponentFixture<GestorTaxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestorTaxisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestorTaxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

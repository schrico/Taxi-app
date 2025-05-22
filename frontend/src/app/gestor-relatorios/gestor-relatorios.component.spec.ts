import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorRelatoriosComponent } from './gestor-relatorios.component';

describe('GestorRelatoriosComponent', () => {
  let component: GestorRelatoriosComponent;
  let fixture: ComponentFixture<GestorRelatoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestorRelatoriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestorRelatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

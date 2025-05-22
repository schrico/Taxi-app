import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorMotoristasComponent } from './gestor-motoristas.component';

describe('GestorMotoristasComponent', () => {
  let component: GestorMotoristasComponent;
  let fixture: ComponentFixture<GestorMotoristasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestorMotoristasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestorMotoristasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

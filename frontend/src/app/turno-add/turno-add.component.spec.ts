import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoAddComponent } from './turno-add.component';

describe('TurnoAddComponent', () => {
  let component: TurnoAddComponent;
  let fixture: ComponentFixture<TurnoAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

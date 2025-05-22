import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaAddComponent } from './motorista-add.component';

describe('MotoristaAddComponent', () => {
  let component: MotoristaAddComponent;
  let fixture: ComponentFixture<MotoristaAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotoristaAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotoristaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

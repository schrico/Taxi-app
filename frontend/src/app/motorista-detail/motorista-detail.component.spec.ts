import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaDetailComponent } from './motorista-detail.component';

describe('MotoristaDetailComponent', () => {
  let component: MotoristaDetailComponent;
  let fixture: ComponentFixture<MotoristaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotoristaDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotoristaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

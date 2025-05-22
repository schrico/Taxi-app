import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiAddComponent } from './taxi-add.component';

describe('TaxiAddComponent', () => {
  let component: TaxiAddComponent;
  let fixture: ComponentFixture<TaxiAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxiAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

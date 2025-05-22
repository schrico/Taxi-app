import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiPedidoComponent } from './taxi-pedido.component';

describe('TaxiPedidoComponent', () => {
  let component: TaxiPedidoComponent;
  let fixture: ComponentFixture<TaxiPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxiPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaPedidoComponent } from './motorista-pedido.component';

describe('MotoristaPedidoComponent', () => {
  let component: MotoristaPedidoComponent;
  let fixture: ComponentFixture<MotoristaPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotoristaPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotoristaPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

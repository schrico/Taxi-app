import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoAcompanhamentoComponent } from './pedido-acompanhamento.component';

describe('PedidoAcompanhamentoComponent', () => {
  let component: PedidoAcompanhamentoComponent;
  let fixture: ComponentFixture<PedidoAcompanhamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoAcompanhamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidoAcompanhamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

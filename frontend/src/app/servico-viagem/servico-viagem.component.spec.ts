import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicoViagemComponent } from './servico-viagem.component';

describe('ServicoViagemComponent', () => {
  let component: ServicoViagemComponent;
  let fixture: ComponentFixture<ServicoViagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicoViagemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicoViagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

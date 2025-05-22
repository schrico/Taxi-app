import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicoAddComponent } from './servico-add.component';

describe('ServicoAddComponent', () => {
  let component: ServicoAddComponent;
  let fixture: ComponentFixture<ServicoAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicoAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

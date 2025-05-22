import { Component, OnInit } from '@angular/core';
import { Motorista } from '../motorista';
import { MotoristaService } from '../motorista.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TurnoService } from '../turno.service';


@Component({
  selector: 'app-motorista-dashboard',
  templateUrl: './motorista-dashboard.component.html',
  standalone: false,
  styleUrl: './motorista-dashboard.component.css'
})
export class MotoristaDashboardComponent implements OnInit {
  motorista: Motorista | undefined;
  turnos: any[] = [];
  now = new Date();

  constructor(
    private route: ActivatedRoute,
    private motoristaService: MotoristaService,
    private turnoService: TurnoService,
    private router: Router,
  ) {}

  abrirTurnoAdd() {
    this.router.navigate(['/turnos/add'], { queryParams: { motoristaId: this.motorista?._id } });
  }

  abrirPedidoTaxi() {
    this.router.navigate(['/motorista-pedido'], { queryParams: { motoristaId: this.motorista?._id } });
}

  abrirRegistarViagem() {
    this.router.navigate(['/registar-viagem'], { queryParams: { motoristaId: this.motorista?._id } });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const nif = params['nif'];
      if (nif) {
        this.motoristaService.getMotoristas().subscribe(motoristas => {
          this.motorista = motoristas.find(m => m.nif.toString() === nif);
          if (this.motorista?._id) {
            this.turnoService.getTurnosByMotorista(this.motorista._id.toString()).subscribe(turnos => {
              this.turnos = turnos;
            });
          }
        });
      }
    });

    if (this.motorista?._id) {
    this.turnoService.getTurnosByMotorista(this.motorista._id.toString()).subscribe(turnos => {
      this.turnos = turnos.map(turno => {
        return {
          ...turno,
          inicio: new Date(turno.inicio),
          fim: new Date(turno.fim)
        };
      });
    });
  }

    setInterval(() => {
      this.now = new Date();
    }, 60000);
  }

  convertToDate(dateString: any): Date {
    return new Date(dateString);
  }
}

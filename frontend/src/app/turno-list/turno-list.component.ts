import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../turno.service';

@Component({
  selector: 'app-turno-list',
  templateUrl: './turno-list.component.html',
  standalone: false,
  styleUrls: ['./turno-list.component.css']
})
export class TurnoListComponent implements OnInit {
  turnos: any[] = [];
  motoristaId: string = '123'; // Substitua pelo ID do motorista atual

  constructor(private turnoService: TurnoService) {}

  ngOnInit(): void {
    this.turnoService.getTurnosByMotorista(this.motoristaId).subscribe(turnos => {
      this.turnos = turnos;
    });
  }
}
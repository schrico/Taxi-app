import { Component, OnInit } from '@angular/core';
import { Motorista } from '../motorista';
import { MotoristaService } from '../motorista.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-motoristas',
  standalone: false,
  templateUrl: './motoristas.component.html',
  styleUrls: ['./motoristas.component.css']
})
export class MotoristasComponent implements OnInit {
  motoristas: Motorista[] = [];

  constructor(
    private motoristaService: MotoristaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getMotoristas();
  }

  getMotoristas(): void {
    this.motoristaService.getMotoristas()
      .subscribe(motoristas => {
        this.motoristas = motoristas.sort((a,b) => {
          if(a._id > b._id) return -1;
          if(a._id < b._id) return 1;
          return 0;
        });
      });
  }

  navigateToAddMotorista(): void {
    this.router.navigate(['/motoristas/add']);
  }
}

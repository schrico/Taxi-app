import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Motorista } from '../motorista';
import { MotoristaService } from '../motorista.service';

@Component({
  selector: 'app-motorista-detail',
  standalone: false,
  templateUrl: './motorista-detail.component.html',
  styleUrls: ['./motorista-detail.component.css']
})
export class MotoristaDetailComponent implements OnInit {
  motorista: Motorista | undefined;

  constructor(
    private route: ActivatedRoute,
    private motoristaService: MotoristaService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getMotorista();
  }

  getMotorista(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.motoristaService.getMotorista(id)
        .subscribe(motorista => this.motorista = motorista);
    }
  }

  goBack(): void {
    this.location.back();
  }
}

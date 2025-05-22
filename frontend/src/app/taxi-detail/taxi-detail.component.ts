import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Taxi } from '../taxi';
import { TaxiService } from '../taxi.service';

@Component({
  selector: 'app-taxi-detail',
  standalone: false,
  templateUrl: './taxi-detail.component.html',
  styleUrls: ['./taxi-detail.component.css']
})
export class TaxiDetailComponent implements OnInit {
  taxi: Taxi | undefined;

  constructor(
    private route: ActivatedRoute,
    private taxiService: TaxiService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getTaxi();
  }

  getTaxi(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taxiService.getTaxi(id)
        .subscribe(taxi => this.taxi = taxi);
    }
  }

  goBack(): void {
    this.location.back();
  }
} 
import { Component, OnInit } from '@angular/core';
import { Taxi } from '../taxi';
import { TaxiService } from '../taxi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-taxis',
  standalone: false,
  templateUrl: './taxis.component.html',
  styleUrls: ['./taxis.component.css']
})
export class TaxisComponent implements OnInit {
  taxis: Taxi[] = [];

  constructor(private taxiService: TaxiService, private router: Router) { }

  ngOnInit(): void {
    this.getTaxis();
  }

  getTaxis(): void {
    this.taxiService.getTaxis()
      .subscribe(taxis => {
        this.taxis = taxis.sort((a,b) => {
          if(a._id > b._id) return -1;
          if(a._id < b._id) return 1;
          return 0;
        });
      });
  }

  navigateToAddTaxi(): void {
    this.router.navigate(['/taxis/addtaxi']);
  }
} 
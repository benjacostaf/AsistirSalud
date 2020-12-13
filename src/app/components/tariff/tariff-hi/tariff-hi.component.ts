import { Component, OnInit } from '@angular/core';
import { HealthInsurance } from 'src/app/models/healthInsurance';
import { HealthInsuranceService } from 'src/app/services/health-insurance.service';

@Component({
  selector: 'app-tariff-hi',
  templateUrl: './tariff-hi.component.html',
  styleUrls: ['./tariff-hi.component.scss']
})
export class TariffHiComponent implements OnInit {

  public hIData:HealthInsurance[] = [];
  public selectHI:HealthInsurance;

  constructor(
    private _hiService: HealthInsuranceService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getHI();
    console.log(this.hIData);
  }

  getHI():Promise<HealthInsurance>{
    return new Promise(resolve=>{
      this._hiService.getHealthInsurance().subscribe((hi:any)=>{
        resolve(this.hIData = hi['HealthInsurances']);
      })
    })    
  }

}

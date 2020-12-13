import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Benefit} from '../models/benefit';
import { BenefitItem } from '../models/benefitItem';

@Injectable({
  providedIn: 'root'
})
export class BenefitService {
  /* public url = 'https://api.asistirsalud.com.ar/api/benefit'; */
  public url = 'http://localhost:8000/api/benefit';
  constructor(
    private http: HttpClient
  ) { }

  getBenefits():Observable<any>{
    return this.http.get(this.url);
  }

  getBenefit(id_b:number):Observable<any>{
    return this.http.get(this.url+"/"+id_b);
  }

  getBenefitsByLender(id_lender:number):Observable<any>{
    return this.http.get(this.url+"/bylender/"+id_lender);
  }

  newBenefit(bnft: Benefit):Observable<any>{
    console.log(bnft);
    const body = new HttpParams()
    .set('id_patient', (bnft.id_patient).toString())
    .set('diagnosis', bnft.diagnosis)
    .set('start_at', bnft.start_at)
    .set('finish_at', bnft.finish_at)
    .set('status', '1')

    console.log(body);
    return this.http.post(this.url + "/register",
    body.toString(),
    { headers: new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
  });
  }



  newBenefitItem(item: BenefitItem):Observable<any>{
    console.log(item);
    const body = new HttpParams()
    .set('id_benefit', ((item.id_benefit)).toString())
    .set('id_lender', (item.id_lender).toString())
    .set('requirements', item.requirements)
    .set('indications', item.indications)
    .set('hours', (item.hours).toString())
    .set('status', '1')

    return this.http.post(this.url+ "/register/item",
    body.toString(),
    {headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  });
  }

  getLastBenefit():Observable<any>{
    return this.http.get(this.url+"/last");
  }

  getItemsBenefit(id_benefit:number):Observable<any>{
    return this.http.get(this.url+"/itemsbenefit/"+id_benefit);
  }

  deleteBenefitData(id_benefit:number):Observable<any>{
    const body = new HttpParams()
    .set('id_benefit', ((id_benefit)).toString())
    return this.http.post(this.url + "/delete",
      body.toString(),
      {headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }

  deleteBenefitItem(id_item:number):Observable<any>{
    const body = new HttpParams()
    .set('id_item', ((id_item).toString()))
    return this.http.post(this.url + "/item/delete",
    body.toString(),
    {headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  });
  }

  /* updateAll(b:Benefit,i:BenefitItem[]){
    this.updateBenefit(b);
    this.updateItems(i);
  } */

  updateBenefit(b:Benefit){
    console.log(b);
    const body = new HttpParams()
    .set('id', ((b.id).toString()))
    .set('id_patient', ((b.id_patient).toString()))
    .set('diagnosis', (b.diagnosis))
    .set('start_at', (b.start_at))
    .set('finish_at', (b.finish_at))
    .set('status', (b.status).toString())
    return this.http.post(this.url+ "/update",
    body.toString(),
    {headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  });
  }

  updateItem(item:BenefitItem):Observable<any>{
      const body = new HttpParams()
      .set('id', (item.id).toString())
      .set('id_benefit', (item.id_benefit).toString())
      .set('id_lender', (item.id_lender).toString())
      .set('requirements', (item.requirements))
      .set('indications', (item.indications))
      .set('hours', (item.hours).toString())
      .set('status', (item.status).toString())
      return this.http.post(this.url+ "/item/update",
      body.toString(),
      {headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }
}

import { Injectable } from '@angular/core';



export interface location{
  longitude:number,
  latitude: number
}


@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  geolocation:location;
  constructor() { }

  getPosition():Promise<any>{
    return new Promise(resolve=>{
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(resp => {
          resolve(this.geolocation={
            latitude: resp.coords.latitude,
            longitude: resp.coords.longitude
          })
        });
        console.log(this.geolocation);
      } else {
        console.log("Geo Location not supported by browser");
      }
    });
  }

   //function that retrieves the position
  showPosition(position){
    const location = {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude      
    }
    this.geolocation = location;
  }

  async getLocation(){
    await this.getPosition();    
  }
}

import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

declare var H: any;
@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.scss']
})
export class MapDialogComponent implements OnInit {  
  public longitude;
  public latitude;
  public errorMap:boolean=true;
  constructor(
    @Inject(MAT_DIALOG_DATA)public item:any,    
  ) { }

  async ngOnInit(): Promise<void> {
    console.log(this.item);
    this.longitude = this.item.geo_long;
    this.latitude = this.item.geo_lat;
    await this.initHereMapService();    
    console.log(H);
  }

  async initHereMapService(){
    try{
      
      let platform = new H.service.Platform({
        'apikey': 'xiTufFyws4Aai2la4Q6nt25GcFJY61duosRKGAP8B98'
      })
      var maptypes = platform.createDefaultLayers();
      this.errorMap=false;
      // Instantiate (and display) a map object:
      var map = new H.Map(
        document.getElementById('itemMap'),
        maptypes.vector.normal.map,
        {
          zoom: 15,
          center: { lng: this.longitude, lat: this.latitude }
        });
  
      var icon = new H.map.Icon('./assets/favicon.png');
  
      var marker =  new H.map.Marker({ lat: this.latitude, lng: this.longitude }, { icon: icon });
        console.log(map);
      map.addObject(marker);      
    }catch(e){
      this.errorMap = true;
      console.log('error');      
        document.getElementById('map-container').setAttribute("style","display:none;");      
    }
    
  }

  refreshSite(){
    window.location.reload();
  }

}

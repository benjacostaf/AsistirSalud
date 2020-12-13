import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'benefitStatus'
})
export class BenefitsPipe implements PipeTransform {

  transform(value: number):string{
/*
    {value: 0, display: 'Eliminado'},
    {value: 1, display: 'Activo'},
    {value: 2, display: 'Inactivo'},
    {value: 3, display: 'Difunto'},
    {value: 4, display: 'Completado'},
    {value: 5, display: 'Cobrado'},
    {value: 6, display: 'Cobro pendiente'} */
    let ret;
    switch (value) {
      case 0:
        ret = 'Eliminado'
        break;
      case 1:
        ret = 'Activo'
        break;
      case 2:
        ret = 'Inactivo'
        break;
      case 3:
        ret = 'Difunto'
        break;
      case 4:
        ret = 'Completado'
        break;
      case 5:
        ret = 'Cobrado'
        break;
      case 6:
        ret = 'Cobro pendiente'
        break;
        case 7:
          ret = 'Prestador eliminado'
      default:
        ret = 'Activo'
        break;
    }
    return ret;
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'benefitStatus'
})
export class BenefitsPipe implements PipeTransform {

  transform(value: number):string{
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
      break;
      case 8:
        ret = 'Paciente eliminado'
      break;
      case 9:
        ret = 'Prestación eliminada'
      break;

      default:
        ret = 'Activo'
        break;
    }
    return ret;
  }

}

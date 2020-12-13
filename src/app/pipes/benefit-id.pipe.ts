import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'benefitId'
})
export class BenefitIdPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

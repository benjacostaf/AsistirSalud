import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datetime'
})
export class DatetimePipe implements PipeTransform {

  transform(value:Date):string{
    console.log(value);
    const y = value.getFullYear();
    console.log(y);
    const m = value.getMonth();
    console.log(m);
    const d = value.getDate();
    console.log(d);

    const hs = value.getHours();
    const min = value.getMinutes();
    const sec = value.getSeconds();

    const date = `${d}/${m+1}/${y} - ${hs}:${min}:${sec}`
    console.log(date);
    return date;
  }

}

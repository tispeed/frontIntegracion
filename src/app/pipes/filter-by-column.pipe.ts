import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByColumn'
})
export class FilterByColumnPipe implements PipeTransform {
  transform(items: Array<any>, filter: {[key: string]: any }): Array<any> {
      return items.filter(item => {
            let notMatchingField = filter? Object.keys(filter)
                //.find(key => item[key].toString().toUpperCase() !== filter[key].toUpperCase() && filter[key]!=''): null;
                .find(key => item[key] && !item[key].toString().toUpperCase().includes(filter[key].toUpperCase()) && filter[key]!=''): null;
            return !notMatchingField; // true if matches all fields
        });
  }
}
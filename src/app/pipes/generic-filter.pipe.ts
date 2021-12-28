import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'genericFilter'
})
export class GenericFilterPipe implements PipeTransform {	
	transform(items: any[], searchText: string): any[] {
		if(!items) return [];
		if(!searchText) return items;
		searchText = searchText.toLowerCase();
		return items.filter( element => {
			const keys=Object.keys(element);
			for(let key of keys){
				if(element[key] && element[key].toString().toLowerCase().includes(searchText)) return element
			}
		});
	}
}
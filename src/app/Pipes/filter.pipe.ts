import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: any): any[] {
    if (!items || !field) {
      return items;
    }
    
    return items.filter(item => {
      const itemValue = this.getPropertyByPath(item, field);
      return itemValue === value;
    });
  }
  
  private getPropertyByPath(obj: any, path: string): any {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  }
} 
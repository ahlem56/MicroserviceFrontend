import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum',
  standalone: true
})
export class SumPipe implements PipeTransform {
  transform(items: any[], field: string): number {
    if (!items || !field) {
      return 0;
    }
    
    return items.reduce((sum, item) => {
      const value = this.getPropertyByPath(item, field);
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
  }
  
  private getPropertyByPath(obj: any, path: string): any {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  }
} 
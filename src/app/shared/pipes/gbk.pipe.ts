import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'gbk' })
export class GbkFormat implements PipeTransform {
    transform(value: string): string {
      return encodeURIComponent(value)
    }
}

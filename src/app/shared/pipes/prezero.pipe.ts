import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'prezero' })
export class Prezero implements PipeTransform {
    transform(value: number): string {
        const str = value.toString();
        return str.length > 1 ? str : ('0' + str)
    }
}

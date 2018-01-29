import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'date' })
export class DatePipe implements PipeTransform {
    transform(str: string | number, format: string): string {
        const $date = typeof str === 'string' ? parseInt(str) : str;

        return moment && moment($date).format(format);
    }
}

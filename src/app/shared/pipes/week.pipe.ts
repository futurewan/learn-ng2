import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'week' })
export class WeekPip implements PipeTransform {
    transform(str: string): string {
        let chweek: string;
        switch (str) {
            case "Monday":
                chweek = "星期一"; break;
            case "Tuesday":
                chweek = "星期二"; break;
            case "Wednesday":
                chweek = "星期三"; break;
            case "Thursday":
                chweek = "星期四"; break;
            case "Friday ":
                chweek = "星期五"; break;
            case "Saturday":
                chweek = "星期六"; break;
            case "Sunday":
                chweek = "星期日"; break;
        }
        return chweek;
    }
}

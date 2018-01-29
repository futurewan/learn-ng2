import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'privacy' })
export class PrivacyPip implements PipeTransform {
    // 如果end不传，就一直到最后一位
    transform(str: string, start: number, length?: number,replacestr?:string): string {
        if (!str) { return ''; }
        const s = str.toString();
        let l = length;  // 需要替换个数
        let x = '';
        if (!l || l + start > s.length) { l = s.length - start; }
        for (let i = 0; i < l; i++) {
            x += replacestr || '*';
        }
        return s.substr(0, start) + x + s.substr(start + l);
    }
}
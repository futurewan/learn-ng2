import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberFormat' })
export class NumberFormat implements PipeTransform {
    transform(value: number, fixed?: number): any {
        let parts: any;
        let num: any = value + '';
        let fixn: number;
        // 判断是否为数字
        if (!isNaN(parseInt(num)) && isFinite(num)) {
            // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
            // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
            // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
            // 的值变成了 12312312.123456713
            num = Number(num);
            // 处理小数点位数	precision添加小数点位数
            if (fixed === undefined) { fixn = 2; } else {fixn = fixed; }
            num = num.toFixed(fixn).toString();
            // 分离数字的小数部分和整数部分
            parts = num.split('.');
            // 整数部分加[separator]分隔, 借用一个著名的正则表达式
            parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',');
            return parts.join('.');
        }
        return Number(0);
    }
}

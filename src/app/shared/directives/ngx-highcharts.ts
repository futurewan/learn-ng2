import { Directive, ElementRef, Input, KeyValueDiffers } from '@angular/core';
import { Ng2HighchartsBase } from "./ngx-highcharts-base";

@Directive({
    selector: '[ylNgxHighcharts]'
})
export class NgxHighchartsDirective extends Ng2HighchartsBase {
    @Input() options: Object /* HighchartsOptions */;

    constructor(ele: ElementRef, _differs: KeyValueDiffers) {
        super(ele, _differs);
    }

    draw(opt: any /* HighchartsOptions */): void {
        if (!opt) {
            console.log('No valid options...');
            return;
        }
        if (opt.series || opt.data) {
            if (this.pChart) {
                this.pChart.destroy();
            }
            if (!opt.chart) {
                opt.chart = {};
            }
            if (!opt.credits) {
                opt.credits = { enabled: false };
            }
            if (!opt.title) {
                opt.title = { text: null };
            }
            if (!opt.tooltip) {
                opt.tooltip = { enabled: false };
            }
            if (!opt.plotOptions && opt.series[0].type === 'pie') {
                opt.plotOptions = {
                    pie: {
                        borderColor: null,
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: false
                    }
                };
            }
            opt.chart.renderTo = this.hostElement.nativeElement;
            if (typeof opt.callback === 'function') {
                const callback = opt.callback;
                delete opt.callback;
                this.pChart = new (<any>window).Highcharts.Chart(opt, callback);
            } else {
                this.pChart = new (<any>window).Highcharts.Chart(opt);
            }

        } else {
            console.log('No valid options...');
        }
    }
}

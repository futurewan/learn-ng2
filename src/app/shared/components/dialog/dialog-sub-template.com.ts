import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ApiService } from "../../../core/api/api.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DialogService } from './dialog.service';
// import { Subscription } from 'rxjs';

@Component({
    selector: 'yl-dialog-sub-template',
    templateUrl: './dialog-sub-template.html',
    styleUrls: ['./dialog.css']
})

export class DialogTemplateComponent implements OnInit {
    @Input() subdata: any;
    countListNumber = 0;
    maxListNumber = 0;
    isLoadMore: boolean;
    queryParameter = { iPage: 1 };
    tradeNo: string; // 订单号

    @Output() jumpEvent = new EventEmitter<boolean>();
    @Output() closeEvent = new EventEmitter<boolean>();

    constructor(private api: ApiService,
        private router: Router,
        private dialogService: DialogService) {
    }

    ngOnInit() {
        if (this.subdata.data.countJump) {
            this.countJump(this.subdata.data.countJump);
        }
    }

    // 转让
    toTransfer(type: number) {
        // let url = `/user/transfer-apply/${type}/${this.subdata.tradeNo}`;
        const myQueryParam: Object = {};
        if (type === 2) {
            if (this.subdata.ext) {
                this.dialogService.alert(this.subdata.ext);
                return;
            }
            myQueryParam['sp'] = encodeURIComponent(JSON.stringify(this.subdata.superParams));
        }
        this.dialogService.close();
        this.router.navigate(['/user/transfer-apply', type, this.subdata.tradeNo], { queryParams: myQueryParam })
    }

    jump() {
        this.jumpEvent.emit(true);
    }
    countJump(c) {
        const timer = setInterval(() => {
            if (--c > 0) {
                this.subdata.data.countJump = c;
            } else {
                clearInterval(timer);
                this.jump();
            }
        }, 1000)
    }
    guide() {
        let u: string;
        u = this.api.getUrlParam('ref') || '/';
        this.router.navigateByUrl(u, { replaceUrl: true })
    }

    closeDialog() {
        this.closeEvent.emit(true);
    }

    loadMore() {
        if (!this.isLoadMore) {
            return;
        }
        this.queryParameter.iPage += 1;
        this.api.ajax(this.subdata.ajaxName, {
            data: {
                'iPage': this.queryParameter.iPage
            },
            success: (data: any) => {
                if (data.resultList.length) {
                    this.countListNumber += data.resultList.length;
                    for (let i = 0, len = data.resultList.length; i < len; i++) {
                        this.subdata.data.resultList.push(data.resultList[i]);
                    }
                }
                else {
                    this.isLoadMore = false;
                }
                if (this.countListNumber === this.maxListNumber) {
                    this.isLoadMore = false;
                }
            }
        });
    }
}

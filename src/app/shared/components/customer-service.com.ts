import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from '../services/dialog.service';
import { ApiService } from "../../core/api/api.service";



@Component({
    selector: 'yl-customer',
    templateUrl: './html/customer-service.html',
    styleUrls: ['./css/customer.css']
})

export class CustomerComponent implements OnInit {
    hotline: string;
    constructor(
        private dialogService: DialogService, private api: ApiService) { }
    @Input() type: string;
    ngOnInit() {
        this.getTel();
    }
    getTel() {
        this.api.ajax('getContact', {
            success: (data: any) => {
                if (data.data) {
                    this.hotline = data.data.tel || 400 - 728 - 5588;
                }
            }
        });
    }
    helpMe(): void {
        this.dialogService.exe({
            type: 'popup',
            poplist: [{
                txt: '在线客服',
                routerLink: true,
                txtUrl: 'https://www.sobot.com/chat/pc/index.html?sysNum=a36c58ed16154b7e884246f62507f07a',
                tit: '在线客服'
            },
            {
                txt: '电话客服',
                link: true,
                href: 'tel:' + this.hotline
            }
            ]
        });
    }
}

import { Component, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from '../../services/form.service';
import { Subscription } from 'rxjs/Rx';
export class DialogConfigOptions {
    title?: string;
    type?: string;
    body?: string;
    dataIt?: Array<any>;
    btn?: {
        default_text?: string;
        primary_text?: string;
        default_event?: Function;
        primary_event?: Function;
    };
    callback?: Function;
    poplist?: Array<any>;
    init?: Function;
    initdata?: Object;//初始化数据
    onClose?: Function;
    body_source?: any;
    sub_template?: any;
}

@Component({
    selector: 'yl-dialog-main',
    templateUrl: './dialog.html',
    styleUrls: ['./dialog.css'],
    providers: [FormService]
})
export class DialogComponent implements OnInit, OnDestroy {
    close = new EventEmitter();
    MsgItem: any = [];
    private msgData: Object;
    private isShow: boolean;
    private isShowMask: boolean;
    private mycountDownObs: Subscription;
    private st: any;
    private smsInfo: Object = { message: "获取验证码", disabled: false };
    public configs: DialogConfigOptions = {
        title: '',
        body: '',
        dataIt: [],
        btn: { default_text: '', primary_text: '' },
        callback: () => { },
        init: () => { },
        onClose: () => { },
        poplist: [],
        initdata: {},
        body_source: '',
        sub_template: ''
    };
    constructor(private router: Router, private fs: FormService) { };
    ngOnInit() {
        this.fadeIn();
        if (typeof this.configs.init === 'function') {
            this.configs.init.call(this);
        }
    }

    fadeIn() {
        this.isShowMask = true;
        this.st = setTimeout(() => {
            this.isShow = true;
        }, 50);
        this.forTypes();//初始化当前type方法
    }

    fadeout(callback: Function) {
        this.isShow = false;
        this.st = setTimeout(() => {
            this.isShowMask = false;
            callback.call(this);
            this.st = null;
        }, 150)
    }
    // type method start ****************************************************************************//
    //methods
    paypop() { }

    popup() { }
    msgpop() {
        this.fs.countDown();
        this.mycountDownObs = this.fs.countDownObs.subscribe(param => {
            if (!param['message']) {
                this.smsInfo['disabled'] = param['disabled'];
            }
            else {
                this.smsInfo = param;
            }
        });
    }
    // toast() {
    //     setTimeout(() => {
    //         this.distroy('null', false)
    //     }, 1500)
    // }
    warn() {
        setTimeout(() => {
            this.distroy('null', false)
        }, 1500)
    }

    // type method end ****************************************************************************//
    forTypes() {
        const type = this.configs.type;
        if (type && typeof this[type] === 'function') {
            this[type].call(this);
        }
    }
    defaultEvent() {
        if (typeof this.configs.btn['default_event'] === 'function') {
            this.configs.btn['default_event'].call(this);
        }
        this.distroy('no', true);
    }

    primaryEvent(animate: boolean) {
        if (typeof this.configs.btn['primary_event'] === 'function' && this.configs.btn['primary_text']) {
            this.configs.btn['primary_event'].call(this);
        }
        this.distroy('yes', true);
    }
    jumpEvent() {
        if (typeof this.configs.sub_template.data['jump_event'] === 'function') {
            this.configs.sub_template.data['jump_event'].call(this);
        } else {
            this.distroy('yes', true);
            history.back();
        }
    }
    //支付
    showVal(evt: any, v1: any, v2: any, v3: any, v4: any, v5: any, v6: any) {
        const val = evt.target.value;
        const arr = val.split('');
        v1.innerText = arr[0] ? '*' : '';
        v2.innerText = arr[1] ? '*' : '';
        v3.innerText = arr[2] ? '*' : '';
        v4.innerText = arr[3] ? '*' : '';
        v5.innerText = arr[4] ? '*' : '';
        v6.innerText = arr[5] ? '*' : '';
        if (arr.length === 6) {
            if (typeof this.configs.callback === 'function') {
                this.configs.callback.call(this, val);
                // val = '';
                evt.target.blur();
                // this.distroy('null', true)
            }
        }
    }
    phoneCodeUp(evt: any) {
        const val = evt.target.value;
        if (val.length === 4) {
            if (typeof this.configs.callback === 'function') {
                this.configs.callback.call(this, val);
                evt.target.blur();
            }
        }
        const data = this.configs.initdata;
    }

    getMsgSms() {
        const smsdata = this.configs.initdata;
        this.fs.sentSms({
            phoneNum: smsdata['phoneNum'],
            imageCode: smsdata['imageCode'],
            imgToken: smsdata['imgToken'],
            type: smsdata['type'],
            warmT: true
        });

    }
    echo(para: any) {
        if (typeof para === "string") {
            this.router.navigateByUrl(para)
        }
        else if (typeof para === "function") {
            this.distroy('yes', true);
            para.call(this);
        }
    }
    distroy(msg: string, animate: boolean) {
        if (typeof this.configs.onClose === 'function') {
            this.configs.onClose.call(this)
        }

        if (this.st) {
            clearTimeout(this.st)
        }
        if (animate) {
            this.fadeout(() => {
                this.close.emit(msg);
            });
        } else {
            this.close.emit(msg);
        }
    }
    ngOnDestroy() {
        this.mycountDownObs && this.mycountDownObs.unsubscribe();
    }

}

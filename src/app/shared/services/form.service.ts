import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { ApiService } from '../../core/api/api.service';
import { DialogService } from './dialog.service';
import { formErrorMsg } from '../components/form/form-errors';
// import form types
import { DefaultData, FormBase } from '../types/form-base';
import { FormInput } from '../types/form-inputs';
import { FormSelect } from '../types/form-select';
import { FormCheckbox } from '../types/form-checkbox';
import { FormButton } from '../types/form-button';

@Injectable()
export class FormService {
    // Observable string sources
    private parentSource = new Subject<string>();
    private childSource = new Subject<string>();
    private grandChildSource = new Subject<string>();
    private formChangeSource = new Subject<string>();
    private formValidSource = new Subject<string>();
    private formInValidSource = new Subject<string>();
    private formSubmitSource = new Subject<string>();

    private countDownSource = new Subject<Object>(); //倒计时

    // Observable string streams
    forParent = this.parentSource.asObservable();//订阅此数据
    forChild = this.childSource.asObservable();
    forGrandChild = this.grandChildSource.asObservable();
    formChange = this.formChangeSource.asObservable();
    formValid = this.formValidSource.asObservable();
    formInValid = this.formInValidSource.asObservable();
    formSubmit = this.formSubmitSource.asObservable();
    countDownObs = this.countDownSource.asObservable();

    private events = {
        // 事件命名规则：event+Name  Name首字母大写，必须。对应 data-event-name;
        eventRouter: (e: any, value: string) => {
            const curUrl = this.router.routerState.snapshot.url;
            let isReplace: boolean;
            let reload: boolean;
            if (!/[\?|&]ref=/i.test(value) && /\?withReffer/.test(value)) {
                value = value.replace(/\?withReffer/, '?ref=' + curUrl);
            }
            if (this.api.getUrlParam('replaceUrl', value)) {
                isReplace = true;
            }
            if (this.api.getUrlParam('reload', value)) {
                reload = true;
            }
            if (!reload) {
                this.router.navigateByUrl(value, { replaceUrl: isReplace })
            } else {
                location.href = value;
            }
        },
        // 跳出本站链接
        eventChain: (e: any, url: string) => {
            this.dialogService.exe({ type: 'loading' });
            let loading = setTimeout(() => {
                this.dialogService.close();
                loading = null;
            }, 2000);
            location.href = this.api.chain(url);
        }
    };

    constructor(private api: ApiService, private router: Router, private dialogService: DialogService) {
        const _event: any = document.body.dataset['_event'];
        let $EventName: string;
        switch (window.navigator.platform) {
            case 'Win32':
            case 'Win64':
            case 'MacIntel':
                $EventName = 'click';
                break;
            default:
                $EventName = 'touchend';
                break;
        }
        if (!_event) {
            const ev = this.events;
            document.body.dataset['_event'] = '' + new Date().getTime();
            document.body.addEventListener($EventName, (e: any) => {
                const nodePath = ('path' in e) ? e.path : [];
                let len = nodePath.length;
                if (!e || !e.target) {
                    return;
                }
                if (!len) {
                    let tg = e.target;
                    for (let cout = 0; cout < 4; cout++) {
                        if (tg) {
                            nodePath.push(tg);
                            tg = tg.parentElement;
                        } else {
                            break;
                        }
                    }
                    len = nodePath.length;
                }
                for (let i = 0; i < len; i++) {
                    const __dataset = JSON.stringify(nodePath[i].dataset);
                    if (__dataset !== '{}') {
                        this.__inspire.call(this, nodePath[i], ev);
                        break;
                    }
                    if (i > 4) {
                        break;
                    }
                }

            }, false);
        }
    }

    // delegate 事件
    private __inspire(e: any, evt: any) {
        const datas = e.dataset;
        for (const _evt in datas) {
            if (evt[_evt] && typeof evt[_evt] === 'function') {
                if (/^event/.test(_evt)) {
                    evt[_evt].call(this, e, datas[_evt]); // event,value
                } else {
                    throw new Error('自定义方法需要以event开头');
                }
            }
        }
    }

    addEvent(evt: string, fun: Function) {
        this.events[evt] = fun;
    }

    clearForm() {
        this.sendToChild(JSON.stringify({
            subname: 'clearForm'
        }));
    }

    // Service message commands
    sendToParent(mission: string) { // 传数据到
        this.parentSource.next(mission);
    }

    exe(astronaut: string) {
        this.childSource.next(astronaut);
    }

    sendToChild(astronaut: string) {
        this.childSource.next(astronaut);
    }

    sendToGrandChild(mission: string) {
        this.grandChildSource.next(mission);
    }

    triggerChange(mission: string) {
        this.formChangeSource.next(mission);
    }

    OnValid(mission: string) {
        this.formValidSource.next(mission);
    }

    OnInValid(mission: string) {
        this.formInValidSource.next(mission);
    }

    OnSubmit(mission: string) {
        this.formSubmitSource.next(mission);
    }

    sendCountDown(mission: Object) {
        this.countDownSource.next(mission);
    }

    getRegExp(type: string): string {
        switch (type) {
            case "mobile":
                return "1(3[0-9]|5[012356789]|7[015678]|8[0-9]|4[57])\\d{8}";
            case "tel":
                return "\\d{3,4}-\\d{7,8}$)|(^1(3[0-9]|5[012356789]|7[01678]|8[0-9]|4[57])\\d{8}";
            case "loginPsw":
                return "(?![0-9]+\\$)(?![a-zA-Z]+\\$)[0-9A-Za-z_]{8,20}";
            // return "(?=.*[0-9])(?=.*[a-zA-Z~!@#\\$%\\^&\\*\\(\\)_\\+\\{\\}\\|:\"<>\\?`\\-=\\[\\]\\\\;',\\./]).{8,20}"
            case "tradePsw":
                return "\\d{6}";
            case "money":
                return "([1-9]\\d*|0)(\\.\\d{1,2})?";
            case "integer":
                return "([1-9]\\d*)?";
            case "name":
                return "[\\u4e00-\\u9fa5]{1,10}[\u00B7.]{0,1}[\\u4e00-\\u9fa5]{1,10}";
            case "idCard":
                return "(\\d{15}$|^\\d{18}$|^\\d{17}(\\d|X|x))";
            case "bankCard":
                return "\\d{16}|\\d{19}";
        }
    }

    public showErrors(form): string {
        const formErrors = JSON.parse(JSON.stringify(form.value));
        // this.showErrors = '';
        // tslint:disable-next-line:forin
        for (const field in formErrors) {
            formErrors[field] = '';
            const control = form.get(field);
            // console.log(control,control.dirty,!control.valid)
            if (control && !control.valid) {
                const messages = formErrorMsg[field];
                // tslint:disable-next-line:forin
                for (const key in control.errors) {
                    if (messages[key]) {
                        formErrors[field] = messages[key];
                        return messages[key];
                    }
                    return;
                }
            }
        }
    }

    // imgToken 1 and 2 used
    public sentSms(dataSms: any, fun?: Function, error?: Function) {
        // phoneNum:
        // imageCode:
        // imgToken:
        // type
        // warmT 弹框报错
        let nowPhone: string;
        if (dataSms.phoneNum) {
            nowPhone = dataSms.phoneNum;
        }
        else if (this.api.getLS("user") && this.api.getLS("user").phoneNum) {
            nowPhone = this.api.getLS("user").phoneNum;
        }
        // this.smsInfo.disabled = true;

        this.sendCountDown({ disabled: true });
        this.api.ajax("sendPhoneCode", {
            data: {
                phoneNum: nowPhone,
                type: dataSms.type,
                imgToken: dataSms.imgToken || '',
                imageCode: dataSms.imageCode || ""
                // imgToken 在header  51121 短信验证码获取次数过多  61040  图形验证码错误
            },
            success: (data: DefaultData) => {
                this.countDown();
                if (/^[1-7]$/.test(dataSms.type)) {
                    (typeof fun === 'function') && fun.call(this);
                    return;
                }
                if (this.dialogService) {
                    this.dialogService.alert("验证码发送成功");
                }
            },
            other: (data: DefaultData) => {
                if (error) {
                    error.call(this, data)
                }
                if (dataSms.phoneNum) {
                    this.getImageInfo((datai: any) => {
                        this.updateImgToken({
                            imgToken: datai.imgToken,
                            vname: 'verityCode'
                        });
                    });
                }
                if (data['resDesc']) {
                    if (this.dialogService) {
                        this.dialogService.alert(data['resDesc']);
                    } else {
                        alert(data['resDesc']);
                    }
                }
                // this.smsInfo.disabled = false;
                this.sendCountDown({ disabled: false });
            }
        });
    }

    countDown() {
        let seconds = 60;
        let intervalId: any;
        clearInterval(intervalId);
        const smsInfo = {
            message: `重新发送(${seconds}s)`,
            disabled: true
        };
        this.sendCountDown(smsInfo);
        intervalId = window.setInterval(() => {
            seconds -= 1;
            if (seconds <= 0) {
                clearInterval(intervalId);
                seconds = 60;
                smsInfo.message = '重新获取';
                smsInfo.disabled = false;
            }
            else {
                smsInfo.message = `重新发送(${seconds}s)`;
                smsInfo.disabled = true;
            }
            this.sendCountDown(smsInfo);
        }, 1000);
    }

    // 获取图片验证码
    public getImageInfo(fun: Function): void {
        this.api.ajax("getImgToken", {
            success: (data: DefaultData) => {
                const imgInfo: Object = {
                    url: this.api.getUrl('getImgVin') + "?imgToken=" + data.data,
                    imgToken: data.data
                };
                typeof fun === 'function' && fun.call(this, imgInfo);
            }
        });
    }

    reNewImgCode() {
        this.sendToGrandChild(JSON.stringify({
            subname: 'reNewImgCode'
        }));
    }

    toFormGroup(items: FormBase<any>[]) {
        const group: any = {};

        items.forEach(item => {
            group[item.key] = item.required
                ? new FormControl({ value: item.value, disabled: item.disabled }, Validators.required)
                : new FormControl({ value: item.value, disabled: item.disabled });
        });
        return new FormGroup(group);
    }

    createFormItem(key: Array<Object>) {
        const _items: FormBase<any>[] = [];
        key.forEach((fitem: FormBase<any>) => {
            fitem.required = fitem.required === undefined ? true : fitem.required;
            fitem.disabled = fitem.disabled === undefined ? false : fitem.disabled;
            switch (fitem.controlType) {
                case 'cInput':
                    _items.push(
                        new FormInput(fitem)
                    );
                    break;
                case 'ddSearch':
                    _items.push(
                        new FormInput(fitem)
                    );
                    break;
                // 特殊处理
                case 'cPassword':
                    fitem.type = 'password';
                    _items.push(
                        new FormInput(fitem)
                    );
                    break;
                case 'cVerityCode':
                    fitem.subscrip = true;
                    _items.push(
                        new FormInput(fitem),
                        new FormInput({
                            controlType: 'cImgToken',
                            key: 'imgToken',
                            required: false
                        })
                    );
                    break;
                case 'cPhoneCode':
                    _items.push(
                        new FormInput(fitem)
                    );
                    break;
                case 'submit':
                    _items.push(
                        new FormButton({
                            controlType: fitem.controlType,
                            btnText: fitem.btnText || '提交',
                            subscrip: fitem.subscrip,
                            sib: fitem.sib || '',
                            icon: fitem.icon || false,
                            beforeSib: fitem.beforeSib || ''
                        })
                    );
                    break;
                case 'select':
                    _items.push(
                        new FormSelect(fitem)
                    );
                    break;
                case 'cServiceAgree':
                    _items.push(
                        new FormCheckbox(fitem)
                    );
                    break;
                case 'html':
                    _items.push(
                        new FormInput(fitem)
                    );
                    break;
            }
        });
        return _items;
    }

    updateImgToken(subdata: Object) {
        subdata['vname'] = subdata['vname'] || 'verityCode';
        this.childSource.next(JSON.stringify({
            subname: 'show_verityCode',
            data: subdata
        }));
    }
}

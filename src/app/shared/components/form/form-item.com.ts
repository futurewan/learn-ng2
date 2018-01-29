import { Component, Input, OnInit, OnDestroy, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';

import { FormBase, SmsOpt, DefaultData, ObFormData } from '../../types/form-base';
import { ApiService } from '../../../core/api/api.service';
import { FormService } from '../../services/form.service';
import { formErrorMsg } from './form-errors';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'yl-form-item',
    templateUrl: '../html/form-item.html'
})
export class FormItemComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() item: FormBase<any>;
    @Input() form: FormGroup;
    @Input() siblings: any;
    @ViewChild('selectNode') selectNode: ElementRef;
    private formSubs: Subscription;
    private mycountDownObs: Subscription;
    private sysError: string;

    //图片验证码相关
    private imageInfo: any = { url: "", imgToken: "" };
    private smsInfo: Object = { message: "获取验证码", disabled: false };
    addrResult: Array<Object>;
    constructor(private api: ApiService,
        private fs: FormService,
        private dialogService: DialogService,
        private Renderer2: Renderer2) { }

    ngOnInit() {
        // 如果初始未显示，则启用订阅
        if (this.item['controlType'] === 'cVerityCode' && !this.item['disabled']) {
            this.getImage();
        }
        if (this.item['subscrip']) {
            this.subscrip((param: string) => {
                const datas: ObFormData = JSON.parse(param);
                if (datas.subname == "show_verityCode" && this.item['controlType'] == "cVerityCode") {
                    this.imageInfo = datas.imageInfo;
                }
                else if (datas.subname == "ddsearch" && this.item['controlType'] == "ddSearch") {
                    this.addrResult = datas.data ? datas.data.data : null;
                } else if (datas.subname === 'reNewImgCode') {
                    this.getImage()
                }
            })
        }
    }
    // 临时做法，通过触发nativeEvent来激活checkbox
    ngAfterViewInit() {
        const cs = document.getElementById('serviceAgree');
        if (cs) {
            cs.click()
        }
    }
    subscrip(callback: Function) {
        this.formSubs = this.fs.forGrandChild.subscribe(
            (param: string) => {
                callback.call(this, param)
            });
    }

    // 控制密码显示切换
    public togglePaw(showEye: any, eye: any): void {
        const _type = showEye.type;
        if (_type === 'password') {
            showEye.type = "text";
            eye.className += ' sy-icon-eye-active'
        } else if (_type === 'text') {
            showEye.type = "password";
            eye.className = eye.className.replace(/sy-icon-eye-active/, '').replace(/^\s+|\s+$/g, '')
        }
    }

    // focusPsw(el){
    //     el.target.setAttribute('type','password');
    // }
    // blurPsw(el){
    //     el.target.setAttribute('readonly',true);
    // }
    private getImage() {
        this.fs.getImageInfo((data: any) => {
            this.imageInfo['url'] = data.url;
            const imgToken = this.form.get('imgToken');
            if (!imgToken) {
                return console.log('imgToken::invalid')
            }
            imgToken.setValue(data.imgToken);
        });
    }


    // 1:注册,2:找回密码,3:设置交易密码,4:找回交易密码,5:申请房产抵押贷款,6:申请车产抵押贷款,7:额度试算,8:快捷登录
    public getSms(type: number) {
        let phoneNum: string;
        let imageCode: string;
        let imgToken: string;
        if (this.form.get('phoneNum')) {
            if (this.form.get('phoneNum').invalid) {
                this.dialogService.exe({ type: 'warn', body: formErrorMsg['phoneNum']['pattern'] });
                return;
            }
            else if (this.form.get('imageCode').invalid) {
                this.dialogService.exe({ type: 'warn', body: formErrorMsg['imageCode']['required'] });
                return;
            }
            phoneNum = this.form.get('phoneNum').value || '';
            imageCode = this.form.get('imageCode').value || '';
            imgToken = this.form.get('imgToken').value || '';
        }
        if (type === 3 || type === 4) {
            phoneNum = this.api.getLS('user').phoneNum;
        }
        this.fs.sentSms({
            phoneNum: phoneNum,
            imageCode: imageCode,
            imgToken: imgToken,
            type: type
        });

        // 更新发送短信表单信息
        this.mycountDownObs = this.fs.countDownObs.subscribe(param => {
            if (!param['message']) {
                this.smsInfo['disabled'] = param['disabled'];
            }
            else {
                this.smsInfo = param;
            }
        })
    }

    OnChange(evt: any) {
        let _data = {};
        switch (evt.target.id) {
            case 'city':
                _data = {
                    subname: 'district',
                    data: {
                        value: evt.srcElement.value,
                        text: evt.srcElement.selectedOptions[0] ? evt.srcElement.selectedOptions[0]['innerText'] : ''
                    }
                };
                break;
            case 'keyword':
                _data = {
                    subname: 'addrKeyword',
                    data: {
                        value: evt.srcElement.value
                    }
                };
                break;
            default:
                return false;
        }
        this.fs.sendToParent(JSON.stringify(_data));
    }
    clickSelect() {
        if (this.selectNode.nativeElement.id === 'isRecommend') {
            this.Renderer2.setAttribute(this.selectNode.nativeElement[0], 'disabled', 'true');
        }
    }
    clearValue(key, el) {
        this.form.get(key).setValue('');
        el.target.previousSibling.focus();
    }
    selectAddr(val: any) {
        this.form.get('keyword').setValue(val.name);
        this.form.get('city').setValue(val.district);
        this.addrResult = null;
    }

    ngOnDestroy() {
        this.formSubs && this.formSubs.unsubscribe();
        this.mycountDownObs && this.mycountDownObs.unsubscribe();
    }
}

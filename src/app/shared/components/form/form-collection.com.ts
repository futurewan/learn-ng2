import { Component, Input, OnDestroy, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs/Rx";

import { FormBase, ObFormData } from "../../types/form-base";
import { formErrorMsg } from "./form-errors";

import { ApiService } from "../../../core/api/api.service";
import { FormService } from "../../services/form.service";

@Component({
    selector: 'yl-myform',
    templateUrl: '../html/form-collection.html'
})
export class FormCollectionComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() items: FormBase<any>[] = [];
    form: FormGroup;
    payLoad = '';
    subs: Subscription;
    subsForm: Subscription;
    subsImgcode: Subscription;

    formErrors: any;
    showErrors: string;
    private imageInfo: any = { imgToken: '', url: '' };
    errorTimeout: any;

    constructor(private fs: FormService, private api: ApiService) {
    }

    ngOnInit() {
        this.form = this.fs.toFormGroup(this.items);
        this.subs = this.fs.forChild.subscribe(
            param => {
                const _datas = JSON.parse(param);
                if (_datas.subname === 'show_verityCode') {
                    this.enableItem(_datas.data.vname);//设置成需要验证
                    const imgToken = this.form.get('imgToken');
                    if (!imgToken) {
                        return console.log('imgToken::invalid')
                    }
                    imgToken.setValue(_datas.data.imgToken);
                    this.imageInfo.imgToken = _datas.data.imgToken;
                    // vname 发送ajax参数名
                    this.updataImg(_datas.subname)
                } else if (_datas.subname === 'clearForm') {
                    this.form.reset()
                } else if (_datas.subname === 'reNewImgCode') {
                    this.updataImg('show_verityCode')
                }
            }
        )
        this.subsForm = this.form.valueChanges.subscribe(
            form => {
                this.onValueChanged(form);
            }
        );
    }
    ngAfterViewInit() {
        const u = window.navigator.userAgent;
        if (/MicroMessenger/.test(u) && (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1)) {
            setTimeout(() => {
                if (this.form.get('loginPwd') || this.form.get('password')) {
                    this.form.reset();
                }
            }, 280);
        }
    }
    enableItem(name: string) {
        if (this.form.get(name)) {
            this.form.get(name).enable();
        }
    }

    //订阅第三级
    updataImg(subname: string) {
        this.imageInfo.url = this.api.getUrl('getImgVin') + '?imgToken=' + this.imageInfo.imgToken;
        const _data: ObFormData = {
            subname: subname,
            imageInfo: this.imageInfo
        };
        this.fs.sendToGrandChild(JSON.stringify(_data));
    }

    onValueChanged(data?: any) {
        const form = this.form; // form表单
        this.formErrors = JSON.parse(JSON.stringify(form.value)); // 已经变过值(报错信息)de表单;
        this.showErrors = '';
        // tslint:disable-next-line:forin
        for (const field in this.formErrors) {
            this.formErrors[field] = ''; // 清除之前的报错信息
            const control = form.get(field); // 获取最新的表单
            if (control && field === 'serviceAgree' && control.value === false) {
                control.setValue('');
            }
            if (control && control.dirty && !control.valid) { // 已经变过值并没有验证通过的表单
                const messages = formErrorMsg[field]; // 获取当前表单的报错信息
                // tslint:disable-next-line:forin
                for (const key in control.errors) { // 循环(已经变过值并没有验证通过的表单de)=>报错类型
                    if (messages[key]) {
                        this.formErrors[field] = messages[key]; // 赋值新的报错信息
                        this.feedError(messages[key]);
                        break;
                    }
                    break; // 遇到前面有没有验证通过的眼报前面的错
                }
            }
        }
        // this.fs.ItemChange();
        this.fs.triggerChange(JSON.stringify(this.form.value));
        if (form.valid) {
            this.fs.OnValid(JSON.stringify(this.form.value));
        } else {
            this.fs.OnInValid(JSON.stringify(this.form.value));
        }
    }

    feedError(emsg: string) {
        if (emsg === '' || emsg === this.showErrors) {
            return;
        }
        if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
            this.errorTimeout = null;
        }
        this.showErrors = emsg;
        // this.errorTimeout = setTimeout(() => {
        //     this.showErrors = '';
        // }, 1500)
    }

    onSubmit(event: any): void {
        event.preventDefault();
        return this.fs.OnSubmit(JSON.stringify(this.form.value));
    }

    ngOnDestroy() {
        this.subs && this.subs.unsubscribe();
        this.subsForm && this.subsForm.unsubscribe();
    }
}

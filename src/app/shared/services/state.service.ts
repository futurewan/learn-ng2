import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../../core/api/api.service';
import { DialogService } from './dialog.service';

@Injectable()
export class StateService {
    private lcUser;
    // private acctInfo: any;
    private directTarget: string;
    private replace: boolean;
    private userType: number; // 绑卡用 1投资 2借款 0未知
    checklist: any = {};
    private all = {
        'bind-card': '/user/personal/bind-card',
        'set-trade-psw': '/user/setting/set-trade-psw',
        'charge': '/user/charge',
        'withdraw': '/user/withdraw',
        'invest': false,
        'loan-type': false
    };
    constructor(
        private api: ApiService,
        private loc: Location,
        private router: Router,
        private ds: DialogService) {
        // this.checklist = {
        // isRealNameAuth: '/user/personal/certification',
        // isBindBankCard: '/user/personal/bind-card',
        // payPasswordStatus: '/user/setting/set-trade-psw'
        // }
    }

    getState(v?: any): Promise<any> {
        if (v) {
            this.validType(v);
        }
        return new Promise((resolve, reject) => {
            this.lcUser = this.api.getLS('user') || {};
            // const _time = (new Date).getTime();
            // if (this.lcUser['acctInfo'] && _time - this.lcUser['acctInfo'].timestemp < 7500) {
            //     this.acctInfo = this.lcUser['acctInfo'];
            //     this.filter(this.acctInfo).then((data) => {
            //         if (data) {
            //             resolve(this.acctInfo);
            //         } else {
            //             resolve(null);
            //         }
            //     });
            // } else {
            this.api.ajax('info', {
                success: (user: any) => {
                    // this.acctInfo = data.data;
                    // this.acctInfo.timestemp = (new Date()).getTime();
                    this.lcUser = user.data;
                    this.api.setLS('user', this.lcUser);
                    if (this.lcUser) {
                        if (!!v) {
                            this.replace = true;
                            this.filter(this.lcUser).then((data) => {
                                resolve(this.lcUser);
                            });
                        } else {
                            resolve(this.lcUser);
                        }
                    } else {
                        this.ds.alert('登录信息未能获取');
                    }
                },
                other: (user: any) => {
                    this.ds.alert(user.resDesc);
                }
            });
            // }
        });
    }
    goWhere(url: string, userType: number): Promise<any> {
        const user = this.api.getLS('user') || this.lcUser || '';
        if (!user) {
            this.enRef('/login', '请先登录', false);
        } else {
            return new Promise((resolve, reject) => {
                // const cond = condition || url.split('/').pop();
                this.directTarget = url; // 终点url或target
                this.userType = userType;
                this.validType(this.directTarget);
                this.replace = false;
                this.filter(user).then((destination) => {
                    if (destination) { // 直接跳转
                        this.solveRef(destination, false);
                    } else {
                        resolve(user);
                    }
                });
            });
        }
    }

    private filter(data: any): Promise<any> { // 去向
        return new Promise((resolve, reject) => {
            const a = this.valid(data);
            if (!a.length) { // success
                // alert(this.directTarget)
                resolve(this.all[this.directTarget]);
            } else {
                let toast = '';
                let t = '';
                if (this.userType === 1) { t = '投资'; }
                else { t = '借款'; }
                switch (a[0]) {
                    case 'isRealNameAuth':
                        toast = '请先完成实名认证';
                        break;
                    case 'isBindBankCard':
                        toast = `请先绑定${t}银行卡`;
                        break;
                    case 'payPasswordStatus':
                        toast = `请设置${t}交易密码`;
                        break;
                    case 'freePwdStatus':
                        toast = `请先开启免密支付`;
                        break;
                }
                this.enRef(a[1], toast, false);
            }
        });
    }

    // 验证是否符合所给参数
    private valid(data: any, type?: any) {
        const arr: Array<any> = [];
        let isBreak: boolean;
        for (const key in this.checklist) {
            if (this.checklist.hasOwnProperty(key)) {
                if (key === 'isRealNameAuth' && !data[key]) {
                    isBreak = true;
                } else if (this.userType == 1) {
                    if (key === 'isBindBankCard' && !data[key]) {
                        isBreak = true;
                    } else if (key === 'payPasswordStatus' && data[key] === 2) {
                        isBreak = true;
                    } else if (key === 'freePwdStatus' && data[key] === 2) {
                        isBreak = true;
                    }
                } else if (this.userType == 2) {
                    if (key === 'isBindBankCard' && !data['lendIsBindBankCard']) {
                        isBreak = true;
                    } else if (key === 'payPasswordStatus' && data['lendPayPasswordStatus'] === 2) {
                        isBreak = true;
                    } else if (key === 'freePwdStatus' && data['lendFreePwdStatus'] === 2) {
                        isBreak = true;
                    }
                }
                if (isBreak) {
                    arr[0] = key;
                    arr[1] = this.checklist[key]
                    break;
                }
            }
        }
        return arr;
    }
    validType(v) {
        if (typeof v === 'object') {
            this.checklist = v;
        } else if (typeof v === 'string') {
            switch (v) {
                case 'bind-card':
                    this.checklist = {
                        isRealNameAuth: '/user/personal/certification',
                    };
                    break;
                case 'charge':
                case 'set-trade-psw':
                case 'loan-type':
                    this.checklist = {
                        isRealNameAuth: '/user/personal/certification',
                        isBindBankCard: '/user/personal/bind-card'
                    };
                    break;
                case 'to-repayment':
                    this.checklist = {
                        payPasswordStatus: '/user/setting/set-trade-psw',
                        freePwdStatus: '/user/setting/non-secret-payment'
                    };
                    break;
                case 'withdraw':
                case 'invest':
                    this.checklist = {
                        isRealNameAuth: '/user/personal/certification',
                        isBindBankCard: '/user/personal/bind-card',
                        payPasswordStatus: '/user/setting/set-trade-psw',
                        freePwdStatus: '/user/setting/non-secret-payment'
                    };
                    break;
                default:
                    // 这里要写正确的url
                    this.router.navigateByUrl(this.directTarget, {
                        replaceUrl: true //设置true路由会进行跳转，为false路由不会进行跳转
                    });
            }
            //     this.checklist = {};
            //     switch (v) {
            //         case 'withdraw':
            //         case 'charge':
            //             this.checklist['isBindBankCard'] = '/user/personal/bind-card';
            //         case 'bind-card':
            //             this.checklist['isRealNameAuth'] = '/user/personal/certification';

            //     }
        }
    }

    public enRef(url: string, toast?: string, replace?: boolean) {
        // if (toast) {
        this.ds.alert(toast);
        setTimeout(() => {
            return this.solveRef(url, replace);
        }, 1500);
        // } else {
        //     return this.solveRef(url, r, replace);
        // }
    }
    public solveRef(url: string, replace?: boolean) {
        const r: string = this.api.getUrlParam('ref') || this.router.url;
        // dir 流程目标地址
        this.router.navigate([url], { queryParams: { dir: this.directTarget, ref: r, userType: this.userType }, replaceUrl: replace });
    }
}

import { Title } from '@angular/platform-browser';
import { Injectable, OnInit } from '@angular/core';
import {
    Headers,
    Http,
    Response,
    Request,
    RequestMethod,
    RequestOptions,
    URLSearchParams
} from '@angular/http';
import { Router, CanActivate } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { environment } from '../../../environments/environment';
import { Api } from './api';

import { DialogService } from '../../shared/services/dialog.service';
// export const env = environment;

//请求参数对象
export interface ReqOption {
    success?: Function
    other?: Function;
    method?: string;
    data?: Object;
    search?: string;
    path?: number;
    error?: any
}

@Injectable()
export class ApiService implements CanActivate {
    private headers: Headers;
    private options: RequestOptions;
    private resState: string;
    readonly client: string = '5';
    private timerInput: any;
    constructor(private http: Http, private title: Title, private router: Router, private ds: DialogService) {
        // if (window['isWx']) {
        //     this.client = '2';
        // }
    }
    //接口返回状态
    public canActivate() { // 实例名必须为canActivate
        if (this.resState === '60003') {
            const rurl = this.router.url.replace(/m=[^&]+&?/g, '');
            if (!/^\/login(\?(.+))?$/.test(rurl)) {
                // this.showlogMsg();
                this.router.navigate(['login'], {
                    queryParams: {
                        ref: rurl
                    }, replaceUrl: true
                });
                this.removeLS();
            }
            return false;
        } else if (this.resState === '30033') {
            this.alert('请先绑定手机号或登录');
            const wxid = this.getLS('wxid');
            const rurl = wxid ? 'login/bindwx?wxid=' + wxid : 'login/quick';
            this.router.navigateByUrl(rurl, { replaceUrl: true });
            this.removeLS();
            return false;
        }
        return true;
    }

    private showlogMsg() {
        if (!this.getLS('token')) {
            this.ds.alert('请先登录');
        } else {
            this.ds.alert('登录失效，请重新登录');
        }
    }

    //构造异步请求方法
    public ajax(apiKey: string, option?: ReqOption, newClient?: string): Promise<any> {
        const _api: string[] = this.getApi(apiKey).split('@');
        let res: Object;
        // if path
        if (option.path) {
            _api[0] = _api[0] + option.path;
        }
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('client', newClient || this.client);
        // this.headers.append('Referrer', _api[0]);
        this.headers.append('auth-token', this.getLS('token'));
        // if (typeof option.headers === 'object') {
        //     for (const key in option.headers) {
        //         if (option.headers.hasOwnProperty(key)) {
        //             this.headers.append(key, option.headers[key]);
        //         }
        //     }
        // }
        // fix get 方法不能发送body参数的问题，用search代替
        if (_api[1] === 'Get' && option.data) {
            let count = 0;
            let params = '';
            // tslint:disable-next-line:forin
            for (const key in option.data) {
                if (count > 0) {
                    params += '&';
                }
                params += key + '=' + option.data[key];
                count++;
            }
            option.search = params;
        };

        this.options = new RequestOptions({
            method: RequestMethod[_api[1]],
            url: _api[0],
            headers: this.headers,
            body: option && option.data || {},
            search: option && option.search || ''
        });

        return this
            .http
            .request(new Request(this.options))
            .toPromise()
            .then(response => {
                res = response.json();
                const _token = this.getLS('token');
                const _resCode = res['resCode'];
                this.resState = _resCode;
                if (_resCode === '0000') { //返回成功
                    let resToken: string;
                    if (res['data'] && res['data']['token']) {
                        resToken = res['data']['token'];
                    }
                    if (resToken && (!_token || resToken !== _token)) {
                        this.removeLS();
                        this.setLS('token', resToken);
                        // this.setLS('user', res['data'] && res['data']['customerInfo']
                        //     ? res['data']['customerInfo'] : {});
                    }
                    if (option && option.success) {
                        option.success.call(this, res);
                    }
                } else if (_resCode === '9002') { // 系统维护
                    location.href = environment.act + '/maintain/index.html';
                } else if (_resCode !== '60003') {
                    if (option && option.other) {
                        option.other.call(this, res);
                    } else if (res['resDesc']) {
                        console.log(this.ds, this.ds.alert, res['resDesc'])
                        this.ds.alert(res['resDesc']);
                    }
                }
                this.canActivate();
                return response;
            })
            .catch((error: any) => {
                if (!error.message) {
                    error.message = '网络错误！';
                }
                if (option && typeof option.error === 'function') {
                    option.error.call(this, error.message);
                }
                this.ds.alert('error:' + error.message);
                this.handleError.call(this, error);
                return error;
            });
    }
    public alert(name: string) {
        try {
            const iframe = document.createElement("IFRAME");
            iframe.style.display = "none";
            iframe.setAttribute("src", '/assets/images/app.png');
            document
                .body
                .appendChild(iframe);
            window
                .frames[0]
                .window
                .alert(name);
            setTimeout(() => {
                iframe
                    .parentNode
                    .removeChild(iframe);
            }, 1000)
        } catch (e) {
            alert(name);
        }
    }
    //upload
    public Upload(file: any, options?: Object) {
        const formdata = new FormData;
        const xhr = new XMLHttpRequest;

        formdata.append('file', file);

        xhr.open('POST', this.getUrl('headImageUpload'));
        xhr.setRequestHeader('auth-token', this.getLS('token'));
        xhr.setRequestHeader('client', '5');

        xhr.send(formdata);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status <= 300) {
                if (options) {
                    if (typeof options['success'] === 'function') {
                        options['success'].call(this, xhr.responseText && JSON.parse(xhr.responseText) || null)
                    }
                }
            }
        }
    }

    //websocket url
    public getWSUrl() {
        const wsServer: string = environment.wss;
        return wsServer + "/websocket?authToken=" + this.getLS('token')
    }
    public setTitle(tit: string): void {
        this.title.setTitle(tit);
    }
    // 格式化参数
    public formatParams(data: any) {
        const arr: Array<any> = [];
        for (const name in data) {
            if (data.hasOwnProperty(name)) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
            }
        }
        arr.push(("v=" + Math.random()).replace(".", ""));
        return arr.join("&");
    }
    public isLogin(callback?: Function) {
        this.ajax("getCanUse", {
            success: (data: any) => {
                if (typeof callback === "function") {
                    callback.call(this, data);
                }
            },
            other: (data: any) => {
                if (data.resCode === '60003') {
                    this.removeLS();
                    this.router.navigate(["/login"]);
                } else if (data.resCode === '40001') {
                    this.ds.alert(data['resDesc'])
                    setTimeout(() => {
                        history.back();
                    }, 2000);
                } else {
                    this.ds.alert(data['resDesc']);
                }
            }
        });
    }
    public logout() {
        this.ajax("logout", {
            success: () => {
                this.removeLS();
                this.router.navigate(["/"]);
            }
        });
    }
    public getUrl(key: string): string {
        return this.getApi(key).split('@')[0];
    }

    private getApi(key: string): string {
        const prx: string = environment.prefix;
        // let version: string = environment.version;
        let _api = Api[key];

        // _api =
        // /^[ppm|order|interior]|^v(\d+(.+)\/ppm)|^v(\d+(.+)\/order)|^v(\d+(.+)\/interi
        // o r)/.test(val) ? this.ppm + val : this.prx + val; if
        // (/api\/v(\d+)\//.test(_api)) { return _api.replace(/api\//im, '') } else {

        if (!/\/$/.test(prx) && !/^\//.test(_api)) {
            _api = '/' + _api;
        }
        return prx + _api;
        // }
    }

    public getEnv() {
        return environment
    }

    public chain(url: string, param?: Object, dom?: string, callback?: Function) {
        let u: string = environment.act;
        const mt = /(\.com|\.cn|\.me|\.xyz)\//.test(url);
        const p: string = param
            ? encodeURIComponent(JSON.stringify(param))
            : '';

        if (dom) {
            u = dom;
        }

        if (p) {
            url = url.indexOf('?') > 0
                ? (url + '&chain=' + p)
                : (url + '?chain=' + p);
        }

        if (!mt) {
            url = u + '/' + url;
        }

        if (callback) {
            callback.call(this, url);
        }

        return url;
    }

    public en(type: string, psw: string, keyorigin: string, ivorigin?: string) { // 加密
        const encrypt: any = window['CryptoJS'];
        let ekey: any;
        let key: any;
        let eiv: any;
        let iv: any;
        const md = encrypt.MD5("shοng" + psw + "Ying").toString();
        const mdpsw = encrypt.enc.Utf8.parse(md);
        let encrypted: any;

        if (keyorigin) {
            if (type === 'login') {
                ekey = encrypt.MD5(keyorigin).toString().substring(8, 24);
            } else {
                ekey = keyorigin.replace(/\_/g, "0").replace(/\-/g, "1").substr(0, 16);
            }
            key = encrypt.enc.Utf8.parse(ekey);
        }
        if (type === 'login') {
            iv = key;
        } else if (ivorigin) {
            if (parseInt(ivorigin.charAt(ivorigin.length - 2)) % 2 == 0) {
                eiv = ivorigin.split('').reverse().join('').substr(0, 16);
            } else {
                eiv = ivorigin.substr(0, 16);
            }
            iv = encrypt.enc.Utf8.parse(eiv);
        }
        if (key && iv) {
            encrypted = encrypt.AES.encrypt(mdpsw, key, {
                iv: iv,
                mode: encrypt.mode.CBC
            });
        } else {
            encrypted = mdpsw
        }
        return encrypted.toString();
    }

    public cryptToken(type, token) {
        const encrypt = window['CryptoJS'];
        const key = encrypt.enc.Utf8.parse('feidefangjian888');
        const iv = encrypt.enc.Utf8.parse('shangyingjinfu88');
        let psw;
        if (!token) { return; }
        token = token.toString();
        if (type === 'encrypt') {
            psw = encrypt.AES.encrypt(token, key, {
                iv: iv,
                mode: encrypt.mode.CBC
            }).toString();
        } else if (type === 'decrypt') {
            psw = encrypt.AES.decrypt(token, key, {
                iv: iv,
                mode: encrypt.mode.CBC
            });
            psw = encrypt.enc.Utf8.stringify(psw);
        }
        return psw;
    }
    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

    // 本地存储 localstorage 读写一体
    public LStore(key: string, value?: any) {
        // 在iPhone/iPad上有时设置setItem()时会出现诡异的QUOTA_EXCEEDED_ERR错误
        // 这时一般在setItem之前，先removeItem()就ok了
        if (value) {
            if (localStorage.getItem(key) !== null) { localStorage.removeItem(key); }
            localStorage.setItem(key, this.serializeLS(value));
        } else {
            const val = this.deserializeLS(localStorage.getItem(key));
            return (val === undefined ? null : val);
        }

    }
    // 查询不存在的key时，有的浏览器返回undefined，这里统一返回null
    public getLS(key: string) {
        const val = this.deserializeLS(sessionStorage.getItem(key));
        return (val === undefined ? null : val);
    }
    // 本地存储 sessionstorage
    public setLS(key: string, value: any) {
        // 在iPhone/iPad上有时设置setItem()时会出现诡异的QUOTA_EXCEEDED_ERR错误
        // 这时一般在setItem之前，先removeItem()就ok了
        if (this.getLS(key) !== null) { this.removeLS(key); }
        sessionStorage.setItem(key, this.serializeLS(value));
    }
    public serializeLS(value: any) {
        if (typeof value === 'string') {
            return value;
        }
        return JSON.stringify(value);
    }
    public deserializeLS(value: string) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return value || undefined;
        }
    }
    public removeLS(key?: string): void {
        if (!key) {
            sessionStorage.clear();
        } else {
            sessionStorage.removeItem(key);
        }
    }

    //把数据暂存本地,必须在页面跳转之前调用，否则时间计算不准确
    public catch(key: string, value: any) {
        const stamp: number = new Date().getTime();
        value['stamp'] = stamp;
        this.setLS(key, value)
    }

    //获取暂存数据，如果超过30秒则标记为过期 reject
    public getCatched(key: string): any {
        const stamp: number = new Date().getTime();
        const _data = this.getLS(key);

        if (_data && _data['stamp']) {
            if (stamp - _data['stamp'] > 1000 * 30) {
                this.removeLS(key);
                return null;
            } else {
                return _data
            }
        }
    }
    //本地存储 end get Url Params
    public getUrlParam(name: string, _location?: string) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        let r: any;

        if (_location) {
            const loc = _location.split('?');
            if (loc.length > 1) {
                _location = loc[1]
            } else {
                return null;
            }
            r = _location.match(reg); //匹配目标参数
        } else if (location.search) {
            r = location.search
                .substr(1)
                .match(reg); //匹配目标参数
        } else {
            return null;
        }

        if (r != null) { return window['unescape'](r[2]); }
        return null; //返回参数值
    }
    // 更新验证token
    public activityToGo(nowNode?: string) {
        const m = this.getUrlParam('m');
        if (m) { this.setLS('token', this.decodeToken(m)); }
        const aNode = this.getUrlParam('aNode');
        const myparam = location.href.split('?')[1];
        let toGo: any;
        if (nowNode) {
            switch (aNode) {
                case 'userCertification':
                    toGo = 1; // 代表已结束返回活动页
                    break;
                case 'bindCard':
                    if (nowNode === 'certification') {
                        toGo = '/user/personal/bind-card?' + myparam;
                    } else {
                        toGo = 1;
                    }
                    break;
                case 'setTradePsw':
                    if (nowNode === 'certification') {
                        toGo = '/user/setting/set-trade-psw?' + myparam;
                    } else {
                        toGo = 1;
                    }
                    break;
                case 'userCharge':
                    if (nowNode === 'certification') {
                        toGo = '/user/personal/bind-card?' + myparam;
                    } else if (nowNode === 'bind-card') {
                        toGo = '/user/setting/set-trade-psw?' + myparam;
                    } else if (nowNode === 'set-trade-psw') {
                        toGo = '/user/charge?' + myparam;
                    } else {
                        toGo = 1;
                    }
                    break;
                default:
                    break;
            }
            return toGo;
        }
    }
    // public count(c){
    //     return new Promise((resolve,reject)=>{
    //         var timer = setInterval(()=>{
    //             if(--c>0){
    //                 resolve(c);
    //             } else{
    //                 clearInterval(timer);
    //                 resolve(false);
    //             }
    //         },1000)
    //     })
    // }
    getActUrl(): string {
        return decodeURIComponent(this.getUrlParam('acitityUrl') + '?m=' + this.cryptToken('encrypt', this.getLS('token')));
    }
    encodeToken(t): string {
        return encodeURIComponent(this.cryptToken('encrypt', t))
    }
    decodeToken(t): string {
        return this.cryptToken('decrypt', decodeURIComponent(t))
    }
    public formatDate(datetime: any, format: string) {
        const d: any = new Date(datetime);
        const date = {
            "M+": d.getMonth() + 1,
            "D+": d.getDate(),
            "h+": d.getHours(),
            "m+": d.getMinutes(),
            "s+": d.getSeconds(),
            "q+": Math.floor((d.getMonth() + 3) / 3),
            "S+": d.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (const k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k]
                    : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }

    public numberFormat(value: number) {
        let parts: any;
        let num: any = value + '';
        const precision: string = '2';
        if (!isNaN(parseInt(num)) && isFinite(num)) {
            num = Number(num);
            num = num
                .toFixed(precision)
                .toString();
            parts = num.split('.');
            parts[0] = parts[0]
                .toString()
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            return parts.join('.');
        }
        return NaN;
    }

    public privacy(str: string, start: number, length?: number, replacestr?: string): string {
        if (!str) { return ''; }
        const s = str.toString();
        let l = length;  // 需要替换个数
        let x = '';
        if (!l || l + start > s.length) { l = s.length - start; }
        for (let i = 0; i < l; i++) {
            x += replacestr || '*';
        }
        return s.substr(0, start) + x + s.substr(start + l + 1);
    }
    public accuracy(type: string, arg): number {
        if (type === 'mul') {
            let m = 0;
            const s1 = this.toString(), s2 = arg.toString();
            try { m += s1.split(".")[1].length } catch (e) { }
            try { m += s2.split(".")[1].length } catch (e) { }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        }
    }
    public getLocaleDate(): string {
        return (new Date().toLocaleDateString()).toString();
    }
    public toFixed(num, s) {
        const times = Math.pow(10, s);
        let des: any = num * times + 0.5 + '';
        des = parseInt(des, 10) / times;
        return des + '';
    }
    // 节流方法，防止频繁触发请求调用
    public iThrottle(frequency?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.timerInput) {
                clearTimeout(this.timerInput);
                this.timerInput = null;
            }
            this.timerInput = setTimeout(() => {
                resolve(true);
            }, frequency ? frequency : 350);
        });
    }
}

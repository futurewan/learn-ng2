import { ApiService } from '../api/api.service';

export interface ShareConf {
    title: string;
    titleTimeline?: string;
    link: string;
    desc: string;
    imgUrl: string;
    imgUrlTimeline?: string;
    success?: Function;
}

export class WxConfig {
    private wx: any = window['wx'];
    private shareData: ShareConf;
    private appId: string;
    constructor(private shared: ShareConf, private api: ApiService, private onInit?: Function) {
        this.shareData = shared;
        if (!this.wx) {
            const wxscript = document.createElement('script');
            wxscript.src = '//res.wx.qq.com/open/js/jweixin-1.0.0.js';
            wxscript.onload = () => {
                this.wx = window['wx'];
                this.wxInit();
            }
            document.body.appendChild(wxscript)
        } else {
            this.wxInit();
        }

    }

    //获取JS-SDK使用权限验证配置
    wxInit() {
        const params = { 'url': this.shareData.link };
        this.initShare();

        if (this.onInit) {
            this.onInit.call(this);
        }
        // alert(this.shareData.link)
        this.api.ajax('wxConf', {
            data: params,
            success: (data: any) => {
                data = data.data;
                this.appId = data.appId;
                this.wx.config({
                    // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名，见附录1
                    jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareQZone"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            }
        });

    }


    //获取微信appid
    // wxAppid() {
    //   this.api.ajax('wxId', {
    //     success: (data: any) => {
    //       let appid = data.data.appId;
    //       return data
    //     }
    //   })
    // }

    //获取微信用户信息
    wxUserInfo(code: string, call: Function) {
        this.api.ajax('wxUser', {
            data: {
                code: code
            },
            success: (data: any) => {
                call.call(this, data)
            },
            other: () => alert('微信授权失效，请重新操作')
        });
    }


    redictWxAuth(url?: string): string {
        const rurl = encodeURIComponent(url || this.pureWxUrl()); // 授权后重定向链接地址 redirect_uri/?code=微信返回的code&state=STATE
        const appId = this.appId;
        const $url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" +
            rurl + "&response_type=code&scope=snsapi_userinfo&state=" + new Date().getTime();
        return $url;
    }

    private pureWxUrl(): string {
        let url = location.href;
        const sc = location.search;
        if (/^\?code/.test(url)) {
            url = url.replace(/\?code(.+)$/, '')
        } else if (/&code/.test(url)) {
            url = url.replace(/&code(.+)$/, '')
        }
        return url;
    }

    initShare() {
        const turl = this.shareData.link.split('?');
        let nurl;
        if (turl.length > 1) {
            nurl = turl[0] + '?sys=share&' + turl[1];
        } else {
            nurl = turl[0] + '?sys=share';
        }
        const friends = {
            title: this.shareData.title,
            link: nurl,
            desc: this.shareData.desc,
            imgUrl: this.shareData.imgUrl
        }
        const timeline = {
            title: this.shareData.titleTimeline || this.shareData.title,
            link: nurl,
            imgUrl: this.shareData.imgUrlTimeline || this.shareData.imgUrl
        }
        const wx = this.wx;
        wx.ready(function () {
            wx.onMenuShareAppMessage(friends);
            wx.onMenuShareTimeline(timeline);
            wx.onMenuShareQQ(friends);   // qq好友
            wx.onMenuShareQZone(friends); // qq空间
        });
    }

}

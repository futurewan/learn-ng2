import { Injectable } from '@angular/core';

import { WxConfig, ShareConf } from '../../core/util/wx';
import { ApiService } from '../../core/api/api.service';
import { DialogService } from './dialog.service';
@Injectable()
export class WXShareService {
    private wxSet: WxConfig;
    private wxShares: ShareConf;
    private title: string;
    private titleTimeline: string;
    private link: string;
    private desc: string;
    private imgUrl = location.protocol + '//' + location.host + '/assets/images/icon-80.png';
    private imgUrlTimeline = location.protocol + '//' + location.host + '/assets/images/icon-80-l.png';
    private shareCol: any;
    // private routerUrl: string;
    constructor(private api: ApiService, private dialogService: DialogService) { }
    shareSetting(url: string, sharesO?: any) {
        this.link = location.href.split('#')[0];
        let curl: string; // 处理路径
        curl = url.slice(1).split('?')[0].replace(/\//g, '_');
        // this.shareCol = this.api.getLS('shareCol') || {};
        // this.routerUrl = url;  // 原始路径
        // if (typeof this.shareCol !== 'object') {
        //     this.shareCol = {};
        // }
        // if (this.shareCol[curl]) {
        //     return;
        // } else if (curl === 'support_chain' && this.routerUrl.indexOf('html')) {
        //     let pra = this.routerUrl.match(/\%2F[\w_]+.html/g)[0].replace(/^(%2F)/, '').replace(/(.html)$/, '')
        //     if (this.shareCol['support_chain_' + pra]) {
        //         return;
        //     } else {
        //         this.shareCol['support_chain_' + pra] = 1;
        //     }

        // } else {
        //     this.shareCol[curl] = 1;
        // }
        // this.api.setLS('shareCol', this.shareCol);
        if (curl.indexOf('login') > -1) {
            return;
        } else if (sharesO) {
            this.title = sharesO.title;
            this.desc = sharesO.desc;
            sharesO.titleTimeline && (this.titleTimeline = sharesO.titleTimeline);
            sharesO.link && (this.link = sharesO.link);
        } else if (curl === 'products') {
            this.title = '商赢金服|让投资更简单更全面更智能';
            this.desc = '100%真实抵押标的，A股上市公司实力护航，历史年化收益率更可达8%以上！';
        } else if (curl === 'loan') {
            this.title = '商赢金服|经过深思熟虑的人，都会在这里借钱';
            this.desc = '商赢金服提供专属金融通道，一对一专业融资服务，手续简单，放款迅速。借钱，从未如此简单！';
        } else if (curl === 'loan_loanhouse') {
            this.title = '借钱，从未如此简单|商赢金服“房易贷”';
            this.desc = '有房就能借款，单笔50-1000万超高额度，月息低至0.68%。';
        } else if (curl === 'loan_loanvehicle') {
            this.title = '借钱，从未如此简单|商赢金服“车易贷”';
            this.desc = '实车抵押，手续简便；5-60万借款额度；最快当天即可到账。';
        } else if (curl === 'order_exp') {
            this.title = '商赢金服|新客超级体验金';
            this.desc = '新客注册即可获得高达18000元体验金！二十七块五毛八免费送！';
        } else if (curl === 'support_chain' && url.indexOf('actlist.html') > -1) {
            this.title = '商赢金服活动中心';
            this.desc = '精彩活动邀您参加';
        } else {
            this.title = '商赢金服|让投资更简单更全面更智能';
            this.desc = '100%真实抵押标的，A股上市公司实力护航，协议约定收益率更可达8%以上！';
        }

        this.wxShares = {
            title: this.title,
            link: this.link,
            desc: this.desc,
            imgUrl: this.imgUrl,
            titleTimeline: this.titleTimeline,
            imgUrlTimeline: this.imgUrlTimeline
        };
        this.wxSet = new WxConfig(this.wxShares, this.api);
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'yl-mainnav',
    template: `
  <div class="weui-tabbar">
      <a routerLink="/products" class="weui-tabbar__item icon-sy-index" routerLinkActive='icon-sy-index-on weui-bar__item_on' [ngClass]="{'icon-sy-index-on weui-bar__item_on':OU===true}">
          <p class="weui-tabbar__label">首页</p>
      </a>
      <a routerLink="/loan" class="weui-tabbar__item icon-sy-loan" routerLinkActive='icon-sy-loan-on weui-bar__item_on'>
          <p class="weui-tabbar__label">借款</p>
      </a>
      <a routerLink="/find" class="weui-tabbar__item icon-sy-find" routerLinkActive='icon-sy-find-on weui-bar__item_on'>
          <p class="weui-tabbar__label">发现</p>
      </a>
      <a routerLink="/user" class="weui-tabbar__item icon-sy-my" routerLinkActive='icon-sy-my-on weui-bar__item_on'>
          <p class="weui-tabbar__label">我的</p>
      </a>
  </div>
  `,
    styles: [`
  .weui-tabbar{
    background-color:#fff;
    box-shadow:0 0 5px rgba(0,0,0,.2)
  }
  `]
})

export class NavComponent implements OnInit {
    OU: boolean;
    constructor(private router: Router) { }
    ngOnInit() {
        if (this.router.url === '/' || this.router.url.indexOf('products') > -1) {
            this.OU = true;
        } else {
            this.OU = false;
        }
    }
}


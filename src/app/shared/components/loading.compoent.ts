import { Component } from '@angular/core';

@Component({
    selector: 'yl-loading',
    template: `
        <div class="weui-mask_transparent"></div>
        <div class="weui-toast">
            <i class="weui-loading weui-icon_toast"></i>
            <p class="weui-toast__content">数据加载中</p>
        </div>
  `
})

export class YlLoadingComponent {}


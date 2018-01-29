import { Component, OnInit, OnDestroy, EventEmitter, ViewChild, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { DialogService } from './dialog.service';
import { DialogConfigOptions, DialogComponent } from './dialog.com';

@Component({
    selector: 'yl-dialog-wraper',
    template: `<div #dialogAnchor></div>`,
    entryComponents: [DialogComponent]// 必须，否则组件不会被加载
})

export class DialogMainComponent implements OnInit, OnDestroy {
    private subs: Subscription;
    @Input() option: DialogConfigOptions;  //接收参数配置

    @ViewChild('dialogAnchor', { read: ViewContainerRef }) dialogAnchor: ViewContainerRef; //查看子组件dom

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private dialogService: DialogService) { }

    ngOnInit() {
        this.subs = this.dialogService.forChild.subscribe(
            (data: any) => {
                if (data instanceof Object) {
                    this.option = data;
                    this.openDialogBox();
                } else { //快捷指令
                    switch (data) {
                        case 'open':
                            this.openDialogBox();
                            break;
                        case 'close':
                            this.dialogAnchor.clear();
                    }
                }
            });
    }

    openDialogBox() {
        this.dialogAnchor.clear(); //清除之前已经存在的dialog
        const dialogComponentFactory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent); // 读取子组件并初始化为组件类
        const dialogComponentRef = this.dialogAnchor.createComponent(dialogComponentFactory); //创建新的组件实例
        // console.log(dialogComponentRef)
        dialogComponentRef.instance.close.subscribe((msg: string) => {
            this.send(msg);
            dialogComponentRef.destroy();
            this.option = null;
        });

        //给模板赋值
        this.option.type = this.option.type || 'default';
        for (const item in this.option) {
            if (this.option.hasOwnProperty(item)) {
                dialogComponentRef.instance.configs[item] = this.option[item]
            }
        }
        this.send('init');
    }

    send(msg: string) {
        this.dialogService.sendToParent(msg)
    }

    ngOnDestroy() {
        this.subs.unsubscribe()
    }

}

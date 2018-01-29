import {
    Directive,
    ElementRef, // 用来操作DOM
    // Input, // 将数据从绑定表达式传达到指令中
    // TemplateRef, // 用来访问组件模版
    //Renderer: 渲染新节点
    // ViewContainerRef, // 作为视图内容渲染器，将模版内容插入至DOM中
    HostListener, // 属性装饰器，用来监听宿主元素事件
    HostBinding // 属性装饰器，用来动态设置宿主元素的属性值
} from "@angular/core";
// import { HostListener } from "@angular/core/src/metadata/directives";

@Directive({ selector: "[ylBb]" })
export class MyLessDirective {
    private hasView = false;
    constructor(
        // private templateRef: TemplateRef<any>,
        // private viewContainer: ViewContainerRef,
        private el: ElementRef
    ) { }
    // @HostBinding('style.background-color') bgcolor: any;
    @HostListener('mouseenter') onmouseenter() {
        this.highlight('yellow')
    }
    @HostListener('mouseleave') onmouseleave() {
        this.highlight('white')
    }

    private highlight(color: string) {
        //    this.bgcolor = color;
        this.el.nativeElement.style.backgroundColor = color;
        // console.log(this.bgcolor)
    }
    // @Input()
    // set myLess(condition: boolean) {
    //     if (!condition && !this.hasView) {
    //         this.viewContainer.createEmbeddedView(this.templateRef);
    //         this.hasView = true;
    //     } else if (condition && this.hasView) {
    //         this.viewContainer.clear();
    //         this.hasView = false;
    //     }
    // }
}

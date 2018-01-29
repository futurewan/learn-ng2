import {
    Directive,
    AfterViewInit,
    ViewChild,
    HostListener,
    ElementRef,
    Input,
} from '@angular/core';

@Directive({
    selector: '[ylClearvalue]'
})
export class ClearValueDirective implements AfterViewInit {
    private ele = this.el.nativeElement; //input
    // @Input() ylClearvalue:any;
    private clearEle;
    constructor(private el: ElementRef) { }
    ngAfterViewInit() {
        this.clearEle = this.ele.nextSibling;
        // this.clearEle.addEventListener('click',
        //     () => {
        //         // this.form.get(key).setValue('');
        //         // this.ele.setValue('');
        //         // this.ylClearvalue.controls('')
        //         this.clearEle.style.display = 'none';
        //     },
        //     true
        // );
    }
    @HostListener('blur')
    blurEle() {
        setTimeout(() => {
            this.clearEle.style.display = 'none';
        }, 0);
    }
    @HostListener('focus')
    FocusEle() {
        this.toggleClear();
    }
    @HostListener('input')
    change() {
        this.toggleClear();
    }

    private toggleClear() {
        if (this.ele.value.length === 0) {
            this.clearEle.style.display = 'none';
        } else {
            this.clearEle.style.display = 'block';
        }
    }
}

import {
    Directive,
    AfterViewInit,
    ViewChild,
    HostListener,
    ElementRef,
    Input,

} from '@angular/core';

@Directive({
    selector: '[ylSubsection]'
})
export class SubsectionDirective implements AfterViewInit {
    private ele = this.el.nativeElement; //input
    @Input() ylSubsection: any;
    constructor(private el: ElementRef) { }
    ngAfterViewInit() {
        console.log(this.ylSubsection)
    }
    @HostListener('input')
    change() {
        if (this.ylSubsection === 'bankCard') {
            this.ele.value = this.ele.value.replace(/\D/g, '').replace(/(....)(?=.)/g, '$1 ');
            console.log(this.ele.value)
        }
    }

}

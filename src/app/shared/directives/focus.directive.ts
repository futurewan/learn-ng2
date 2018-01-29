import { Directive, ElementRef, Input, AfterContentChecked } from '@angular/core';

@Directive({
    selector: '[ylFocus]'
})
export class FocusDirective implements AfterContentChecked {
    @Input() ylFocus: boolean;
    private element: HTMLElement;
    private hasFocused = false;

    constructor(private $element: ElementRef) {
        this.element = $element.nativeElement;
    }

    ngAfterContentChecked() {
        this.giveFocus();
    }

    giveFocus() {
        if (this.ylFocus && !this.hasFocused) {
            // this.renderer.invokeElementMethod(this.element, 'focus', []);
            this.element.focus();
            this.hasFocused = true;
        }
    }
}

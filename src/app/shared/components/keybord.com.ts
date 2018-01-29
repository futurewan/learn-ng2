import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'yl-keybord',
    template: `
        <div class="keybord weui-actionsheet weui-actionsheet_toggle" [class.bottom20] = "isIphone">
            <div class="tit dix alc boxc border-top-onepx">
                <span class="flex1"></span><span class="dib t-link" (touchstart)="toFinish()">完成</span>
            </div>
            <div class="it dix alc jct">
                <span class="border-right-onepx" (touchstart)="setVal(1)">1</span>
                <span class="border-right-onepx" (touchstart)="setVal(2)">2</span>
                <span class="" (touchstart)="setVal(3)">3</span>
            </div>
            <div class="it dix alc jct border-top-onepx">
                <span class="border-right-onepx" (touchstart)="setVal(4)">4</span>
                <span class="border-right-onepx" (touchstart)="setVal(5)">5</span>
                <span class="" (touchstart)="setVal(6)">6</span></div>
            <div class="it dix alc jct border-top-onepx">
                <span class="border-right-onepx" (touchstart)="setVal(7)">7</span>
                <span class="border-right-onepx" (touchstart)="setVal(8)">8</span>
                <span class="" (touchstart)="setVal(9)">9</span></div>
            <div class="it dix alc jct border-top-onepx">
                <span class="border-right-onepx" (touchstart)="setVal('X')">X</span>
                <span class="border-right-onepx" (touchstart)="setVal(0)">0</span>
                <span class="icon-delete" (touchstart)="setVal('D')"></span>
            </div>
        </div>
    `,
    styles: [`
        .keybord .tit{
            height: 45px;
            background: #f1f1f3;
            text-align: right;
            }
        .keybord .it span{
            font-size: 20px;
            color:#333;
            position: relative;
            height: 55px;
            line-height: 55px;
            text-align: center;
            background: #fff;
            flex: 1;
            -webkit-box-flex: 1;
        }
        .keybord .it span:active{
            background-color: #d1d4dd
        }
        .keybord .border-top-onepx:before,
        .border-right-onepx:after{z-index:10;border-color: #929395}
        .bottom20{bottom:40px}
    `]
})

export class KeybordComponent implements OnInit {
    @Input() oldValue: string;
    @Output() newValue = new EventEmitter<string>();
    @Output() finish = new EventEmitter<boolean>();
    isIphone;
    // private nv:string;
    constructor() { }

    ngOnInit() {
        if (this.oldValue === undefined) {
            this.oldValue = '';
        }

        if (window.navigator.userAgent.indexOf('iPhone') > -1) {
            this.isIphone = true;
        }
    }
    setVal(v) {
        if (v === 'D') {
            this.oldValue = this.oldValue.slice(0, this.oldValue.length - 1)
        } else {
            if (this.oldValue.length < 18) {
                this.oldValue += v;
            }
        }
        this.newValue.emit(this.oldValue);
    }
    toFinish() {
        this.finish.emit(false);
    }
}

export {KBPagesRendererDirective, KBPage} from './render.component';
import {Component, ContentChild, ElementRef, EventEmitter, Input, Output} from "@angular/core";
import {PageSliderControlAPI} from "../types";
import {KBPage, KBPagesRendererDirective} from "./render.component";
import {SlideAnimation} from "../functionality/animation";
import {SideClickHandler} from "../functionality/sideclick";
import {TouchEventHandler} from "../functionality/touchevents";
import {ArrowKeysHandler} from "../functionality/arrowkeys";


// PAGE CONTAINER DIRECTIVE(页面容器指令) =================================================================
// Handles fancy things like page animation and controls KBPagesRendererDirective
// 处理页面动画和控制KBPagesRendererDirective

@Component({
    selector: 'kb-page-slider',
    template: `
        <!-- Display the actual pages -->
        <div class="inner"
             [style.width]="containerWidth"
             [style.height]="containerHeight"
        >
            <ng-content></ng-content>
        </div>

        <!-- Display the page indicator -->
        <kb-dot-indicator *ngIf="showIndicator"
                          [page]="page"
                          [pageCount]="pageCount"
                          [dotColor]="dotColor"
                          [style.bottom]="dotBottom">
        </kb-dot-indicator>
    `,
    styles: [
            `:host {
            overflow: hidden;
            display: block;
            position: relative;
            height: 100%
        }`,
            `.inner {
            position: absolute;
            top: 0;
            will-change: left;
        }`,
            `kb-dot-indicator {
            position: absolute;
            width: 100%;
        }`,
            `:host-context(.find) kb-dot-indicator {
            bottom: 11px;
            padding: 0 11px;
            -webkit-box-pack: end;
            justify-content: flex-end;
        }
        `
    ]
})
export class KBPageSliderComponent implements PageSliderControlAPI {
    // 定义私有变量
    private innerContainer: HTMLElement;
    private touchEventHandler: TouchEventHandler;
    private sideClickHandler: SideClickHandler;
    private arrowKeysHandler: ArrowKeysHandler;

    constructor(private element: ElementRef) {
        const htmlElement = this.element.nativeElement;
        this.touchEventHandler = new TouchEventHandler(this, htmlElement);
        this.sideClickHandler = new SideClickHandler(this, htmlElement);
        this.arrowKeysHandler = new ArrowKeysHandler(this, htmlElement);

    }


    // PUBLIC INTERFACE(公共接口) =====================================================================
    @Input()
    public set page(pn: number) {
        if (pn < 0 || pn >= this.pageCount) return;
        if (pn == this.renderer.page) return;
        if (this.renderer) {
            if (pn == this.renderer.page + 1) {
                if (this.blockInteraction) {
                    this.pageChange.emit(this.page);
                    return;
                }
                this.AnimateToNextPage();
            } else if (pn == this.renderer.page - 1) {
                if (this.blockInteraction) {
                    this.pageChange.emit(this.page);
                    return;
                }
                this.AnimateToPreviousPage();
            } else {
                if (this.blockInteraction) {
                    this.pageChange.emit(this.page);
                    return;
                }
                this.renderer.page = pn;
                this.pageChange.emit(pn);
            }
        }
    }

    public get page() {
        return (this.renderer) ? this.renderer.page : 0;
    }

    @Output() pageChange = new EventEmitter<number>();
    @Output() pageSizeChange = new EventEmitter<[number, number]>();

    public get pageCount() {
        return (this.renderer) ? this.renderer.pageCount : 0;
    }

    @Output() pageCountChange = new EventEmitter<number>();

    // Dot Indicator
    @Input() public showIndicator: boolean = true;
    @Input() public find: string;
    @Input() public overlayIndicator: boolean = true;
    @Input() public dotColor: string = 'white';

    // Interactivity
    @Input() public locked: boolean = false;
    @Input() public transitionDuration: number;
    @Input() public enableOverscroll: boolean = true;

    @Input()
    public set enableSideClicks(enabled: boolean) {
        (this.sideClickHandler) ? this.sideClickHandler.enabled = enabled : null;
    }

    @Input()
    public set enableArrowKeys(enabled: boolean) {
        (this.arrowKeysHandler) ? this.arrowKeysHandler.enabled = enabled : null;
    }

    @Output() scrollStateChange = new EventEmitter<boolean>();


    // INTERNAL STATE =======================================================================

    private _pageOffset: number = 1;
    protected get pageOffset() {
        return this._pageOffset;
    }

    protected set pageOffset(v: number) {
        this._pageOffset = v;
        if (!this.blockInteraction) {
            this.innerContainer.style.left = this.pxOffset;
        }
    }

    private get pxOffset() {
        return -this.pageOffset * this.pageWidth + "px";
    }


    // SIZING

    public get pageWidth() {
        return this.element.nativeElement.offsetWidth;
    }

    public get pageHeight() {
        var fullHeight = this.element.nativeElement.offsetHeight;
        // var chin = (this.showIndicator && !this.overlayIndicator) ? 20 : 0;
        return fullHeight;
    }

    public get containerWidth() {
        return this.pageWidth * 3 + "px";
    }

    public get containerHeight() {
        return this.pageHeight + "px";
    }

    private get dotBottom() {
        if (this.overlayIndicator && !this.find) {
            return '16px';
        }
    }

    //auto play declars
    private pageNo: number = 0;
    private interVal: any;

    @Input() private auto: boolean;
    // Get the page renderer loop and keep its size up to date
    @ContentChild(KBPagesRendererDirective) renderer: KBPagesRendererDirective;

    ngOnInit() {
        if (!this.renderer) {
            console.log(`
				由于缺少 *kbPages 指令，slider将不能正确生成，因为缺少必须要的指令.
			`);
            throw new Error('kb-page-slider必须声明 *kbPages 指令！');
        }

        this.renderer.pageCountChange.subscribe((count: any) => {
            this.pageCountChange.emit(count);
        });

        this.Resize();
        this.renderer.Resize(this.pageWidth, this.pageHeight);
        window.addEventListener("resize", () => {
            this.Resize();
            this.renderer.Resize(this.pageWidth, this.pageHeight);
            this.pageSizeChange.emit([this.pageWidth, this.pageHeight]);
        });

        if (this.auto) {
            this.autoPlay()
        }
    }

    private autoPlay() {
        let cont = this.pageCount;

        this.interVal = setInterval(() => {
            if (this.pageCount < 2) {
                this.dotColor = 'transparent';
                return clearInterval(this.interVal);
            }
            this.AnimateToNextPage();
            this.pageNo++;
        }, 5000);
    }

    private pause() {
        if (this.interVal) clearInterval(this.interVal);
    }

    private resume() {
        if (this.auto) {
            this.autoPlay()
        }
    }

    protected Resize() {
        this.innerContainer = this.element.nativeElement.querySelector(".inner");
        this.innerContainer.style.left = -this.pageWidth + "px";
    }


    // INTERACTIVE NAVIGATION ===============================================================

    private blockInteraction: boolean = false;

    public ScrollTo(x: number) {
        if (this.locked || this.blockInteraction) return;
        this.pageOffset = this.ClampX(x);
    }

    public AnimateToNextPage(momentum?: number) {
        if (this.locked || this.blockInteraction) return;
        if (this.page == this.renderer.pageCount - 1) {
            this.renderer.page = 0;
            return this.AnimateToX(1, 0).then(() => {
                this.pageOffset = 1;
            })
        }
        if (momentum === undefined) momentum = 0;

        this.AnimateToX(2, momentum).then(() => {
            this.renderer.page++;
            this.pageChange.emit(this.renderer.page);
            this.pageOffset = 1;
        });
    }

    public AnimateToPreviousPage(momentum?: number) {
        if (this.locked || this.blockInteraction) return;
        if (this.page == 0) {
            return this.AnimateToX(1, 0).then(() => {
                this.pageOffset = 1;
            })
        }
        if (momentum === undefined) momentum = 0;

        this.AnimateToX(0, momentum).then(() => {
            this.renderer.page--;
            this.pageChange.emit(this.renderer.page);
            this.pageOffset = 1;
        });
    }

    public AnimateToX(x: number, momentum: number) {
        if (this.locked || this.blockInteraction) return;
        this.blockInteraction = true;

        var w = this.pageWidth;
        return new SlideAnimation(
            this.innerContainer,	 	// Element to animate
            -this.pageOffset * w,		// Current position (px)
            -x * w,	 					// Destination position (px)
            momentum * w,			 	// User scroll momentum (px/s)
            this.transitionDuration		// Default duration, when momentum = 0
        ).then(() => {
            this.blockInteraction = false;
        });
    }

    public StartScroll() {
        this.scrollStateChange.emit(true)
    }

    public EndScroll() {
        this.scrollStateChange.emit(false)
    }

    public StartTouch() {
        this.pause()
    }

    public EndTouch() {
        this.resume()
    }

    // OVERSCROLL (iOS STYLE) ===============================================================

    // Get X to a reasonable range, taking into account page boundaries
    protected ClampX(x: number) {
        if (x < 0) x = 0;
        if (x > 2) x = 2;

        // Allow some overscrolling on the first and last page
        if (this.page == 0 && x < 1) {
            if (this.enableOverscroll) x = 1 - this.OverscrollRamp(1 - x);
            else x = 1;
        }
        if (this.page == this.renderer.pageCount - 1 && x > 1) {
            if (this.enableOverscroll) x = 1 + this.OverscrollRamp(x - 1);
            else x = 1;
        }
        return x;
    }

    // Exponential ramp to simulate elastic pressure on overscrolling
    protected OverscrollRamp(input: number): number {
        return Math.pow(input, 0.5) / 5;
    }
}

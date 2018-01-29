import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef
} from "@angular/core";
import { CustomerComponent } from "../customer-service.com";
@Component({
  selector: "yl-sibling",
  template: `<div #wrap></div>`
})
export class FormSiblingComponent implements OnInit, AfterViewInit, OnDestroy {
  componentRef: ComponentRef<any>;
  @Input() source: any;
  @ViewChild("wrap", { read: ViewContainerRef })
  componentWrap: ViewContainerRef;
  @ViewChild("wrap") wrap: ElementRef;
  constructor(private cfr: ComponentFactoryResolver) {}

  ngOnInit() {
  }
  ngAfterViewInit() {
    if (this.source === "customer") {
      const com = this.cfr.resolveComponentFactory(CustomerComponent);
      this.componentRef = this.componentWrap.createComponent(com);
      this.componentRef.instance.type = "new-short-num";
    } else {
      this.wrap.nativeElement.innerHTML = this.source;
    }
  }
  ngOnDestroy() {
    this.componentRef && this.componentRef.destroy();
  }
}

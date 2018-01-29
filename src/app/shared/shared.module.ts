import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomerComponent } from './components/customer-service.com';
import { DialogTemplateComponent } from './components/dialog/dialog-sub-template.com';
import { FormCollectionComponent } from './components/form/form-collection.com';
import { FormItemComponent } from './components/form/form-item.com';
import { FormSiblingComponent } from './components/form/form-siblings.com';

import { NumberFormat } from './pipes/numberFormat.pipe';
import { GbkFormat } from './pipes/gbk.pipe';
import { PrivacyPip } from './pipes/privacy.pipe';
import { WeekPip } from './pipes/week.pipe';
import { DatePipe } from './pipes/date.pipe';
import { SafePipe } from './pipes/safeUrl.pipe';
import { Prezero } from './pipes/prezero.pipe';

import { FocusDirective } from './directives/focus.directive';
import { NgxHighchartsDirective } from './directives/ngx-highcharts';
import { MyLessDirective } from './directives/myless.directive';
import { SubsectionDirective } from './directives/subsection.directive';
import { ClearValueDirective } from './directives/clear-value.directive';
// import { HtmlOutlet } from './directives/dhtml.directive';
// sliders
import { KBPagesRendererDirective } from './components/picslider/components/render.component';
import { KBPageSliderComponent } from './components/picslider/components/pageslider.component';
import { KBDotIndicatorComponent } from './components/picslider/components/dotindicator.component';
import { DialogComponent } from './components/dialog/dialog.com';
import { DialogMainComponent } from './components/dialog/main.com';
import { NavComponent } from './components/nav.com';
import { KeybordComponent } from './components/keybord.com';


const share = [
    NumberFormat,
    PrivacyPip,
    WeekPip,
    DatePipe,
    SafePipe,
    Prezero,
    GbkFormat,
    FocusDirective,
    SubsectionDirective,
    NgxHighchartsDirective,
    KBPagesRendererDirective,
    KBPageSliderComponent,
    ClearValueDirective,
    KBDotIndicatorComponent,
    MyLessDirective,
    NavComponent,
    KeybordComponent,
    DialogComponent,
    CustomerComponent,
    DialogTemplateComponent,
    FormCollectionComponent,
    FormSiblingComponent,
    FormItemComponent,
    DialogMainComponent];

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    declarations: share,
    entryComponents: [CustomerComponent],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        share
    ]
})
export class SharedModule {}

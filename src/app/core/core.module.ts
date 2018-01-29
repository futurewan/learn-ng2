import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders,
  ErrorHandler
} from '@angular/core';

// 一次性的组件
import { YlLoadingComponent } from '../shared/components/loading.compoent';
import { MyErrorHandler } from './util/error-handle';

// 不要在共享模块中把应用级单例添加到providers中。 否则如果一个惰性加载模块导入了此共享模块，就会导致它自己也生成一份此服务的实例
import { StateService } from '../shared/services/state.service';
import { ApiService } from './api/api.service';

import { DialogService } from '../shared/services/dialog.service';
import { FormService } from '../shared/services/form.service';
import { WXShareService } from '../shared/services/wxshare.service';

@NgModule({
  declarations: [YlLoadingComponent],
  providers: [ApiService, StateService,
    DialogService,
    FormService,
    WXShareService, { provide: ErrorHandler, useClass: MyErrorHandler }],
  exports: [YlLoadingComponent]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
  // static forRoot(config: UserServiceConfig): ModuleWithProviders {
  //     return {
  //       ngModule: CoreModule,
  //       providers: [
  //         {provide: UserServiceConfig, useValue: config }
  //       ]
  //     };
}

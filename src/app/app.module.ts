import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomPreloadingStrategy } from './core/util/selective-preloading-strategy';

import { RouterModule } from '@angular/router';
import { routes } from './app-routing.module';
// import './rxjs-ext';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloadingStrategy })
  ],
  providers: [CustomPreloadingStrategy],
  bootstrap: [AppComponent]
})
export class AppModule { }

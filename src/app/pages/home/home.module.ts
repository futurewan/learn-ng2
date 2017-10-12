import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeIndexComponent } from './home-index/home-index.component';

const routes: Routes = [
    {
        path: '',
        component: HomeIndexComponent,
        data: { title: '商赢金服' }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [],
    declarations: [HomeIndexComponent],
    providers: [],
})
export class HomeModule { }

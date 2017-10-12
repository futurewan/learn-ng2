import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindIndexComponent } from './find-index/find-index.component';
const routes: Routes = [
    {
        path: '',
        component: FindIndexComponent,
        data: { title: '商赢金服' }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [],
    declarations: [FindIndexComponent],
    providers: [],
})
export class FindModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoanIndexComponent } from './loan-index/loan-index.component';
const routes: Routes = [
    {
        path: '',
        component: LoanIndexComponent,
        data: { title: '商赢金服' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [],
    declarations: [LoanIndexComponent],
    providers: [],
})
export class LoanModule { }

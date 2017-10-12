import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules} from '@angular/router';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: './pages/home/home.module#HomeModule',
        data: { title : '首页' }
    },
    {
        path: 'loan',
        loadChildren: './pages/loan/loan.module#LoanModule',
        data: { title : '借款' }
    },
    {
        path: 'find',
        loadChildren: './pages/find/find.module#FindModule',
        data: { title : '发现' }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(
        routes,
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeIndexComponent } from './pages/home/home-index/home-index.component';

export const routes: Routes = [
    // { path: '', component: HomeIndexComponent, pathMatch: 'full' },
    {
        path: 'home',
        loadChildren: './pages/home/home.module#HomeModule',
        data: { preload: true }
    },
    {
        path: 'loan',
        loadChildren: './pages/loan/loan.module#LoanModule',
        data: { preload: true },
    },
    {
        path: 'find',
        loadChildren: './pages/find/find.module#FindModule',
        data: { preload: true },
    }
];

@NgModule({
    imports: [],
    declarations: [],
    providers: [],
    exports: [RouterModule]
})
export class AppRoutingModule { }

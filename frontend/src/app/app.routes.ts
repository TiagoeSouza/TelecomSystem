// // import { Routes } from '@angular/router';

// // export const routes: Routes = [];


// // src/app/app.routes.ts
// import { Routes } from '@angular/router';
// import { provideRouter } from '@angular/router';

// import { LoginComponent } from './auth/login/login.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { AuthGuard } from './core/auth.guard';

// export const appRoutes: Routes = [
//     { path: 'login', component: LoginComponent },
//     {
//         path: 'dashboard',
//         component: DashboardComponent,
//         canActivate: [AuthGuard]
//     },
//     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//     { path: '**', redirectTo: 'dashboard' }
// ];

// export const appRouter = provideRouter(appRoutes);


// app.routes.ts
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './core/auth.guard';
import { EmptyLayoutComponent } from './layouts/logoff/logoff.component';
import { FullLayoutComponent } from './layouts/logon/logon.component';
import { ContratoFormComponent } from './pages/contratos/contrato-form.component';
import { OperadoraFormComponent } from './pages/operadoras/operadora-form.component';
import { FaturaFormComponent } from './pages/faturas/fatura-form.component';
import { OperadoraListComponent } from './pages/operadoras/operadora-list.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: FullLayoutComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'home' },
            { path: 'dashboard', component: DashboardComponent },

            { path: 'operadoras', component: OperadoraListComponent },
            { path: 'operadoras/novo', component: OperadoraFormComponent },
            { path: 'operadoras/:id', component: OperadoraFormComponent },

            { path: 'contratos', component: ContratoFormComponent },
            { path: 'faturas', component: FaturaFormComponent },

        ],
    },
    {
        path: '',
        component: EmptyLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
        ]
    }
];


export const appRoutes = provideRouter(routes); // <-- ISSO sim é um provider válido

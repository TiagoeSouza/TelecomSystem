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
import { AuthGuard } from './services/auth.guard';
import { EmptyLayoutComponent } from './layouts/logoff/logoff.component';
import { FullLayoutComponent } from './layouts/logon/logon.component';
import { ContratoFormComponent } from './pages/contratos/contrato-form/contrato-form.component';
import { OperadoraFormComponent } from './pages/operadoras/operadora-form/operadora-form.component';
import { FaturaFormComponent } from './pages/faturas/fatura-form/fatura-form.component';
import { OperadoraListComponent } from './pages/operadoras/operadora-list/operadora-list.component';
import { FilialListComponent } from './pages/filiais/filial-list/filial-list.component';
import { FilialFormComponent } from './pages/filiais/filial-form/filial-form.component';
import { ContratoListComponent } from './pages/contratos/contrato-list/contrato-list.component';
import { FaturaListComponent } from './pages/faturas/fatura-list/fatura-list.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: FullLayoutComponent,
        children: [
            // Rotas para o layout completo
            { path: '', pathMatch: 'full', redirectTo: 'home' },

            // Rotas para a tela "inicial/dashboard"
            { path: 'dashboard', component: DashboardComponent },

            // Rotas para o CRUD de Filiais
            { path: 'filiais', component: FilialListComponent },
            { path: 'filiais/novo', component: FilialFormComponent },
            { path: 'filiais/:id', component: FilialFormComponent },

            // Rotas para o CRUD de Operadoras
            { path: 'operadoras', component: OperadoraListComponent },
            { path: 'operadoras/novo', component: OperadoraFormComponent },
            { path: 'operadoras/:id', component: OperadoraFormComponent },

            // Rotas para o CRUD de Contratos
            { path: 'contratos', component: ContratoListComponent },
            { path: 'contratos/novo', component: ContratoFormComponent },
            { path: 'contratos/:id', component: ContratoFormComponent },

            // Rotas para o CRUD de Faturas
            { path: 'faturas', component: FaturaListComponent },
            { path: 'faturas/novo', component: FaturaFormComponent },
            { path: 'faturas/:id', component: FaturaFormComponent },

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

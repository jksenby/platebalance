import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: 'profile',
        loadComponent: () => import('./components/main/profile/profile').then(m => m.Profile),
        canActivate: [authGuard]
    },
    {
        path: 'survey',
        loadComponent: () => import('./components/main/survey/survey').then(m => m.Survey),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login').then(m => m.Login)
    },
    {
        path: 'registration',
        loadComponent: () => import('./components/auth/registration/registration').then(m => m.Registration)
    },
    {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
    }
];

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./auth/components/login/login').then(m => m.Login)
    },
    {
        path: 'registration',
        loadComponent: () => import('./auth/components/registration/registration').then(m => m.Registration)
    },
    {
        path: 'profile',
        loadComponent: () => import('./profile/components/main/main').then(m => m.Main),
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
    }
];

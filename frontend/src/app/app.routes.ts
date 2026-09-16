import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./auth/pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'registration',
        loadComponent: () => import('./auth/pages/registration/registration.component').then(m => m.RegistrationComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('./profile/pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'survey',
        loadComponent: () => import('./profile/pages/survey/survey.component').then(m => m.SurveyComponent),
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
    }
];

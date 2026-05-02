import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'subjects',
        loadComponent: () => import('./pages/subjects/subjects.page').then( m => m.SubjectsPage)
      },
      {
        path: 'study-sessions',
        loadComponent: () =>
          import('./pages/study-sessions/study-sessions.page').then(m => m.StudySessionsPage)
      },
          ]
  },
  {
    path: '**',
    redirectTo: 'login'
  },
  {
    path: 'subjects',
    loadComponent: () => import('./pages/subjects/subjects.page').then( m => m.SubjectsPage)
  },
  {
    path: 'study-sessions',
    loadComponent: () => import('./pages/study-sessions/study-sessions.page').then( m => m.StudySessionsPage)
  },
];

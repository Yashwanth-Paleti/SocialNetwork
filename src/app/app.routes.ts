import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home').then(m => m.HomeComponent), canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent) },
  { path: 'explore', loadComponent: () => import('./components/explore/explore').then(m => m.ExploreComponent), canActivate: [authGuard] },
  { path: 'upload', loadComponent: () => import('./components/upload-image/upload-image').then(m => m.UploadImageComponent), canActivate: [authGuard] },
  { path: 'profile/:id', loadComponent: () => import('./components/profile/profile').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'post/:id', loadComponent: () => import('./components/image-detail/image-detail').then(m => m.ImageDetailComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];

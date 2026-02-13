import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { LabComponent } from './pages/lab/lab';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'lab', component: LabComponent },
  { path: '**', redirectTo: 'login' }
];

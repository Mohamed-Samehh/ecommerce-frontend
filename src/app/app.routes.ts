import { Routes } from '@angular/router';
import {NotFound} from './pages/not-found/not-found';
import { Admin } from './pages/admin/admin';
import { CategoryAdmin } from './components/category-admin/category-admin';

export const routes: Routes = [

  {
    path: 'admin',
    component: Admin,
    children: [
      { path: 'categories', component: CategoryAdmin }
    // add  admin routes
    ]
  },

  {path: '**', component: NotFound} //must be at end:  match any wrong path and redirect to 404 page
];

import { Routes } from '@angular/router';
import {NotFound} from "./pages/not-found/not-found";

export const routes: Routes = [




    {path: '**', component: NotFound} //must be at end:  match any wrong path and redirect to 404 page
];

// Angular modules
import { NgModule }          from '@angular/core';
import { Routes }            from '@angular/router';
import { RouterModule }      from '@angular/router';

// Components
import { NotFoundComponent } from './static/not-found/not-found.component';

const routes : Routes = [
 

  {
    path         : '',
    loadChildren : () => import('./pages/buimat/buimat.module').then(m => m.HomeModule),
  }, {
    path         : '',
    loadChildren : () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },
 
  { path : '',   redirectTo : 'buimat', pathMatch : 'full' },
  { path : '**', component : NotFoundComponent }
];

@NgModule({
  imports : [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports : [RouterModule]
})
export class AppRoutingModule { }

// Angular modules
import { NgModule }                 from '@angular/core';
import { Routes }                   from '@angular/router';
import { RouterModule }             from '@angular/router';
import { AuthGuard } from '../../../app/_helpers/auth.guard';

// Components
import { AuthComponent }            from './auth/auth.component';
import { ForgotPasswordComponent }  from './auth/forgot-password/forgot-password.component';
import { LoginComponent }           from './auth/login/login.component';
import { MobileVerificationComponent } from './auth/mobile-verification/mobile-verification.component';
import { AdminComponent } from '../auth/auth/admin/admin.component';
import { KycComponent } from './auth/kyc/kyc.component';


const routes : Routes = [
  {
    path      : '',
    component : AuthComponent,
    children  : [
      {
        path       : '',
        redirectTo : 'login',
        pathMatch  : 'full',
      },
      {
        path      : 'login',
        component : LoginComponent
      },
      {
        path      : 'forgot-password',
        component : ForgotPasswordComponent,
      },
      {
        path      : 'kyc',
        component : KycComponent,
      },
      {
        path      : 'mobile-verification',
        component : MobileVerificationComponent,
      }, {
        path      : 'admin',
        component : AdminComponent,
        canActivate: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  imports :
  [
    RouterModule.forChild(routes)
  ],
  exports :
  [
    RouterModule
  ],
  providers :
  [
  ]
})
export class AuthRoutingModule { }

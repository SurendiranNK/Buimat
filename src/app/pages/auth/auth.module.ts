// Angular modules
import { CommonModule }             from '@angular/common';
import { NgModule }                 from '@angular/core';

// Internal modules
import { AuthRoutingModule }        from './auth-routing.module';
import { SharedModule }             from '../../shared/shared.module';
import {​​​​​​​​ MatDatepickerModule }​​​​​​​​ from'@angular/material/datepicker';
import {​​​​​​​​ MatInputModule }​​​​​​​​ from'@angular/material/input';
// Components
import { AuthComponent }            from './auth/auth.component';
import { ForgotPasswordComponent }  from './auth/forgot-password/forgot-password.component';
import { LoginComponent }           from './auth/login/login.component';
import { MobileVerificationComponent } from './auth/mobile-verification/mobile-verification.component';
import { AdminComponent }           from '../auth/auth/admin/admin.component';

import { NgxPaginationModule }      from 'ngx-pagination';
import { FontAwesomeModule }        from '@fortawesome/angular-fontawesome'
import { MultiSelectModule } from 'primeng/multiselect';
import { MatSortModule} from '@angular/material/sort';
import { KycComponent } from './auth/kyc/kyc.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { ToastrModule } from 'ngx-toastr';
import {MatNativeDateModule} from '@angular/material/core';
import { FilterPipe } from '../../_helpers/filter.pipe'; // -> imported filter pipe
import { ToastModule } from 'primeng/toast';
import { CommaSeparatedDirective } from 'src/app/_directives/comma-separated.directive';
import { ImageFileDirective } from 'src/app/_directives/image-file.directive';
import { AlphanumericDirective } from 'src/app/_directives/alphanumeric.directive';
import { NoDecimalDirective } from 'src/app/_directives/no-decimal.directive';
import { IntegerOnlyDirective } from 'src/app/_directives/integer-only.directive';
import { TwoDigitDirective } from 'src/app/_directives/two-digit.directive';
import { SecurePipe } from 'src/app/_helpers/secure.pipe';
import {DropdownModule} from 'primeng/dropdown';
import { HSNDirective } from 'src/app/_directives/hsn-directive';
import { NoRepeatedCommasDirective } from 'src/app/_directives/noRepeatedCommas.directive'; // Import your directive

@NgModule({
  declarations    :
  [
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent,
    MobileVerificationComponent,ImageFileDirective,HSNDirective,
    AdminComponent,IntegerOnlyDirective,SecurePipe,NoRepeatedCommasDirective,
    KycComponent,FilterPipe,CommaSeparatedDirective,AlphanumericDirective,NoDecimalDirective,TwoDigitDirective
  ],
  imports         :
  [
    CommonModule,ToastModule,DropdownModule,
    AuthRoutingModule,MatSortModule,MatInputModule,MatDatepickerModule,MatNativeDateModule,
    NgxPaginationModule,MultiSelectModule,NgOtpInputModule,
    SharedModule,FontAwesomeModule,ToastrModule.forRoot()
  ],
})
export class AuthModule { }

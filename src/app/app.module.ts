// Angular modules
import { HttpClient }           from '@angular/common/http';
import { HttpClientModule }     from '@angular/common/http';
import { APP_INITIALIZER }      from '@angular/core';
import { NgModule }             from '@angular/core';
import { Injector }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { DatePipe }             from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// External modules
import { TranslateService }     from '@ngx-translate/core';
import { TranslateModule }      from '@ngx-translate/core';
import { TranslateLoader }      from '@ngx-translate/core';
import { TranslateHttpLoader }  from '@ngx-translate/http-loader';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ToastrModule } from 'ngx-toastr';

// Internal modules
import { AppRoutingModule }     from './app-routing.module';
import { SharedModule }         from './shared/shared.module';
import { StaticModule }         from './static/static.module';

// Services
import { AppService }           from '@services/app.service';
import { OrderService }           from '@services/order.service';
import { StoreService }         from '@services/store.service';
import { ProductService }         from '@services/products.service';

// Components
import { AppComponent }         from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// Factories
import { appInitFactory }       from '@factories/app-init.factory';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgOtpInputModule } from 'ng-otp-input';
import { AuthInterceptor } from './_helpers/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { ToastModule } from 'primeng/toast';
// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';
// import { AngularFireStorageModule } from '@angular/fire/compat/storage';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
// import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import localeFr from '@angular/common/locales/fr';

import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { SpinnerComponent } from './spinner/spinner.component';
import { ProductFormComponent } from './component/product-form/product-form.component';
import { ProductListComponent } from './component/product-list/product-list.component';

registerLocaleData(localeFr);


@NgModule({
  imports: [
    // Angular modules
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    ToastrModule.forRoot(),
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFireAuthModule,
    // AngularFirestoreModule,
    // AngularFireStorageModule,
    // AngularFireDatabaseModule,
    // External modules
    TranslateModule.forRoot({
      loader :
      {
        provide    : TranslateLoader,
        useFactory : (createTranslateLoader),
        deps       : [HttpClient]
      }
    }),
    AngularSvgIconModule.forRoot(),

    // Internal modules
    SharedModule,
    StaticModule,MaterialTimePickerModule,
    AppRoutingModule,ToastModule,
    FontAwesomeModule,NgOtpInputModule,
    NgbModule
  ],
  declarations: [
    AppComponent,
    SpinnerComponent,
    ProductFormComponent,
    ProductListComponent,
   ],
  providers: [
    {provide: HTTP_INTERCEPTORS,useClass: AuthInterceptor,multi: true,},
    {provide: HTTP_INTERCEPTORS,useClass: LoaderInterceptor,multi: true,},
    // External modules
    {
      provide    : APP_INITIALIZER,
      useFactory : appInitFactory,
      deps       : [ TranslateService, Injector ],
      multi      : true
    },

    // Services
    AppService,
    StoreService,OrderService,ProductService,

    // Pipes
    DatePipe,

    // Guards

    // Interceptors
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function createTranslateLoader(http : HttpClient)
{
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// providers: [
//   {
//     provide: HTTP_INTERCEPTORS,
//     useClass: LoadingInterceptor,
//     multi: true,
//   },
// ],
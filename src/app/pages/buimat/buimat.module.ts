// Angular modules
import { CommonModule }      from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ButtonModule } from 'primeng/button';
import {MycurrencyPipe} from '../../_helpers/custom.currencypipe';
import { NgxPaginationModule }      from 'ngx-pagination';

import { ToastModule } from 'primeng/toast';

// Internal modules
import { SharedModule }      from '../../shared/shared.module';
import { BuimatRoutingModule } from './buimat-routing.module';
import { NgModule }                 from '@angular/core';

// Components
import { BuimatComponent }     from './buimat.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { VendorComponent } from './vendor/vendor.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { PolicyComponent } from './policy/policy.component';
import {SliderModule} from 'primeng/slider';
import { SuccessComponent } from './success/success.component';
import { FailureComponent } from './failure/failure.component';
import { NumericInputDirective } from 'src/app/_directives/numeric-input.directive';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { RefundpolicyComponent } from './refundpolicy/refundpolicy.component';
import { AgreementComponent } from './agreement/agreement.component';
import { SelleragreementComponent } from './selleragreement/selleragreement.component';

@NgModule({
  imports :
  [
    CommonModule,TimepickerModule.forRoot(),
    BuimatRoutingModule,NgxPaginationModule,ToastModule,SliderModule,
    SharedModule,NgbModule,CarouselModule,SlickCarouselModule,ButtonModule,
  ],
  declarations :
  [
    BuimatComponent,NumericInputDirective,
    HomeComponent,
    ProductDetailsComponent,
    CartComponent,
    WishlistComponent,
    ProductCategoryComponent,
    VendorComponent,
    CheckoutComponent,MycurrencyPipe, TermsConditionsComponent, AboutUsComponent, ContactComponent, PolicyComponent, SuccessComponent, FailureComponent, RefundpolicyComponent, AgreementComponent, SelleragreementComponent
  ],
})
export class HomeModule { }

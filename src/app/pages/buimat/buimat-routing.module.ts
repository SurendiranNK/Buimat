// Angular modules
import { NgModule }      from '@angular/core';
import { RouterModule }  from '@angular/router';
import { Routes }        from '@angular/router';

// Components
import { BuimatComponent } from './buimat.component';
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
import { SuccessComponent } from './success/success.component';
import { FailureComponent } from './failure/failure.component';
import { RefundpolicyComponent } from './refundpolicy/refundpolicy.component';
import { AgreementComponent } from './agreement/agreement.component';
import { SelleragreementComponent } from './selleragreement/selleragreement.component';
import { ProductFormComponent } from 'src/app/component/product-form/product-form.component';
import { ProductListComponent } from 'src/app/component/product-list/product-list.component';

const routes: Routes = [
  {
    path      : '',
    component : BuimatComponent,
    children  : [
      {
        path       : '',
        redirectTo : 'home',
        pathMatch  : 'full',
      },
      // {
      //   path      : 'home',
      //   component : HomeComponent,
        
      // },
      {
        path      : 'home',
        component : ProductFormComponent,
        
      },
      {
        path      : 'app-product-list',
        component : ProductListComponent,
        
      },
      {
        path      : 'product-category/:categoryName',
        component : ProductCategoryComponent
      },
      {
        path      : 'cart',
        component : CartComponent
      },
      {
        path      : 'products/:productName',
        component : ProductDetailsComponent
      },     {
        path      : 'wishlist',
        component : WishlistComponent
      },   {
        path      : 'vendor',
        component : VendorComponent
      },   {
        path      : 'checkout',
        component : CheckoutComponent
      },   {
        path      : 'terms-conditions',
        component : TermsConditionsComponent
      },   {
        path      : 'about-us',
        component : AboutUsComponent
      },   {
        path      : 'contact',
        component : ContactComponent
      },   {
        path      : 'policy',
        component : PolicyComponent
      },   {
        path      : 'success',
        component : SuccessComponent
      },   {
        path      : 'failure',
        component : FailureComponent
      },   {
        path      : 'refund',
        component : RefundpolicyComponent
      },   {
        path      : 'agreement',
        component : AgreementComponent
      },   {
        path      : 'seller-agreement',
        component : SelleragreementComponent
      }
    ]
  }
];

@NgModule({
  imports : [ RouterModule.forChild(routes) ],
  exports : [ RouterModule ]
})
export class BuimatRoutingModule { }

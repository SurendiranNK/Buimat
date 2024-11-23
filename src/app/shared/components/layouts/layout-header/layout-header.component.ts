// Angular modules
import { Component,ViewChild ,TemplateRef}   from '@angular/core';
import { OnInit }      from '@angular/core';
import { Router }      from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { AppService }   from '@services/app.service';
import { AuthenticationService } from '../../../../_services/authentication.service';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
// Internal modules
import { environment } from '@env/environment';
import { HomeComponent } from 'src/app/pages/buimat/home/home.component';
import { OrderService } from '@services/order.service';
import { Validators, FormGroup,UntypedFormBuilder } from '@angular/forms';
import { SharedService } from '@services/shared.service';

@Component({
  selector    : 'app-layout-header',
  templateUrl : './layout-header.component.html',
  styleUrls   : ['./layout-header.component.css']
})
export class LayoutHeaderComponent implements OnInit
{
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  faSearch = faSearch;
  public appName         : string  = environment.appName;
  public isMenuCollapsed : boolean = true;
  public isLoading : boolean = true;
  userName:string="";
  userInfo:any="";
  isUserLoggedin :boolean=false;
  categoryData: any = {};
  categoryLists:any =[];
  cartLists:any =[];
  form: FormGroup;
  _delivery_id = "0"
  error=""
  deliveryAddress:any
  billingAddress:any
  locationInfo:any={};
  cartCount=0
  wishListCount=0
  @ViewChild('_home') _homeComponent: HomeComponent;
  isSubmit= false;

  constructor
  (
    private router : Router,    
    private appServices : AppService,
    private modalService: NgbModal,
    private orderServices    : OrderService ,
    private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private sharedServices:SharedService
  ){

  }

  public ngOnInit() : void{
    // setTimeout(_ =>
    // {
    //   this.isLoading = false;
    // }, 2000);

    this.sharedServices.sharedData$.subscribe((value) => {
      this.cartCount=this.cartCount+value
    });

    this.sharedServices.sharedDataNumber$.subscribe((value) => {
      this.wishListCount= this.wishListCount+value
    });
    
    this.form = this.formBuilder.group({
      pincode:['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")]],
    });
    
    var infoLocation = localStorage.getItem('locationInfo')!;
    if(infoLocation!=null){
      this.locationInfo = JSON.parse(infoLocation);
    }
    this._delivery_id = localStorage.getItem('_delivery_id')!

    var userdata_ = localStorage.getItem('userInfo')!;
    this.userInfo = JSON.parse(userdata_);    
    if (userdata_) {
      this.isUserLoggedin = true;
      this.getDeliveryAddress();
    }else{
      this.isUserLoggedin = false;

      this.openModal();
    }
    this.getCatgoryLists()

    this.getCount();
  }

  getCount(){
    this.orderServices.getCount()
    .pipe(first())
    .subscribe({
        next: (data) => {

          console.log(JSON.stringify(data.data))
          this.sharedServices.updateCartNumber(data.data.cartCount)
          this.sharedServices.updateWishlistNumber(data.data.wishlistCount)
          
          // localStorage.setItem("cartCount",data.data.cartCount);
          // localStorage.setItem("wishlistCount",data.data.wishlistCount);

      },
        error: error => {
            this.error = error;
            //Swal.fire("Error!",error.error.message,  "error")   
        }
    });
  }
  logout(){
    Swal.fire({
      text: 'Are you sure you want to logout?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Log out.',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.value) {
        this.authenticationService.logout(2);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  showProductDetails(data){

    const jsonCategoryInfo = {
      "_id":data._id,
      "categoryName":data.categoryName
    }


    localStorage.setItem("categoryProducts",JSON.stringify(jsonCategoryInfo));
    this.appServices.setCategoryProductDetails(jsonCategoryInfo);
    var router= this.router.url.slice(0, this.router.url.lastIndexOf('/'));
    if(router === '/product-category'){
      this.router.navigate(['/product-category/', data.categoryName]);
      setTimeout(_ => {
          window.location.reload();
        }, 500);
        
    }else{
      this.router.navigate(['/product-category/', data.categoryName]);

    }
  
  }
  get ff() { return this.form.controls; }

  gotoWishlist(){
    this.router.navigate(['wishlist/']);
  }
  goToCart(){
    this.router.navigate(['cart/']);
  }
  // -------------------------------------------------------------------------------
  // NOTE Init ---------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Actions ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public async onClickLogout() : Promise<void>
  {
    // NOTE Redirect to login
    this.router.navigate(['/login']);
  }

  omit_special_char(event:any) {   
    var k;  
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }
  getCatgoryLists(){
    this.appServices.getCategoryLists().subscribe((data: {}) => {
      this.categoryData = data;
      this.categoryLists = this.categoryData.data.categories;
      console.log(" - - "+JSON.stringify(this.categoryLists))
    });
  }
  openModal(){
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title',size:'md', windowClass: 'center-modal'}).result.then((result) => {
    }, (reason) => {
    });
  }
  getDeliveryAddress(){
    this.orderServices._getDeliveryAddress()
    .pipe(first())
    .subscribe({
        next: (data) => {
            this.deliveryAddress = data.data.deliveryAddress
            this.billingAddress = data.data.billingAddress
            this.deliveryAddress[0]['_id']="0"
          
            if(this.deliveryAddress.length>0 && localStorage.getItem("locationInfo") === null){
              this.deliveryAddress[0].isSelected = true
              const data={
                'pincode': this.deliveryAddress[0].pincode,
                'locationDetail':this.deliveryAddress[0].city,
                'addressLine1':this.deliveryAddress[0].addressLine1,
                "addressLine2": this.deliveryAddress[0].addressLine2,
                "city":this.deliveryAddress[0].city,
                "state": this.deliveryAddress[0].state,
                "contactNumber":this.deliveryAddress[0].contactNumber,
                "username": this.deliveryAddress[0].username,
                "landmark": this.deliveryAddress[0].landmark
              }
              this.locationInfo = data;
              localStorage.setItem('_delivery_id',"0");
              localStorage.setItem('locationInfo', JSON.stringify(data));
            }
           },
        error: error => {
            this.error = error;
            //Swal.fire("Error!",error.error.message,  "error")   
        }
    });
  }
  selectDelieveryAddress(data:any, position:number){

          var infoLocation = localStorage.getItem('locationInfo')!;
          if(infoLocation!=null){
            this.locationInfo = JSON.parse(infoLocation);
          }

          var cartData_ = localStorage.getItem('cartLists')!
          this.cartLists = JSON.parse(cartData_)

          var router= this.router.url;   
          
          

          if(data.pincode!=this.locationInfo.pincode){
            if(router === '/cart' || router==='/checkout'){
              if(this.cartLists.length>0){
                var jsonDataArray:any=[]

                  for (let i = 0; i < this.cartLists.length; i++) {
                    const _jsonObject= {
                      "cartId": this.cartLists[i]._id,
                      "cgst": this.cartLists[i].cgst,
                      "sgst": this.cartLists[i].sgst,
                      "unitPriceWithoutGST": this.cartLists[i].unitPriceWithoutGST,
                      "unitPriceWithGST": this.cartLists[i].unitPriceWithGST,
                      "totalPriceWithGST": this.cartLists[i].totalPriceWithGST,
                      "totalPriceWithoutGST": this.cartLists[i].totalPriceWithoutGST,
                      "totalGST": this.cartLists[i].totalGST,
                      "quantity": this.cartLists[i].quantity,
                      "priceFormulaWithGST": this.cartLists[i].priceFormulaWithGST,
                      "priceFormulaWithoutGST": this.cartLists[i].priceFormulaWithoutGST,
                      "productId": this.cartLists[i].productDetails._id,
                      "orderedUnit": this.cartLists[i].orderedUnit._id
                    }
                    jsonDataArray.push(_jsonObject)
                  }

                 var data_json = {
                  "deliveryPincode": data.pincode,
                  "carts": jsonDataArray
                 }

                Swal.fire({
                  text: "On changing the delivery locations, product prices will get updated accordingly. Please ensure to continue",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, Continue.."
                }).then((result) => {
                  this.orderServices.updateCart(data_json)
                  .pipe(first())
                  .subscribe({
                      next: (successData) => {
                        const jsonData={
                          'pincode': data.pincode,
                          'locationDetail':data.city,
                          'addressLine1':data.addressLine1,
                          "addressLine2": data.addressLine2,
                          "city":data.city,
                          "state": data.state,
                          "contactNumber":data.contactNumber,
                          "landmark":data.landmark,
                          "username": data.username,
                          
                          
                        }
                        this.modalService.dismissAll();
                        localStorage.setItem('_delivery_id',data._id);
                        localStorage.setItem('locationInfo', JSON.stringify(jsonData));
                        window.location.reload();
                        Swal.fire("Success!","Cart Updated Succesfully",  "success")   
                    },
                      error: error => {
                          this.error = error;
                          Swal.fire("Error!",error.error.message,  "error")   
                      }
                  });
                
                });

                return;
              }else{

              }
            }
          }
          // alert(JSON.stringify(data))
          // console.log("---------"+JSON.stringify(data))
          const jsonData={
            'pincode': data.pincode,
            'locationDetail':data.city,
            'addressLine1':data.addressLine1,
            "addressLine2": data.addressLine2,
            "city":data.city,
            "state": data.state,
            "contactNumber":data.contactNumber,
            "username": data.username,
            "landmark": data.landmark
          }
          this.modalService.dismissAll();
          localStorage.setItem('_delivery_id',data._id);
          localStorage.setItem('locationInfo', JSON.stringify(jsonData));
           window.location.reload();


         
  }
  onSubmit(){
    this.isSubmit = true;
      if (this.form.invalid) {
        return;
      }
      var strPINCODE = this.form.get('pincode')?.value.trim();


      this.appServices.checkPincode(strPINCODE)
      .pipe(first())
      .subscribe({
      next: (data) => {
           if(data.status){
            localStorage.setItem('_delivery_id',"");
            localStorage.setItem('locationInfo', JSON.stringify(data.data));
            this.modalService.dismissAll();
            window.location.reload();

            Swal.fire({
              icon: "success",
              position: "top-end",
              text: "Location Updated Successfully",
              timer:1000
            });
           }else{
            Swal.fire({
              icon: "error",
              title: "Sorry!...",
              text: data.message,
            });
           }
        },
          error: error => {
            this.error = error;
            Swal.fire("Error!",error.error.message,  "error")   
          }
      });
  }
  login(){
    this.modalService.dismissAll()
    this.router.navigate(['/mobile-verification']);
  }
  showVendor(){
    if(!this.isUserLoggedin){
      this.openModal()
      return
    }
    this.router.navigate(['/vendor']);
  }
}
  // -------------------------------------------------------------------------------
  // NOTE Computed props -----------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Helpers ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Requests -----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Subscriptions ------------------------------------------------------------
  // -------------------------------------------------------------------------------

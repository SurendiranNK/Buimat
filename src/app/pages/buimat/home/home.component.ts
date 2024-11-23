import { Component,OnInit ,ViewChild,ElementRef,TemplateRef} from '@angular/core';
import { AppService }   from '@services/app.service';
import { ProductService }         from '@services/products.service';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router }       from '@angular/router';
import { Validators, FormGroup,UntypedFormBuilder } from '@angular/forms';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { OrderService } from '@services/order.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '@services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit
{

   slideConfig = { slidesToShow: 5, slidesToScroll: 5 };

  @ViewChild('widgetsContent') widgetsContent: ElementRef;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;

  cityData: any
  cityLists:any 

  brandData: any
  brandLists:any 

  categoryData: any 
  categoryLists:any 
  productsData:any 
  productsDataLists:any
  error=""
  deliveryAddress:any
  billingAddress:any
  categoryProductsData:any
  categoryProductsDataLists:any
  _selected_delivery_address:string="0"


  constructor(
    private appServices     : AppService,
    private modalService: NgbModal,
    private productServices :ProductService,    
    private formBuilder: UntypedFormBuilder,
    private orderServices:OrderService,
    private sharedServices:SharedService,
    private router: Router) {
  }
  
  form: FormGroup;
  is_categorySubmit = false;
  is_subCategorySubmit = false;
  is_productsSubmit = false;
  is_brandSubmit= false;
  is_zoneSubmit= false;
  isSubmit= false;
  userInfo:any="";
  favourites:any[]=[]
  pincode=""
  isUserLoggedin :boolean=false;


  public ngOnInit() : void{


    var userdata_ = localStorage.getItem('userInfo')!;
    this.userInfo = JSON.parse(userdata_);    
    
    if (userdata_) {
      this.isUserLoggedin = true;
      this.pincode = this.userInfo.pincode;
    }else{
      this.isUserLoggedin = false;
    }
    //console.log("user - -"+JSON.stringify(this.userInfo))

    this.getFavourites();
    this.getAllCategoryProductLists( this.pincode);

    this.form = this.formBuilder.group({
      pincode:['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")]],
    });
  }

  getFavourites(){
    this.orderServices.getFavourites()
    .pipe(first())
    .subscribe({
        next: (data) => {
        this.favourites = data.data.products;
        localStorage.setItem("favourites",JSON.stringify(this.favourites));
         this.updateProducts();
      },
        error: error => {
            this.error = error;
            //Swal.fire("Error!",error.error.message,  "error")   
        }
    });
  }
  openModal(){
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title',size:'md', windowClass: 'center-modal'}).result.then((result) => {
    }, (reason) => {
    });
  }
  /*--------------- Category-------------- */

  // getCatgoryLists(){
  //   this.appServices.getCategoryLists().subscribe((data: {}) => {
  //     this.categoryData = data;
  //     this.categoryLists = this.categoryData.data.categories;
  //   });
  // }
  // getBrandLists(){
  //   this.appServices.getBrandLists().subscribe((data: {}) => {
  //     this.brandData = data;
  //     this.brandLists = this.brandData.data.brands;
  //     //console.log(JSON.stringify(this.brandLists))
  //   });
  // }
  get ff() { return this.form.controls; }

  // getProductLists(){
  //   this.appServices.getProductLists().subscribe((data: {}) => {
  //     this.productsData = data;
  //     this.productsDataLists = this.productsData.data.products;
  //     // console.log(JSON.stringify(this.productsDataLists))

  //   });
  // }
  getAllCategoryProductLists(pincode){

    this.productServices.getAllCategoryProductLists(pincode).subscribe((data: {}) => {
      this.categoryProductsData = data;
      this.categoryProductsDataLists = this.categoryProductsData.data.categories;
      console.log("---"+JSON.stringify( this.categoryProductsDataLists))
    
      this.updateProducts();
      
    });
  }
  updateProducts(){
    for(var k=0;k<this.categoryProductsDataLists?.length;k++){
      for(var j=0;j<this.categoryProductsDataLists[k].products.length;j++){

        this.categoryProductsDataLists[k].products[j]['isFavourite'] = false
        var _json = this.favourites.find(p => p._id === this.categoryProductsDataLists[k].products[j]._id);
        if(_json){
          this.categoryProductsDataLists[k].products[j]['isFavourite'] = true
        } else{
          this.categoryProductsDataLists[k].products[j]['isFavourite']=false 
        }
      }
    }
  }

  isFavourite(id){
    var _json = this.favourites.find(p => p._id === id);
    return _json?true:false
  }
  login(){
    this.modalService.dismissAll()
    this.router.navigate(['/mobile-verification']);
  }
  showProductDetails(data:any){
      if(!this.isUserLoggedin){
        this.openModal()
        return
      }
   
      this.appServices.setProductDetails(data);
      localStorage.setItem("_productInfo",JSON.stringify(data));
      this.router.navigate(['/products/', data.productName]);

  }


  viewAll(categoryProducts:any){
    const jsonCategoryInfo = {
      "_id":categoryProducts._id,
      "categoryName":categoryProducts.categoryName
    }
    localStorage.setItem("categoryProducts",JSON.stringify(jsonCategoryInfo));
    this.appServices.setCategoryProductDetails(jsonCategoryInfo);
    this.router.navigate(['/product-category/', categoryProducts.categoryName]);
  }

  scrollLeft(){
    this.widgetsContent.nativeElement.scrollLeft -= 150;
  }

  scrollRight(){
    this.widgetsContent.nativeElement.scrollLeft += 150;
  }
  omit_special_char(event:any) {   
    var k;  
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }

  addtoFavourite(cData:any,status_:boolean){
    const jsonData={
      "productId":cData._id,
      "favourite": status_
    }
    this.productServices.addFavourites(jsonData)
        .pipe(first())
        .subscribe({
           next: (data) => {
            if(data.status){

              if(status_){
                this.sharedServices.updateWishlistNumber(1)
              }else{
                this.sharedServices.updateWishlistNumber(-1)
              }

              for(var k=0;k<this.categoryProductsDataLists?.length;k++){
                for(var j=0;j<this.categoryProductsDataLists[k].products.length;j++){

                  if(this.categoryProductsDataLists[k].products[j]._id ===  cData._id){
                      this.categoryProductsDataLists[k].products[j].isFavourite = status_;
                      break;
                  }
                }
              }
              this.getFavourites();
            }   
          },
            error: error => {
                this.error = error;
                Swal.fire("Error!",error.error.message,  "error")   
            }
        });
  
  }

}

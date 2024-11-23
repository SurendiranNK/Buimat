import { Component,OnInit ,ViewChild,ElementRef,EventEmitter,Input} from '@angular/core';
import { AppService }   from '@services/app.service';

import { Router, NavigationEnd } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ProductService } from '@services/products.service';
import { OrderService } from '@services/order.service';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { SharedService } from '@services/shared.service';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  providers: [MessageService]

})
export class ProductDetailsComponent implements OnInit
{
  slideConfig = { slidesToShow: 5, slidesToScroll: 5 };

  @ViewChild('widgetsContent') widgetsContent: ElementRef;
  quantity = 0;

  tempQuantity = 0
  cart_id='';
  minimumQuantity= 0
  error = '';
  cartLists:any =[]

  _similar_productsLists: any = [];
  allProducts: any = [];


  productDetails: any =[];
  
 _productPricing: any = {}
  _selected_image:any=""

  _ls_productInfo:any={}
  _ls_product_id:string=""
  _ls_category_id:string=""

  _is_VariablePricing :boolean=false;
  _is_Alt_Pricing:boolean = false;

  _isPrimaryPricing:boolean = true;

  _p_priceWithGST:string="";
  _p_priceWithOutGST:string="";
  _a_priceWithGST:string="";
  _a_priceWithOutGST:string="";

   isCartUpdate = false;
   isAddedtoCart = false;
   pincode:string="";

  _baseprice_p_priceWithGST:string="";
  _baseprice_p_priceWithOutGST:string="";
  _baseprice_a_priceWithGST:string="";
  _baseprice_a_priceWithOutGST:string="";

  totalPriceWithGST="";
  totalPriceWithoutGST="";


  _variablePricingLists:any=[];
  favourites:any=[]
  
  isFavourite:boolean = false

  constructor(
    private productServices:ProductService,
    private messageService:MessageService,
    private orderServices :OrderService,
    private sharedServices:SharedService,
    private location :Location,
    private router:Router   ) {   
  }

  public ngOnInit() : void{
    
    var infoLocation = localStorage.getItem('locationInfo')!;
    if(infoLocation!=null){
      var data_location = JSON.parse(infoLocation);
      this.pincode= data_location.pincode;
    }
  
    const _productInfo = localStorage.getItem("_productInfo")!!;
    this.favourites = JSON.parse(localStorage.getItem("favourites")!);

    this._ls_productInfo = JSON.parse(_productInfo);
    this._ls_product_id = this._ls_productInfo._id;
    this.getSingleProductData();
    // this.getProductPrice();
    this.getCartLists();
    window.scrollTo(0, 0) 

  }    
  getPriceWithGST(data:any){
    var percentageAmount_cgst = data.product.mrp * (parseInt(data.product.cgst)/100); 
    var percentageAmount_sgst = data.product.mrp * (parseInt(data.product.sgst)/100); 
    var total =percentageAmount_cgst+percentageAmount_sgst+data.product.mrp
    return total;
  } 

  handleMinus() {
    if(this.quantity==this.minimumQuantity){
      this.messageService.clear();
      this.messageService.add({
        severity: "warn",
        detail: "Minimum quantity cannot be less than "+this.minimumQuantity
      });
      return this.quantity
    }
    this.quantity--;  
    this.calculatePrice()
    this.calculateBasePrice()
    if(this.isAddedtoCart){
      if( this.tempQuantity != this.quantity){
        this.isCartUpdate = true;
      }else{
        this.isCartUpdate=  false;
      }
    }
  }

  handlePlus() {
    this.quantity++;    
    this.calculatePrice();
    this.calculateBasePrice()
    //console.log((this.tempQuantity+" - - "+this.quantity))
    if(this.isAddedtoCart){
      if(this.tempQuantity != this.quantity){
        this.isCartUpdate = true;
      }else{
        this.isCartUpdate=  false;
      }
    }

  }


  onNumberInputChange(event: Event){
    const inputValue = (event.target as HTMLInputElement).value;
    if(parseInt(inputValue) < this.minimumQuantity){
      this.quantity = this.minimumQuantity
    }

    if(inputValue === "" || inputValue === null){
      const inputElement_ = event.target as HTMLInputElement;
      inputElement_.value =""+ this.minimumQuantity;
      this.quantity = this.minimumQuantity
    }
    this.calculatePrice();
    this.calculateBasePrice()
    if(this.isAddedtoCart){
      if(this.tempQuantity != this.quantity){
        this.isCartUpdate = true;
      }else{
        this.isCartUpdate=  false;
      }
    }
  }
  // getTotalPrice(data:any){
  //   var totalPrice = this.quantity*parseInt(data.product.mrp);
  //   var percentageAmount_cgst = totalPrice * (parseInt(data.product.cgst)/100); 
  //   var percentageAmount_sgst = totalPrice * (parseInt(data.product.sgst)/100); 
  //   var total =percentageAmount_cgst+percentageAmount_sgst+totalPrice
  //   return total;
  // }

  getSimilarProducts(){
    this.productServices.getSimilarProducts(this._ls_product_id,this._ls_category_id,this.pincode)
    .pipe(first())
    .subscribe({
        next: (data) => {
          this._similar_productsLists= data.data.products;
      },
        error: error => {
            this.error = error;
            Swal.fire("Error!",error.error.message,  "error")   
        }
    });
  }

  openStore(url){
    window.open(url);

  }
  showImage(url){
    this._selected_image = url;
  }
  getSingleProductData(){
    this.productServices.getSingleProductsLists(this._ls_product_id, this.pincode)
    .pipe(first())
    .subscribe({
        next: (data) => {
        this.productDetails = data?.data;
        this.quantity = this.productDetails.product.minimumOrderQty;
        this.minimumQuantity= this.productDetails.product.minimumOrderQty;
        this._selected_image = this.productDetails.product.image[0];
        this._ls_category_id =  this.productDetails.product.category._id;

        var _json = this.favourites.find(p => p._id === this.productDetails.product._id);
        if(_json){
          this.isFavourite = true
        } else{
          this.isFavourite=false;
        }
        this.getProductPrice();
        this.updateCartInfo();
        this.getSimilarProducts();

      },
        error: error => {
            this.error = error;
            Swal.fire({
              title: 'Error!',
              text:  error.error.message,
              icon: "error",
              timer:1000
            });
        }
    });
  }
  updateCartInfo(){
    this.isAddedtoCart= false;
    for(var j=0;j<this.cartLists.length;j++){
      if(this.cartLists[j].productDetails._id==this._ls_product_id){
          this.quantity = this.cartLists[j].quantity;
          this.tempQuantity = this.quantity;
          this.cart_id = this.cartLists[j]._id;
          this.isAddedtoCart = true;
          this.calculatePrice()
          this.calculateBasePrice()
          break;
      }else{
          this.isAddedtoCart= false;
          this.cart_id=''
          this.quantity = this.minimumQuantity;
          this.tempQuantity = this.quantity;
        
      }
   
    }
  }

  addtoFavourite(){
    //alert( this.isFavourite)
      if(this.isFavourite){
        this.isFavourite= false;
      }else{
        this.isFavourite =true
      }
      const jsonData={
        "productId":this.productDetails.product._id,
        "favourite":this.isFavourite
      }

      if(this.isFavourite){
        this.sharedServices.updateWishlistNumber(1)
      }else{
        this.sharedServices.updateWishlistNumber(-1)
      }

      this.productServices.addFavourites(jsonData)
      .pipe(first())
      .subscribe({
          next: (data) => {

          if(data.status){
            this.getFavourites();
          }   
        },
          error: error => {
              this.error = error;
              Swal.fire("Error!",error.error.message,  "error")   
          }
      });
    
  }
  getFavourites(){
    this.orderServices.getFavourites()
    .pipe(first())
    .subscribe({
        next: (data) => {
        this.favourites = data.data.products;
        localStorage.setItem("favourites",JSON.stringify(this.favourites));
      },
        error: error => {
            this.error = error;
        }
    });
  }

  removefromCart(){

    
    Swal.fire({
      title: "Are you sure?",
      text: "Do want to remove the product from your cart",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.value) {
        this.orderServices.deleteCart(this.cart_id)
        .pipe(first())
        .subscribe({
            next: (data) => {
              this.sharedServices.updateCartNumber(-1)

              this.messageService.add({
                severity: "success",
                detail: this.productDetails.product.productName+" has been removed from your cart"
              });
              this.getCartLists();
          },
            error: error => {
                this.error = error;
                Swal.fire("Error!",error.error.message,  "error")   
            }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    
    });
  
  }
 
  getCartLists(){
    this.orderServices._getCartLists(this.pincode)
    .pipe(first())
    .subscribe({
        next: (data) => {
        this.cartLists = data.data.carts;
        localStorage.removeItem('cartLists');
        localStorage.setItem('cartLists',JSON.stringify(this.cartLists));
        this.updateCartInfo();
      },
        error: error => {
            this.error = error;
        }
    });

}

  getProductPrice(){
    this.productServices.getProductPrice(this._ls_product_id,this.pincode)
    .pipe(first())
    .subscribe({
        next: (data) => {
        this._productPricing = data.data;
        
        this._is_VariablePricing = this._productPricing.isVariablePricing!;
        this._isPrimaryPricing = this._productPricing.isPrimaryPricing;

        if(this._productPricing.isPrimaryPricing && this._productPricing.alternateUnit==null){
          this._isPrimaryPricing = true;
        }else{
          this._is_Alt_Pricing = true;
        }


        if(this._productPricing.isPrimaryPricing){
          this._is_Alt_Pricing= false
        }else{
          this._is_Alt_Pricing= true
        }


        this.calculateBasePrice()
        this.calculatePrice();
      },
        error: error => {
            this.error = error;
            Swal.fire("Error!",error.error.message,  "error")   
        }
    });
  }
  onChange(event){
    const isChecked: boolean = event.target['checked'];
    this._is_Alt_Pricing = !this._is_Alt_Pricing;
  }

  calculateBasePrice(){
    console.log("==="+JSON.stringify(this._productPricing))
    const _p_price_withGST_Formula =  this._productPricing.primaryPriceFormulaWithGST;
    const _p_price_withOutGST_Formula =  this._productPricing.primaryPriceFormulaWithoutGST;
    const _a_price_withGST_Formula =  this._productPricing.altPriceFormulaWithGST;
    const _a_price_withOutGST_Formula =  this._productPricing.altPriceFormulaWithoutGST;

    // console.log(_p_price_withGST_Formula+"==="+_p_price_withOutGST_Formula)
    // console.log(_a_price_withGST_Formula+"==="+_a_price_withOutGST_Formula)

    // console.log(this._is_VariablePricing+"=")
    // console.log(this._isPrimaryPricing+"="+this._is_Alt_Pricing+"=")

    if(!this._is_VariablePricing){

      const qty = 1;
      this._baseprice_p_priceWithGST = eval(_p_price_withGST_Formula);
      this._baseprice_p_priceWithOutGST = eval(_p_price_withOutGST_Formula);
      if(this._productPricing.alternateUnit!=null){
        this._baseprice_a_priceWithGST = eval(_a_price_withGST_Formula);
        this._baseprice_a_priceWithOutGST = eval(_a_price_withOutGST_Formula);
      }
      // console.log(this._baseprice_p_priceWithGST+"==nnnnnnn="+this._baseprice_p_priceWithOutGST)
      // console.log( this._baseprice_a_priceWithOutGST+"==-nnnnnnn----="+ this._baseprice_a_priceWithOutGST)

    }else{

      this._variablePricingLists  = this._productPricing.variablePricings
      const variablePricings = this._productPricing.variablePricings
      const _selectedQuantity = this.quantity;
      for(let i=0;i<variablePricings.length;i++){
          if(_selectedQuantity>= variablePricings[i].from && _selectedQuantity<= variablePricings[i].to){
              const qty = 1;
              const price = variablePricings[i].price;
              this._baseprice_p_priceWithGST = eval(_p_price_withGST_Formula);
              this._baseprice_p_priceWithOutGST = eval(_p_price_withOutGST_Formula);

              console.log(this._baseprice_p_priceWithGST+"==yyyyyy="+this._baseprice_p_priceWithOutGST)
        
              if(this._productPricing.alternateUnit!=null){
                this._baseprice_a_priceWithGST = eval(_a_price_withGST_Formula);
                this._baseprice_a_priceWithOutGST = eval(_a_price_withOutGST_Formula);
              }

              console.log( this._baseprice_a_priceWithOutGST+"==-yyyyyy----="+ this._baseprice_a_priceWithOutGST)

              break;
          }
      }
    }
    
  }


  calculatePrice(){
    const _p_price_withGST_Formula =  this._productPricing.primaryPriceFormulaWithGST;
    const _p_price_withOutGST_Formula =  this._productPricing.primaryPriceFormulaWithoutGST;

    const _a_price_withGST_Formula =  this._productPricing.altPriceFormulaWithGST;
    const _a_price_withOutGST_Formula =  this._productPricing.altPriceFormulaWithoutGST;
    
    
    const qty = this.quantity;
    if(!this._is_VariablePricing){
        this._p_priceWithGST = eval(_p_price_withGST_Formula);
        this._p_priceWithOutGST = eval(_p_price_withOutGST_Formula);
        this._a_priceWithGST = eval(_a_price_withGST_Formula);
        this._a_priceWithOutGST = eval(_a_price_withOutGST_Formula);
    }else{
      // if(!this._is_Alt_Pricing){
        this._variablePricingLists  = this._productPricing.variablePricings
        const variablePricings = this._productPricing.variablePricings
        for(let i=0;i<variablePricings.length;i++){
            if(qty>= variablePricings[i].from && qty<= variablePricings[i].to){
                const price = variablePricings[i].price;
                this._p_priceWithGST = eval(_p_price_withGST_Formula);
                this._p_priceWithOutGST = eval(_p_price_withOutGST_Formula);
                this._a_priceWithGST = eval(_a_price_withGST_Formula);
                this._a_priceWithOutGST = eval(_a_price_withOutGST_Formula);
                break;
            }
        }
      // }
    }
  }
  checkValue(from,to,qty){

    if(from<=qty&& to>=qty){
      return true

    }else{
      return false

    }
  }

  isEmpty(data:any){
    return Object.keys(data).length
  }
  addtoCart(){
    
      if(!this._is_Alt_Pricing){
        this.totalPriceWithGST = this._p_priceWithGST
        this.totalPriceWithoutGST = this._p_priceWithOutGST
      }else{
        this.totalPriceWithGST =   this._a_priceWithGST
        this.totalPriceWithoutGST = this._a_priceWithOutGST
      }
      
 
      const jsonCart={
        "productId": this._ls_product_id, 
        "quantity": this.quantity, 
        "unitPrice": this._productPricing.priceWithGST, 
        "totalPriceWithGST":  this.totalPriceWithGST,
        "totalPriceWithoutGST":  this.totalPriceWithoutGST,
        "cgst": this.productDetails.product.cgst,
        "sgst": this.productDetails.product.sgst,
        "orderedUnit": this._is_Alt_Pricing?this._productPricing.alternateUnit._id:this._productPricing.primaryUnit._id,
        "priceFormulaWithGST":  this._is_Alt_Pricing?this._productPricing.altPriceFormulaWithGST:this._productPricing.primaryPriceFormulaWithGST,
        "priceFormulaWithoutGST": this._is_Alt_Pricing?this._productPricing.altPriceFormulaWithoutGST:this._productPricing.primaryPriceFormulaWithoutGST,
    
      }


        this.productServices.addtoCart(jsonCart, this.pincode)
        .pipe(first())
        .subscribe({
            next: (data) => {
            if(data.status){
              this.sharedServices.updateCartNumber(1)
              this.getCartLists();
              Swal.fire({
                text: data.message,
                icon: "success",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Continue Shopping",
                denyButtonText: `Go to Cart`
              }).then((result) => {
                if (result.isConfirmed) {
                  this.location.back()


                } else if (result.isDenied) {
                  this.router.navigate(['cart/']);
                }
              });
            }
            // Swal.fire('Success', data.message, 'success');
          },
            error: error => {
                this.error = error;
                Swal.fire("Error!",error.error.message,  "error")   
            }
        });
      
    
  }
  showProductDetails(data){
    this._ls_product_id = data._id;
    this._ls_category_id = data.category._id;

    this.getSingleProductData();
    this.getProductPrice();
    this.getSimilarProducts();
    window.scrollTo(0, 0) 

  }
  
}
  /*--------------- Category-------------- */



  /*--------------- Category-------------- */





 






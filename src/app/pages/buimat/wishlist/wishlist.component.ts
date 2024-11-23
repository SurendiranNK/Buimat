import { Component,OnInit} from '@angular/core';
import { AppService }   from '@services/app.service';
import { OrderService }   from '@services/order.service';

import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ProductService } from '@services/products.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  providers: [MessageService]

})
export class WishlistComponent  implements OnInit{

  error = '';
  favourites:any=[]
  productsInformation :any

  constructor(
    private orderServices    : OrderService ,
    private appServices:AppService,
    private messageService:MessageService,
    private productServices :ProductService,    
    private router:Router, private toastr: ToastrService  ) {   
  }

  public ngOnInit() : void{
    setTimeout(_ =>
    {
    
    }, 2000);
    
    //var userdata_ = localStorage.getItem('cartLists')!;
    this.getFavourites();
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
            //Swal.fire("Error!",error.error.message,  "error")   
        }
    });
  }

  gotoProduct(data){
    this.productsInformation =  data;
    this.appServices.setProductDetails(this.productsInformation);
    this.router.navigate(['/products/', data.productName]);
  }
  gotoDetailedPage(data){
    this.appServices.setProductDetails(data);
    localStorage.setItem("_productInfo",JSON.stringify(data));
    this.router.navigate(['/products/', data.productName]);
  }

  removeWishList(data_:any){
    const jsonData={
      "productId":data_._id,
      "favourite": false
    }
    Swal.fire({
      title: "",
      text: "Are you sure?. Do want to remove the product "+data_.productName+" from your wishlists",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#109c22",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Remove it!"
    }).then((result) => {
      if (result.value) {

        this.productServices.addFavourites(jsonData)
        .pipe(first())
        .subscribe({
           next: (data) => {
            if(data.status){
              this.messageService.add({
                severity: "warn",
                detail: data.message
              });
             // this.toastr.success(data.message, '', {timeOut: 1500});
              this.favourites = this.favourites.filter(item => item._id !== data_._id);
              localStorage.setItem("favourites",JSON.stringify(this.favourites));
            }   
            
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
}
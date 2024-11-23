// Angular modules
import { Injectable }               from '@angular/core';
import { Router }                   from '@angular/router';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

// External modules
import { TranslateService }         from '@ngx-translate/core';
import axios                        from 'axios';
import { AxiosError }               from 'axios';
import { AxiosInstance }            from 'axios';
import { CreateAxiosDefaults }      from 'axios';

// Internal modules
import { ToastManager }             from '@blocks/toast/toast.manager';
import { environment }              from '@env/environment';


// Models
// Services
import { StoreService }             from './store.service';




@Injectable()
export class DashboardService
{
  
  // NOTE Default configuration
  private default : CreateAxiosDefaults = {
    withCredentials : true,
    timeout : 990000,
    headers : {
      'Content-Type' : 'application/json',
      'Accept'       : 'application/json',
    },
  };
  // NOTE Instances
  private api : AxiosInstance = axios.create({
    baseURL : environment.apiBaseUrl,
    ...this.default,
  });
  productDetails_:any=[];
  pincode:string="";

  // NOTE Controller
  private controller : AbortController = new AbortController();

  constructor
  (
    private storeService     : StoreService,
    private toastManager     : ToastManager,
    private router           : Router,
    private translateService : TranslateService,
    private http: HttpClient
  )
  {
    var infoLocation = localStorage.getItem('locationInfo')!;
    if(infoLocation!=null){
      var data_location = JSON.parse(infoLocation);
      this.pincode= data_location.pincode;
    }
  }

  // ----------------------------------------------------------------------------------------------


  public async validateAccount(token : string, password : string) : Promise<boolean>
  {
    return Promise.resolve(true);
  }

  
  private initAuthHeader() : void
  {
  }



  // getAllCategoryProductLists(){
  //   let authToken = localStorage.getItem('token')!
  //   // const headers = new HttpHeaders({'x-auth-token':authToken })
  //   return this.http.get<Root>(`${environment.apiBaseUrl}/dashboard/categoryAndProducts?pincode=`+this.pincode+`&limit=6`)
  //   .pipe(map(data => {
  //       if(data.status){

  //       }
  //       return data;
  //     }));
  // }

  addFavourites(data){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<Add>(`${environment.apiBaseUrl}/favouriteOrRate/favourite`,data,{ headers: headers })
    .pipe(map(data => {
        if(data.status){

        }
        return data;
      }));
  }
  getProductbyCategory(categoryID:any){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<Root>(`${environment.apiBaseUrl}/product/category/`+categoryID+`?pincode=`+this.pincode+`&isWeb=1` ,{ headers: headers })
    .pipe(map(data => {
        if(data.status){
          
        }
        return data;
      }));
  }
  getProductPrice(id){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootProductPrice>(`${environment.apiBaseUrl}/product/price/`+id+`?pincode=`+this.pincode,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }
  
  getSingleProductsLists(id){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<any>(`${environment.apiBaseUrl}/product/`+id+`?pincode=`+this.pincode,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }
  getSimilarProducts(id,category_id){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<any>(`${environment.apiBaseUrl}/product/similar/`+id+`?categoryId=`+category_id+`&pincode=`+this.pincode,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }
  addtoCart(jsonData){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<any>(`${environment.apiBaseUrl}/cart?pincode=`+this.pincode,jsonData,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }


}


/*-----------------ORDER DETAILS----------------------*/
export interface Root {
  status: boolean
  data: Data
}

export interface Data {
  isSubcategory: boolean
  products: Product[]
  isFavourite:boolean
}

export interface Product {
  _id: string
  category: Category
  brand: Brand
  productName: string
  description: string
  cgst: number
  sgst: number
  mrp: number
  options: Options
  minimumOrderQty: number
  createdDate: string
  favourite: boolean
  rating: number
  totalUserRating: number
  avgRating: number
  image: string[]
  zone: Zone
}

export interface Category {
  _id: string
  categoryName: string
}

export interface Brand {
  _id: string
  brandName: string
}

export interface Options {
  "Type of Packs": string
  Weight: string
  Grade: string
}

export interface Zone {
  zoneId: string
  isVariablePricing: boolean
  price: number
  variablePricings: VariablePricing[]
  _id: string
}

export interface VariablePricing {
  from: string
  to: string
  price: number
}


/*----------------WISHLISTS----------------------*/


/*----------------PRODUCT PRICE----------------------*/
export interface RootProductPrice {
  status: boolean
  data: DataProductPrice
}

export interface DataProductPrice {
  isVariablePricing: boolean
  variablePricings: VariablePricing[]
  isPrimaryPricing: boolean
  primaryUnit: PrimaryUnit
  alternateUnit: AlternateUnit
  calculatedPriceWithoutGST: number
  priceWithoutGST: number
  calculatedPriceWithGST: number
  priceWithGST: number
  primaryPriceFormulaWithGST: string
  altPriceFormulaWithGST: string
  primaryPriceFormulaWithoutGST: string
  altPriceFormulaWithoutGST: string
}

export interface VariablePricing {
  from: string
  to: string
  price: number
}

export interface PrimaryUnit {
  _id: string
  formatName: string
  symbolToBeDisplayed: string
}

export interface AlternateUnit {
  _id: string
  formatName: string
  symbolToBeDisplayed: string
}
/*----------------PRODUCT PRICE----------------------*/
export interface Add {
  status: boolean
  message: string
}
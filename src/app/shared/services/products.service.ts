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
export class ProductService
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
    this.initRequestInterceptor(this.api);
    this.initResponseInterceptor(this.api);
    this.initAuthHeader();
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
    // const token = StorageHelper.getToken();
    // if (!token)
    //   return;

    // this.api.defaults.headers.common['Authorization'] = `Bearer ${token.jwtToken}`;
    // this.api.defaults.headers.common['Token']         = token.jwtToken;
  }

  public initRequestInterceptor(instance : AxiosInstance) : void
  {
    instance.interceptors.request.use((config) =>
    {
      console.log('interceptors.request.config', config);
      this.storeService.setIsLoading(true);

      return config;
    },
    (error) =>
    {
      console.log('interceptors.request.error', error);
      this.storeService.setIsLoading(false);

      this.toastManager.quickShow(error);
      return Promise.reject(error);
    });
  }

  public initResponseInterceptor(instance : AxiosInstance) : void
  {
    instance.interceptors.response.use((response) =>
    {
      console.log('interceptors.response.response', response);
      this.storeService.setIsLoading(false);

      return response;
    },
    async (error : AxiosError) =>
    {
      console.log('interceptors.response.error', error);
      this.storeService.setIsLoading(false);

      // NOTE Prevent request canceled error
      if (error.code === 'ERR_CANCELED')
        return Promise.resolve(error);

      this.toastManager.quickShow(error.message);
      return Promise.reject(error);
    });
  }

  getAllCategoryProductLists(pincode){
    let authToken = localStorage.getItem('token')!
    return this.http.get<Root_>(`${environment.apiBaseUrl}/dashboard/categoryAndProducts?pincode=`+pincode+`&isWeb=1&limit=6`)
    .pipe(map(data => {
        if(data.status){

        }
        return data;
      }));
  }

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
  getProductbyCategory(categoryID:any,pincode){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    console.log("=="+`${environment.apiBaseUrl}/product/category/`+categoryID+`?pincode=`+pincode+`&isWeb=1`)
    return this.http.get<Root>(`${environment.apiBaseUrl}/product/category/`+categoryID+`?pincode=`+pincode+`&isWeb=1` ,{ headers: headers })
    .pipe(map(data => {
        if(data.status){
          
        }
        return data;
      }));
  }

  getProductSearch(data:any){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<RootSearch>(`${environment.apiBaseUrl}/product/search?pincode=`+this.pincode ,data,{ headers: headers })
    .pipe(map(data => {
        if(data.status){
          
        }
        return data;
      }));
  }

  getSingleCategory(categoryID:any,pincode){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootObject>(`${environment.apiBaseUrl}/category/`+categoryID+`?pincode=`+pincode ,{ headers: headers })
    .pipe(map(data => {
        if(data.status){
          
        }
        return data;
      }));
  }
  getProductPrice(id,pincode){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootProductPrice>(`${environment.apiBaseUrl}/product/price/`+id+`?pincode=`+pincode,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }
  
  getSingleProductsLists(id,pincode){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<any>(`${environment.apiBaseUrl}/product/`+id+`?pincode=`+pincode,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }
  getSimilarProducts(id,category_id,pincode){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<any>(`${environment.apiBaseUrl}/product/similar/`+id+`?categoryId=`+category_id+`&pincode=`+pincode,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }
  addtoCart(jsonData,pincode){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<any>(`${environment.apiBaseUrl}/cart?pincode=`+pincode,jsonData,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }

  updateCart(jsonData,pincode){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.put<any>(`${environment.apiBaseUrl}/cart?pincode=`+pincode,jsonData,{ headers: headers })
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

export interface RootSearch {
  status: boolean
  data: Data
}

export interface DataSearch {
  results: Result[]
}


export interface Result {
  _id: string
  category: Category
  brand: Brand
  productName: string
  description: string
  cgst: number
  sgst: number
  hsn: number
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

export interface Data {
  isSubcategory: boolean
  products: Product[]
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
  isFavourite:boolean

}

export interface Category {
  _id: string
  categoryName: string
}

export interface Brand {
  _id: string
  brandName: string
  url:string
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


/*==================== CATEGORY BASED PRODUCT==================*/
export interface Root_ {
  status: boolean
  data: Data_
}

export interface Data_ {
  categories: Category_[]
}

export interface Category_ {
  _id: string
  categoryName: string
  products: Product_[]
  categoryImage: string
}

export interface Product_ {
  isFavourite:boolean
  _id: string
  category: string
  subcategory?: string
  brand?: string
  productName: string
  description: string
  cgst: number
  sgst: number
  mrp: number
  options: Options
  minimumOrderQty: number
  image: string[]
}

/*----------------single Category-------------------*/
interface RootObject {
  status: boolean;
  data: DataC;
}
interface DataC {
  category: CategoryB;
}
interface CategoryB {
  _id: string;
  categoryName: string;
  brand: Brand_[];
  categoryImage: string;
}
interface Brand_ {
  _id: string;
  brandName: string;
  brandImg: string;
  url?: string;
}
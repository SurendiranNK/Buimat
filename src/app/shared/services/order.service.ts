// Angular modules
import { Injectable }               from '@angular/core';
import { Router }                   from '@angular/router';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

// External modules
import { ArrayTyper }               from '@caliatys/array-typer';
import { TranslateService }         from '@ngx-translate/core';
import axios                        from 'axios';
import { AxiosResponse }            from 'axios';
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
export class OrderService
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

  getOrderDetails(id:string){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<Root>(`${environment.apiBaseUrl}/order/`+id ,{ headers: headers })
    .pipe(map(data => {
        if(data.status){

        }
        return data;
      }));
  }
  getFavourites(){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootWishList>(`${environment.apiBaseUrl}/product/favourites` ,{ headers: headers })
    .pipe(map(data => {
        if(data.status){
        }
        return data;
      }));
  }


  getCount(){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<any>(`${environment.apiBaseUrl}/dashboard/counts` ,{ headers: headers })
    .pipe(map(data => {
        if(data.status){
        }
        return data;
      }));
  }
  getproductFilter(data,pincode){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<RootProductFilter>(`${environment.apiBaseUrl}/product/filter?pincode=`+pincode ,data,{ headers: headers })
    .pipe(map(data => {
        if(data.status){
        }
        return data;
      }));
  }
  updateOrderStatus(json_status, orderID){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.put<any>(`${environment.apiBaseUrl}/order/`+orderID, json_status,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }
  splitOrder(jsonData, orderID){

    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<any>(`${environment.apiBaseUrl}/order/splitDelivery/`+orderID, jsonData,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }
  eInvoice(jsonData, orderID){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<any>(`${environment.apiBaseUrl}/order/einvoice/`+orderID, jsonData,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }

  
  _getDeliveryAddress(){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootDeliveryAddress>(`${environment.apiBaseUrl}/users/deliveryAddress?isWeb=1`,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }
  _deleteDeliveryaddress(id){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.delete<any>(`${environment.apiBaseUrl}/users/deleteDeliveryAddress/`+id+`?isWeb=1`,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }

  
  
  _getCartLists(pincode){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootCart>(`${environment.apiBaseUrl}/cart?pincode=`+pincode,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }
  deleteCart(cartID) {
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.delete<any>(`${environment.apiBaseUrl}/cart/`+cartID,{ headers: headers })
    .pipe(map(data => {
        return data;
    }));
  }

  updateCart(jsonData){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<any>(`${environment.apiBaseUrl}/cart/updateCart`,jsonData,{ headers: headers })
    .pipe(map(data => {
        return data;
    }));
  }

  getCounts(){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<any>(`${environment.apiBaseUrl}/dashboard/counts`,{ headers: headers })
    .pipe(map(data => {
        return data;
    }));
  }

  _initPayment(data:any){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<Result>(`${environment.apiBaseUrl}/pay/init?isWeb=1`,data,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }
  getMyOrders(){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<MyOrders>(`${environment.apiBaseUrl}/order/list`,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }


  getMyHistory(){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootPaymentHistory>(`${environment.apiBaseUrl}/order/paymentHistory`,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }
  getOrderInformation(orderID){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootOrderInfo>(`${environment.apiBaseUrl}/order/`+orderID,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }

  cancelOrder(orderID,params){
    // alert(orderID)
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<any>(`${environment.apiBaseUrl}/order/cancel/`+orderID,params,{ headers: headers })
    .pipe(map(data => {
        return data;
     }));
  }
  payment(accessKey){

    // var options = {
    //   'method': 'POST',
    //   'url': `https://pay.easebuzz.in/initiate_seamless_payment/`+this.resultData.accessKey,
    
    // };
    // return new Promise(function (resolve, reject) {
    //   request(options, function (error, response) {
    //     if (response) {
    //       var data = JSON.parse(response.body)
    //       alert(data)
    //       return resolve(data);
    //     } else
    //       return reject(error);
    //   })
    // })


    // let authToken = localStorage.getItem('token')!
    // const headers = new HttpHeaders({'x-auth-token':authToken })
    // let headers = new HttpHeaders();
    // headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // return this.http.post<any>(`https://pay.easebuzz.in/initiate_seamless_payment/`+accessKey,{headers: headers })
    // .pipe(map(data => {
    //     return data;
    //  }));
    
  //window.location.href = 'https://www.google.com';


  }
  
}

/*-------------CART -------------------*/

export interface RootCart {
  status: boolean
  data: DataCart
}

export interface DataCart {
  carts: Cart[]
}

export interface Cart {
  _id: string
  cgst: number
  priceFormulaWithGST: string
  priceFormulaWithoutGST: string
  quantity: number
  sgst: number
  totalGST: number
  totalPriceWithGST: number
  totalPriceWithoutGST: number
  unitPriceWithGST: number
  unitPriceWithoutGST: number
  productDetails: ProductDetails
  orderedUnit: OrderedUnit

}

export interface ProductDetails {
  _id: string
  productName: string
  description: string
  cgst: number
  sgst: number
  mrp: number
  options: Options
  minimumOrderQty: number
  createdDate: string
  image: string[]
}

export interface Options {
  // "Type of Packs": string
  // Weight: string
  // Grade: string
}
export interface OrderedUnit {
  _id: string
  formatName: string
  symbolToBeDisplayed: string
}
/*-------------CART -------------------*/


/*-----------------ORDER DETAILS----------------------*/
export interface Root {
  status: boolean
  data: Data
}

export interface Data {
  orderInfo: OrderInfo[]
}

export interface OrderInfo {
  _id: Id
  products: Product[]
  splitDeliveryDetails: SplitDeliveryDetail[]
}

export interface Id {


  orderId: string
  orderedDate: string
  totalPriceWithoutGST: number
  totalPriceWithGST: number
  deliveryAddress: DeliveryAddress
  billingAddress: BillingAddress
  paymentType: string
  paymentReference: string
  paymentDate: string
  einvoiceDetails: EinvoiceDetails
  einvoiceStatus: boolean
  ewayBillStatus: boolean
  isSplitDelivery: boolean
  status: string
  paymentStatus: string
  remarks: string
  expectedDeliveryDate: string
  vehicleNo: string

}

export interface DeliveryAddress {
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  contactNumber: string
  _id: string
}

export interface BillingAddress {
  _id: string
  username: string
  tradeName: string
  gstNo: string
  addressLine1: string
  addressLine2: string
  city: string
  pincode: string
  state: string
  contactNumber: string
}

export interface EinvoiceDetails {
  irn: string
  eWayBillNo: string
  ewbDt: string
  ewbValidTill: string
  QRCodeUrl: string
  eInvoicePdf: string
  eWaybillPdf: string
  _id: string
  
}

export interface Product {
  uid: string
  availableQuantity: number
  quantity: number
  productDetails: ProductDetails
  unitPriceWithoutGST: number
  unitPriceWithGST: number
  totalPriceWithGST: number
  totalPriceWithoutGST: number
  totalGST: number
  orderedUnit: OrderedUnit
}

export interface ProductDetails {
  _id: string
  productName: string
  description: string
  cgst: number
  sgst: number
  mrp: number
  options: Options
  minimumOrderQty: number
  hsn: string
  image: string[]
}

export interface Options {
  "Type of Packs": string
  Weight: string
  Grade: string
}

export interface OrderedUnit {
  _id: string
  formatName: string
  formatSymbol: string
  symbolToBeDisplayed: string
}

export interface SplitDeliveryDetail {
  _id: Id2
  deliveryDetails: DeliveryDetail[]
}

export interface Id2 {
  splitDeliveryId: string
  vehicleNo: string
  einvoiceDetails: EinvoiceDetails2
  deliveredDate: any
}

export interface EinvoiceDetails2 {
  irn: string
  eWayBillNo: string
  ewbDt: string
  ewbValidTill: string
  QRCodeUrl: string
  eInvoicePdf: string
  eWaybillPdf: string
  _id: string
}

export interface DeliveryDetail {
  uid: string
  quantity: number
  unitPriceWithoutGST: number
  unitPriceWithGST: number
  totalGST: number
  totalPriceWithGST: number
  totalPriceWithoutGST: number
  productId: string
  orderedUnit: string
  productDetails: ProductDetails2
}

export interface ProductDetails2 {
  _id: string
  productName: string
  description: string
  cgst: number
  sgst: number
  mrp: number
  options: Options2
  minimumOrderQty: number
  hsn: string
  image: string[]
}

export interface Options2 {
  "Type of Packs": string
  Weight: string
  Grade: string
}


/*-----------------ORDER DETAILS----------------------*/

/*----------------WISHLISTS----------------------*/
export interface RootWishList {
  status: boolean
  data: DataWishList
}

export interface DataWishList {
  products: ProductWishList[]
}

export interface ProductWishList {
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

/*----------------WISHLISTS----------------------*/

export interface Result {
  status: boolean
  message: string
  data: ResultData
}

export interface ResultData {
  orderId: string
  accessKey: string
}
/*----------------DELIVERY ADDRESSS----------------------*/

export interface RootDeliveryAddress {
  status: boolean
  data: DataDeliveryAddress
}

export interface DataDeliveryAddress {
  billingAddress: BillingAddress
  deliveryAddress: DeliveryAddress[]
}

export interface BillingAddress {
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  contactNumber: string
  pincode: string
  gstno: string
  tradeName: string
  email: string
  username: string
  isSelected:boolean;
}

export interface DeliveryAddress {
  contactNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  createdDate: string
  _id: string
  username: string
  isSelected:boolean;

}

/*----------------DELIVERY ADDRESSS----------------------*/

/*----------------MY ORDERS----------------------*/

export interface MyOrders {
  status: boolean
  data: DataOrders
}

export interface DataOrders {
  orders: Order[]
}

export interface Order {
  _id: string
  orderId: string
  bankRef: string
  apiRef: string
  paymentErrorMessage: string
  paymentStatus: string
  totalPriceWithoutGST: number
  totalPriceWithGST: number
  status: string
  deliveryAddress: DeliveryAddress
  orderedDate: string
  user: User
}

export interface DeliveryAddress {
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  contactNumber: string
  _id: string
}

export interface User {
  _id: string
  tradeName: string
  email: string
  mobileNo: string
}

/*----------------MY ORDERS----------------------*/
/*---------------- ORDERS INFORMATION----------------------*/


export interface RootOrderInfo {
  status: boolean
  data: DataOrderInfo
}

export interface DataOrderInfo {
  orderInfo: OrderInfo[]
}

export interface OrderInfo {
  _id: Id
  products: Product[]
}

export interface Id {
  orderId: string
  orderedDate: string
  totalPriceWithoutGST: number
  totalPriceWithGST: number
  deliveryAddress: DeliveryAddress
  billingAddress: BillingAddress
  paymentType: string
}

export interface DeliveryAddress {
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  contactNumber: string
  _id: string
}

export interface BillingAddress {
  _id: string
  addressLine1: string
  addressLine2: string
  city: string
  pincode: string
  state: string
  contactNumber: string
}

export interface Product {
  quantity: number
  productDetails: ProductDetails
  unitPriceWithoutGST: number
  unitPriceWithGST: number
  totalPriceWithGST: number
  totalPriceWithoutGST: number
  totalGST: number
  orderedUnit: OrderedUnit
}

export interface ProductDetails {
  _id: string
  productName: string
  description: string
  cgst: number
  sgst: number
  mrp: number
  options: Options
  minimumOrderQty: number
  image: string[]
}

export interface Options {}

export interface OrderedUnit {
  _id: string
  formatName: string
  formatSymbol: string
  symbolToBeDisplayed: string
}
/*---------------- ORDERS INFORMATION----------------------*/

/*---------------- PAYMENT HISTORY----------------------*/

export interface RootPaymentHistory {
  status: boolean
  data: DataPaymentHistory
}

export interface DataPaymentHistory {
  paymentHistories: PaymentHistory[]
}

export interface PaymentHistory {
  _id: string
  orderId: string
  totalPriceWithoutGST: number
  totalPriceWithGST: number
  status: string
  paymentHistory: PaymentHistory2[]
}

export interface PaymentHistory2 {
  _id: string
  bankRef: string
  apiRef: string
  paymentErrorMessage: string
  paymentStatus: string
  type: string
  date: string
}
/*---------------- PAYMENT HISTORY----------------------*/


/*---------------- Product Filter---------------------*/

export interface RootProductFilter {
  status: boolean
  data: Data
}

export interface Data {
  filter: Filter
}

export interface Filter {
  subcategory: Subcategory[]
  brand: Brand[]
  options: Option[]
}

export interface Subcategory {
  _id: string
  subcategoryName: string
}

export interface Brand {
  _id: string
  brandName: string
}

export interface Option {
  fieldName: string
  fieldValue: string
  fieldType: string
  isFilter: boolean
}
/*---------------- Product Filter---------------------*/

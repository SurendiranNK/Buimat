// Angular modules
import { Injectable }               from '@angular/core';
import { Router }                   from '@angular/router';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
// External modules
import { TranslateService }         from '@ngx-translate/core';
// Internal modules
import { ToastManager }             from '@blocks/toast/toast.manager';
import { environment }              from '@env/environment';
// Helpers
// Enums
import { Endpoint }                 from '@enums/endpoint.enum';
// Models
// Services
import { StoreService }             from './store.service';
import { Login_ } from 'src/app/_models/user';
import { saveAs } from 'file-saver';



@Injectable()
export class AppService
{
  
  // NOTE Default configuration
  // private default : CreateAxiosDefaults = {
  //   withCredentials : true,
  //   timeout : 990000,
  //   headers : {
  //     'Content-Type' : 'application/json',
  //     'Accept'       : 'application/json',
  //   },
  // };
  // NOTE Instances
  // private api : AxiosInstance = axios.create({
  //   baseURL : environment.apiBaseUrl,
  //   ...this.default,
  // });
  productDetails_:any=[];
  categoryDetails_;any=[]
  pincode:string=""
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
    // this.initRequestInterceptor(this.api);
    // this.initResponseInterceptor(this.api);
    this.initAuthHeader();
  }

  // ----------------------------------------------------------------------------------------------
  // SECTION Methods ------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------

  public async authenticate(email : string, password : string) : Promise<boolean>
  {
    return Promise.resolve(true);

    // StorageHelper.removeToken();

    // const url      = Endpoint.ADMIN_LOGIN;
    // const { data } = await this.api.post(url, { email, password });

    // if (!data)
    //   return false;

    // const authResponse = new AuthResponse(data);
    // StorageHelper.setToken(authResponse);
    // this.initAuthHeader();
    // return true;
  }

  public async forgotPassword(email : string) : Promise<boolean>
  {
    return Promise.resolve(true);

    // const url      = Endpoint.FORGOT_PASSWORD;
    // const { data } = await this.api.post(url, { email });

    // return !!data;
  }


  setProductDetails(data) {
    this.productDetails_= data;
  }

  getProductDetails() {
    return this.productDetails_;
 }

  setCategoryProductDetails(data) {
    this.categoryDetails_= data;
  }

  getCategoryProductDetails() {
    return this.categoryDetails_;
  }

  public async validateAccount(token : string, password : string) : Promise<boolean>
  {
    return Promise.resolve(true);

    // const url      = Endpoint.VALIDATE_ACCOUNT;
    // const { data } = await this.api.post(url, { token, password });

    // return !!data;
  }

  // public async getLastLines(siteId : string) : Promise<Line[]>
  // {
  //   const url      = StringHelper.interpolate(Endpoint.GET_LAST_LINES, [ siteId ]);
  //   const { data } = await this.api.get(url);

  //   if (!data)
  //     return [];

  //   return ArrayTyper.asArray(Line, data);
  // }

  // !SECTION Methods

  // ----------------------------------------------------------------------------------------------
  // SECTION Helpers ------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------



  
  private initAuthHeader() : void
  {
    var infoLocation = localStorage.getItem('locationInfo')!;
    if(infoLocation!=null){
      var data_location = JSON.parse(infoLocation);
      this.pincode= data_location.pincode;
    }

    // const token = StorageHelper.getToken();
    // if (!token)
    //   return;

    // this.api.defaults.headers.common['Authorization'] = `Bearer ${token.jwtToken}`;
    // this.api.defaults.headers.common['Token']         = token.jwtToken;
  }

  // public initRequestInterceptor(instance : AxiosInstance) : void
  // {
  //   instance.interceptors.request.use((config) =>
  //   {
  //     console.log('interceptors.request.config', config);
  //     this.storeService.setIsLoading(true);

  //     return config;
  //   },
  //   (error) =>
  //   {
  //     console.log('interceptors.request.error', error);
  //     this.storeService.setIsLoading(false);

  //     this.toastManager.quickShow(error);
  //     return Promise.reject(error);
  //   });
  // }

  // public initResponseInterceptor(instance : AxiosInstance) : void
  // {
  //   instance.interceptors.response.use((response) =>
  //   {
  //     console.log('interceptors.response.response', response);
  //     this.storeService.setIsLoading(false);

  //     return response;
  //   },
  //   async (error : AxiosError) =>
  //   {
  //     console.log('interceptors.response.error', error);
  //     this.storeService.setIsLoading(false);

  //     // NOTE Prevent request canceled error
  //     if (error.code === 'ERR_CANCELED')
  //       return Promise.resolve(error);

  //     this.toastManager.quickShow(error.message);
  //     return Promise.reject(error);
  //   });
  // }
  userLogin(jsonData:any){
    const url      = Endpoint.URL+"users/admin";
    return this.http.post<Login_>(url , jsonData);
  }

  addBrand(formdata: FormData) {
    const url      = Endpoint.URL+"brand";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<AddResponse>(url , formdata ,{ headers: headers });
  }
  updateBrand(brandID:any,formdata: FormData) {
    const url      = Endpoint.URL+"brand/"+brandID;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.put<AddResponse>(url , formdata ,{ headers: headers });
  } 
  deleteBrand(id:string) {

    const url      = Endpoint.URL+"brand/"+id;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.delete<AddResponse>(url ,{ headers: headers });
  }
  getBrandLists() {
    const url      = Endpoint.URL+"brand";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<Root>(url,{ headers: headers });
  }

  addCategory(formdata: FormData) {
    const url      = Endpoint.URL+"category";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<AddResponse>(url , formdata ,{ headers: headers });
  }
  updateCategory(categoryID:any,formdata: FormData){
    const url      = Endpoint.URL+"category/"+categoryID;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.put<AddResponse>(url , formdata ,{ headers: headers });
  }
  deleteCategory(id:string) {
    const url      = Endpoint.URL+"category/"+id;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.delete<AddResponse>(url ,{ headers: headers });
  }
  deleteCategory_(id:string) {
    const url      = Endpoint.URL+"category/"+id+'?isHardDelete=1';
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.delete<AddResponse>(url ,{ headers: headers });
  }
  
  getCategoryLists() {
    const url      = Endpoint.URL+"category";
    let authToken = localStorage.getItem('token')!
   // console.log(authToken)
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootCategory>(url,{ headers: headers });
  }

  checkPincode(pincode) {
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootPincode>(`${environment.apiBaseUrl}/zone/details?pincode=`+pincode+`&isWeb=1`,{ headers: headers })
    .pipe(map(data => {
        return data;
    }));
  }

  updateSubCategory(_id:any, formdata: FormData) {
    const url      = Endpoint.URL+"subcategory/"+_id;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.put<AddResponse>(url , formdata ,{ headers: headers });
  }
  addSubCategory(formdata: FormData) {
    const url      = Endpoint.URL+"subcategory";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<AddResponse>(url , formdata ,{ headers: headers });
  }
  getSubCategoryLists() {
    const url      = Endpoint.URL+"subcategory";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootSubCategory>(url,{ headers: headers });
  }

  _getSingleSubCategoryLists(categoryID:any) {
    const url      = Endpoint.URL+"subcategory/populate/"+categoryID;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<Root_Cate_SubCategory>(url,{ headers: headers });
  }
  deleteSubCategory(id:string) {
    const url      = Endpoint.URL+"subcategory/"+id;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.delete<AddResponse>(url ,{ headers: headers });
  }
  deleteSubCategory_(id:string) {
    const url      = Endpoint.URL+"subcategory/"+id+'?isHardDelete=1';
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.delete<AddResponse>(url ,{ headers: headers });
  }


  getFieldByCategoryLists(categoryID:any) {
    const url      = Endpoint.URL+"field/populate/category/"+categoryID;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<Root_Field_category>(url,{ headers: headers });
  }
  getFieldBySubCategory(categoryID:any,subCategoryID:any) {
    const url      = Endpoint.URL+"field/populate/subcategory?subcategoryId="+subCategoryID+"&categoryId="+categoryID;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<Root_Field_SubCategory>(url,{ headers: headers });
  }



  // !SECTION Helpers
  addZone(jsonData: any) {
    const url      = Endpoint.URL+"zone";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<AddResponse>(url , jsonData ,{ headers: headers });
  }
  getZoneLists(){
    const url      = Endpoint.URL+"zone";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootZone>(url,{ headers: headers });
  }


  updateZone(_id: any, jsonData: any) {
    const url      = Endpoint.URL+"zone/"+_id;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.put<AddResponse>(url , jsonData ,{ headers: headers });
  }
  deleteZone(id:string) {
    
    const url      = Endpoint.URL+"zone/"+id;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.delete<AddResponse>(url ,{ headers: headers });
  }

  addCompoundUnit(jsonData: any) {
    const url      = Endpoint.URL+"unit?unitType=compound";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<AddResponse>(url , jsonData ,{ headers: headers });
  }
  updateCompoundUnit(_id: any, jsonData: any) {
    const url      = Endpoint.URL+"unit/"+_id+"?unitType=compound";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.put<AddResponse>(url , jsonData ,{ headers: headers });
  }
  getCompoundUnitLists(){
    const url      = Endpoint.URL+"unit?unitType=compound";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootCompoundUnit>(url,{ headers: headers });
  }

  getOrderLists(){
    const url      = Endpoint.URL+"order";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<OrderRoot>(url,{ headers: headers });

  }
  deleteCompoundUnit(id:string) {
    // const url      = Endpoint.URL+"unit/"+id+"?unitType=compound&deleteType=force";
    const url      = Endpoint.URL+"unit/"+id+"?unitType=compound";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.delete<AddResponse>(url ,{ headers: headers });
  }


  addSimpleUnit(jsonData: any) {
    const url      = Endpoint.URL+"unit?unitType=simple";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<AddResponse>(url , jsonData ,{ headers: headers });
  }
  updatesimpleUnit(_id: any, jsonData: any) {
    const url      = Endpoint.URL+"unit/"+_id+"?unitType=simple";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.put<AddResponse>(url , jsonData ,{ headers: headers });
  }
  getSimpleUnitLists(){
    const url      = Endpoint.URL+"unit?unitType=simple";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootSimpleUnits>(url,{ headers: headers });
  }

  deleteSimpleUnit(id:string) {
  
    // const url      = Endpoint.URL+"unit/"+id+"?unitType=simple&deleteType=force";
    const url      = Endpoint.URL+"unit/"+id+"?unitType=simple";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.delete<AddResponse>(url ,{ headers: headers });
  }


  getassociatedUnit(id:any) {
    const url      = Endpoint.URL+"unit/associatedUnit/"+id;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootAssociatedUnit>(url,{ headers: headers });
  }




  getFieldLists(){
    const url      = Endpoint.URL+"field";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootFields>(url,{ headers: headers });
  }
  addFields(jsonData:any) {
    const url      = Endpoint.URL+"field";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.post<AddResponse>(url , jsonData ,{ headers: headers });
  }
  updateFields(_id:any, jsonData: any) {
    const url      = Endpoint.URL+"field/"+_id;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.put<AddResponse>(url , jsonData ,{ headers: headers });
  }
  deleteField(id:string) {
    const url      = Endpoint.URL+"field/"+id;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.delete<AddResponse>(url ,{ headers: headers });
  }

  downloadInvoice(orderID){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken,responseType : 'blob' })
    return this.http.get<Blob>(`${environment.apiBaseUrl}/order/invoice/`+orderID, { headers : headers,responseType : 
    'blob' as 'json'});
  }

  downloadsplitInvoice(orderID,splitID){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken,responseType : 'blob' })
    return this.http.get<Blob>(`${environment.apiBaseUrl}/order/invoice/`+orderID+'?splitDeliveryId='+splitID, { headers : headers,responseType : 
    'blob' as 'json'});
  }
   
   
  addProducts(formdata: FormData) {
    // const url      = Endpoint.URL+"product";
    // let authToken = localStorage.getItem('token')!
    // const headers = new HttpHeaders({'x-auth-token':authToken })
    // return this.http.post<AddResponse>(url , formdata ,{ headers: headers });
      let authToken = localStorage.getItem('token')!
      const headers = new HttpHeaders({'x-auth-token':authToken })
      return this.http.post<AddResponse>(`${environment.apiBaseUrl}/product`,formdata,{ headers: headers })
      .pipe(map(data => {
          return data;
      }));
  }

  updateProductStatus(id:string){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.put<RootUpdateStatus>(`${environment.apiBaseUrl}/product/status/`+id,{},{ headers: headers })
    .pipe(map(data => {
        return data;
    }));
  }


  updateSubCategoryStatus(id:string){
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.put<RootUpdateStatus>(`${environment.apiBaseUrl}/subcategory/status/`+id,{},{ headers: headers })
    .pipe(map(data => {
        return data;
    }));
  }

  // updateCategoryStatus_(id:string){
  //   let authToken = localStorage.getItem('token')!
  //   const headers = new HttpHeaders({'x-auth-token':authToken })
  //   return this.http.put<RootUpdateStatus>(`${environment.apiBaseUrl}/category/status/`+id,{ headers: headers })
  //   .pipe(map(data => {
  //       return data;
  //   }));
  // }
  updateCategoryStatus_(id) {
    const url      = Endpoint.URL+"category/status/"+id;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.put<RootUpdateStatus>(url,{},{headers:headers});
  }


  updateProduct(productID:any,formdata: FormData){

    for(let keyValuePair of formdata.entries()){
      console.log("---"+keyValuePair); 
    }

    // const url      = Endpoint.URL+"product"+productID;
    // let authToken = localStorage.getItem('token')!
    // const headers = new HttpHeaders({'x-auth-token':authToken })
    // return this.http.put<AddResponse>(url , formdata ,{ headers: headers });
      let authToken = localStorage.getItem('token')!
      const headers = new HttpHeaders({'x-auth-token':authToken })
      return this.http.put<AddResponse>(`${environment.apiBaseUrl}/product/`+productID,formdata,{ headers: headers })
      .pipe(map(data => {
          return data;
      }));
  }

  getProductLists(){
    const url      = Endpoint.URL+"product";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootProducts>(url,{ headers: headers });
  }


  deleteProduct(id:string) {
    const url      = Endpoint.URL+"product/"+id;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.delete<AddResponse>(url ,{ headers: headers });
  }


  getDashboardCount(){
    const url      = Endpoint.URL+"dashboard/overallcounts";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<RootDashboard>(url,{ headers: headers });
  }

  
  getUserLists(){
    const url      = Endpoint.URL+"users";
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.get<User>(url,{ headers: headers });
  }

  updateUser(_id:any, status: any) {
    const url      = Endpoint.URL+"users/"+_id;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.put<AddResponse>(url , status ,{ headers: headers });
  }

  deleteUser(userID:string) {
    const url      = Endpoint.URL+"users/"+userID;
    let authToken = localStorage.getItem('token')!
    const headers = new HttpHeaders({'x-auth-token':authToken })
    return this.http.delete<AddResponse>(url ,{ headers: headers });
  }

}




export class AddResponse {
  status: boolean;
  message: string;
  timestamp: number
  trace: string
}

export interface Root {
  status: boolean
  data: Data
}

export interface Data {
  brands: BrandData[]
}

export interface BrandData {
  brandImg: string
  _id: string
  brandName: string
  url:string
}


export interface RootCategory {
  status: boolean
  data: DataCategory
}

export interface DataCategory {
  categories: CategoryData[]
}

export interface CategoryData {
  _id: string
  categoryName: string
  categoryImage: string
  isSubcategory: boolean
  brand: BrandData[]
}




/*--------------------------User----------------*/

export class User {
  status: boolean
  data: UserData
}

export interface UserData {
  users: UserLists[]
}

export interface UserLists {
  _id: string
  username: string
  password: string
  role: string
  tradeName: string
  email: string
  mobileNo: string
  tradeLicenseNo: string
  gstNo: string
  addressLine1: string
  addressLine2: string
  aadharLinked: string
  panLinked: string
  gstLinked: string
  tradeLicenseLinked: string
  city: string
  pincode: string
  state: string
  createdDate: string
  status: string
  __v: number
}

/*--------------------------User----------------*/
/*--------------------------SimpleUnits----------------*/
export interface RootSimpleUnits {
  status: boolean
  data: DataSimpleUnits
}

export interface DataSimpleUnits {
  units: Unit[]
}

export interface Unit {
  _id: string
  formatName: string
  formatSymbol: string
  decimalPoint: number
  symbolToBeDisplayed: string
}

/*--------------------------User----------------*/



/*--------------------------Zone----------------*/

export interface RootZone {
  status: boolean
  data: DataZone
}

export interface DataZone {
  zones: ZoneLists[]
}

export interface ZoneLists {
  _id: string
  zoneName: string
  city: string
  pincode: string[]
}
/*--------------------------Zone----------------*/

/*--------------------------subCategoryLists----------------*/
export interface RootSubCategory {
  status: boolean
  data: DataSubCategory
}

export interface DataSubCategory {
  subcategories: Subcategory[]
}

export interface Subcategory {
  _id: string
  category: CategoryInfo
  subcategoryName: string
  subcategoryImage: string
}

export interface CategoryInfo {
  _id: string
  categoryName: string
  categoryImage: string
}
/*--------------------------subCategoryLists----------------*/
export interface Root_Cate_SubCategory {
  status: boolean
  data: Data__
}

export interface Data__ {
  subcategories: Subcategory__[]
}

export interface Subcategory__ {
  _id: string
  subcategoryName: string
}


/*--------------------------subCategoryLists----------------*/
export interface RootFields {
  status: boolean
  data: DataField
}

export interface DataField {
  fields: Field[]
}

export interface Field {
  _id: string
  category: Category_
  subcategory: Subcategory_
  options: Option[]
}

export interface Category_ {
  _id: string
  categoryName: string
  categoryImage: string
}

export interface Subcategory_ {
  _id: string
  category: string
  subcategoryName: string
  createdByUser: string
  createdDate: string
  __v: number
}

export interface Option {
  fieldValue: string
  fieldName: string
  fieldType: string
  isFilter: boolean
}

/*--------------------------Fields----------------*/

export interface Root_Field_category {
  status: boolean
  data: DataFields
}

export interface DataFields {
  isSubcategory: boolean
  fields: FieldsOption
}

export interface FieldsOption {
  _id: string
  options: OptionField[]
}

export interface OptionField {
  fieldName: string
  fieldValue: string
  fieldType: string
  isFilter: boolean
}
// --------------------------------------
export interface Root_Field_SubCategory {
  status: boolean
  data: DataFields_
}

export interface DataFields_ {
  fields: FieldsOption_
}

export interface FieldsOption_ {
  _id: string
  options: OptionField_[]
}

export interface OptionField_ {
  fieldName: string
  fieldValue: string
  fieldType: string
  isFilter: boolean
}
//----------------root products-----------------

export interface RootProducts {
  status: boolean
  data: DataProducts
}

export interface DataProducts {
  _id: string
  zones: ZoneProduct[]
  product: Product2
}
export interface ZoneProduct {
  price: number
  isVariablePricing: boolean
  variablePricings: VariablePricing[]
  zone: Zone2
}
export interface VariablePricing {
  from: string
  to: string
  price: number
}
export interface Product_ {
  _id: string
  category: Category_
  subcategory: Subcategory_
  brand: Brand_
  productName: string
  description: string
  cgst: number
  sgst: number
  mrp: number
  hsn:number
  zone: Zone_[]
  image: any[]
  options: Options_
  perUnitPricing: string
  altUnitPricing: string
  isPrimaryPricing: boolean
  isAltPricing: boolean
  minimumOrderQty: number
  createdByUser: string
  createdDate: string
  isSelected : boolean

}

export interface Category_ {
  _id: string
  categoryName: string
}

export interface Subcategory_ {
  _id: string
  subcategoryName: string
}

export interface Zone2 {
  _id: string
  zoneName: string
}
export interface Brand_ {
  _id: string
  brandName: string
}

export interface Zone_ {
  zoneId: string
  isVariablePricing: boolean
  price: number
  variablePricings: VariablePricing[]
  _id: string
}

export interface Options_ {

}export interface Product2 {
  _id: string
  category: Category_
  brand?: Brand_
  productName: string
  description: string
  cgst: number
  sgst: number
  mrp: number
  options: Options_
  perUnitPricing: string
  altUnitPricing: string
  isPrimaryPricing: boolean
  isAltPricing: boolean
  minimumOrderQty: number
  createdDate: string
  image: string[]
  subcategory?: Subcategory
}









export interface RootDashboard {
  status: boolean
  data: DataDashboard
}

export interface DataDashboard {
  categoriesCount: number
  brandsCount: number
  productsCount: number
  subcategoryCount: number
  usersCount: number
  orderCount: number
}
export interface RootUpdateStatus {
  status: boolean
  message: string
}


/*------------Login--------------*/

export interface Login {
  status: boolean
  data: Data
}

export interface DataLogin {
  user: UserLogin
  token: string
}

export interface UserLogin {
  email: string
  role: string
  mobileNo: string
  tradeLicenseNo: string
  gstNo: string
  addressLine1: string
  addressLine2: string
  city: string
  pincode: string
  state: string
}

/*------------Login--------------*/

export class Zone_Product
{
  zoneId: string="";
  price:number
}


export interface RootCompoundUnit {
  status: boolean
  data: DataC
}

export interface DataC {
  units: UnitCompound[]
}

export interface UnitCompound {
  _id: string
  fromUnit: FromUnit
  toValue: number
  toUnit: ToUnit
}

export interface FromUnit {
  _id: string
  symbolToBeDisplayed: string
}

export interface ToUnit {
  _id: string
  symbolToBeDisplayed: string
}
export interface RootAssociatedUnit {
  status: boolean
  data: DataAssociatedUnit
}

export interface DataAssociatedUnit {
  units: UnitAU[]
}

export interface UnitAU {
  _id: string
  formatName: string
  formatSymbol: string
  symbolToBeDisplayed: string
}
export interface Card {
  title: string;
  description: string;
  url: string;
}


/*-------------ORDER -------------------*/

export interface OrderRoot {
  status: boolean
  data: DataOrder
}

export interface DataOrder {
  orders: Order[]
}

export interface Order {
  _id: string
  orderId: string
  totalPriceWithoutGST: number
  totalPriceWithGST: number
  status: string
  deliveryAddress: DeliveryAddress
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
/*-------------ORDER -------------------*/




export interface RootPincode {
  status: boolean
  message: string
  data: DataPincode
}

export interface DataPincode {
  pincode: string
  locationDetail: string
  addressLine1:string
  addressLine2: string
  city:string
  state: string
  contactNumber:string
  username: string
  landmark:string
}

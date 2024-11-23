import { signal, Signal } from '@angular/core';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';


// interface Employee {
//   id: number;
//   name: string;
//   position: string;
//   department: string;
//   dateOfJoining: string;
// }
interface Employee {
  id?: number;  // Optional, as IndexedDB generates it
  name: string;
  role: string;
  // department: string;
  dateOfJoining: string;
  dateOfLeaving: string;
  swiped: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employees = signal<Employee[]>([]);
  private selectedEmployee = new BehaviorSubject<Employee | null>(null);


  private dataSource = new BehaviorSubject<string>('Default Value');
  currentData = this.dataSource.asObservable(); // Expose the observable

  setEmployee(employee: Employee): void {
    this.selectedEmployee.next(employee);
  }

  getEmployee() {
    return this.selectedEmployee.asObservable();
  }
  // constructor() {
  //   this.initializeDatabase();
    
  // }
  constructor(@Inject(PLATFORM_ID) private platformId: Object,    private http: HttpClient
) {
    
  }

  updateData(data: string) {
    this.dataSource.next(data);
  }


  getData(data_:any){
    return this.http.post<any>('https://appspos.apdeliver.com/AppsPOSDemoSAS/api/apis/Get_Category_By_ProductId',data_)
    .pipe(map(data => {
        return data;
     }));
  }


}


export interface Root {
  status: string
  show_status: string
  message: string
  server_time: string
  data: Data
}

export interface Data {
  mst_product_has_count: number
  sub_group_product_id: string
  details: Detail[]
}

export interface Detail {
  mst_cat_id: number
  mst_cat_code: string
  mst_cat_name: string
  side_cat_count: number
  side_cat_max_count: number
  is_required: boolean
  per_qty: number
  per_qty_max: number
  is_pro_qty_type: boolean
  is_for_repeat_set_combo: boolean
  mst_product_repeat_group_no_of_times: number
  product_details: ProductDetail[]
}

export interface ProductDetail {
  mst_product_id: number
  mst_product_code: string
  mst_product_name: string
  mst_cat_id: number
  price_type: number
  mst_cat_discount: number
  mst_product_default_price: number
  mst_product_dish_ids: any
  sides_pro_count: number
  is_sus_product: number
  mst_product_modifier_error_msg: string
  fix_ptype_id: number
  mst_product_image: string
  mst_product_image_web: string
  subitem_type: number
  is_listing_type: boolean
  product_qty: number
  item_price_details: ItemPriceDetails
  isCheckboxCheck: boolean
  dish_price_details: DishPriceDetail[]
  modifier_details: ModifierDetail[]
  set_item_details: any[]
  suspend_details: SuspendDetails
  special_icon_details: any[]
}

export interface ItemPriceDetails {
  mst_cat_discount?: number
  sub_price?: number
  sub_promotional_price?: number
  sub_price_discount_per?: number
  sub_price_discount_fix?: number
  final_price?: number
  price_current_taken_type?: string
  price_id?: string
}

export interface DishPriceDetail {
  dish_id: number
  dish_name: string
  dish_abb: string
  dish_price: DishPrice
  is_default: string
}

export interface DishPrice {
  mst_cat_discount: number
  sub_price: number
  sub_promotional_price: number
  sub_price_discount_per: number
  sub_price_discount_fix: number
  final_price: number
  price_current_taken_type: string
  price_id: string
}

export interface ModifierDetail {
  modifier_id: string
  modifier_name: string
  modifier_abb: string
  modifier_need_printer: string
  modifier_type: string
  sub_product_modifers_id: string
  modifier_options: ModifierOption[]
}

export interface ModifierOption {
  sub_option_id: number
  modifier_options_id: number
  modifier_options_name: string
  modifier_options_abb: string
  modifier_options_default: number
  modifier_options_price: number
  modifier_options_printer: string
  modifier_options_type: string
}

export interface SuspendDetails {
  is_suspend_type: any
  is_normal_supend: any
  is_promo_suspend: any
}

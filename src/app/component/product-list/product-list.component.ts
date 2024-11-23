import { Component ,OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { EmployeeService } from 'src/app/services/employee.service';
import { Router }       from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  receivedJsonData: any;
  selectedData: any =[];

  groupData: any =[];

  error:string =""

   jsonData = {
    "status": "1",
    "show_status": "0",
    "message": "Msg Resticed",
    "server_time": "2024-11-23 18:06:51",
    "data": {
        "mst_product_has_count": 0,
        "sub_group_product_id": "230111202401800615107711",
        "details": [
            {
                "mst_cat_id": 20924,
                "mst_cat_code": "",
                "mst_cat_name": "Mixian Set",
                "side_cat_count": 0,
                "side_cat_max_count": 0,
                "is_required": false,
                "per_qty": 0,
                "per_qty_max": 0,
                "is_pro_qty_type": false,
                "is_for_repeat_set_combo": true,
                "mst_product_repeat_group_no_of_times": 1,
                "product_details": [
                    {
                        "mst_product_id": 41200,
                        "mst_product_code": "MaxainSet",
                        "mst_product_name": "Mixian Set Pax 1",
                        "mst_cat_id": 222,
                        "price_type": 1,
                        "mst_cat_discount": 0.0,
                        "mst_product_default_price": 0.0,
                        "mst_product_dish_ids": null,
                        "sides_pro_count": 1,
                        "is_sus_product": 0,
                        "mst_product_modifier_error_msg": "Sorry, you have exceeded the maximum number of selection for this item",
                        "fix_ptype_id": 1,
                        "mst_product_image": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Cover/",
                        "mst_product_image_web": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "subitem_type": 0,
                        "is_listing_type": false,
                        "product_qty": 0.0,
                        "item_price_details": {
                            "mst_cat_discount": 0.00,
                            "sub_price": 0.00,
                            "sub_promotional_price": 0.0,
                            "sub_price_discount_per": 0.0,
                            "sub_price_discount_fix": 0.0,
                            "final_price": 0.0,
                            "price_current_taken_type": "Def",
                            "price_id": "0"
                        },
                        "isCheckboxCheck": false,
                        "dish_price_details": [],
                        "modifier_details": [],
                        "set_item_details": [],
                        "suspend_details": {
                            "is_suspend_type": null,
                            "is_normal_supend": null,
                            "is_promo_suspend": null
                        },
                        "special_icon_details": []
                    },
                    {
                        "mst_product_id": 51227,
                        "mst_product_code": "MixianSet 2",
                        "mst_product_name": "Mixian Set Pax 2",
                        "mst_cat_id": 222,
                        "price_type": 1,
                        "mst_cat_discount": 0.0,
                        "mst_product_default_price": 0.0,
                        "mst_product_dish_ids": null,
                        "sides_pro_count": 1,
                        "is_sus_product": 0,
                        "mst_product_modifier_error_msg": "Sorry, you have exceeded the maximum number of selection for this item",
                        "fix_ptype_id": 1,
                        "mst_product_image": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Cover/",
                        "mst_product_image_web": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "subitem_type": 0,
                        "is_listing_type": false,
                        "product_qty": 0.0,
                        "item_price_details": {
                            "mst_cat_discount": 0.00,
                            "sub_price": 0.00,
                            "sub_promotional_price": 0.0,
                            "sub_price_discount_per": 0.0,
                            "sub_price_discount_fix": 0.0,
                            "final_price": 0.0,
                            "price_current_taken_type": "Def",
                            "price_id": "0"
                        },
                        "isCheckboxCheck": false,
                        "dish_price_details": [],
                        "modifier_details": [],
                        "set_item_details": [],
                        "suspend_details": {
                            "is_suspend_type": null,
                            "is_normal_supend": null,
                            "is_promo_suspend": null
                        },
                        "special_icon_details": []
                    }
                ]
            },
            {
                "mst_cat_id": 20,
                "mst_cat_code": "",
                "mst_cat_name": "Set Drinks",
                "side_cat_count": 0,
                "side_cat_max_count": 0,
                "is_required": false,
                "per_qty": 0,
                "per_qty_max": 0,
                "is_pro_qty_type": false,
                "is_for_repeat_set_combo": false,
                "mst_product_repeat_group_no_of_times": 0,
                "product_details": [
                    {
                        "mst_product_id": 15205,
                        "mst_product_code": "MODW01",
                        "mst_product_name": "LESS ICE",
                        "mst_cat_id": 410,
                        "price_type": 1,
                        "mst_cat_discount": 0.0,
                        "mst_product_default_price": 0.0,
                        "mst_product_dish_ids": null,
                        "sides_pro_count": 1,
                        "is_sus_product": 0,
                        "mst_product_modifier_error_msg": "Sorry, you have exceeded the maximum number of selection for this item",
                        "fix_ptype_id": 2,
                        "mst_product_image": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "mst_product_image_web": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "subitem_type": 0,
                        "is_listing_type": false,
                        "product_qty": 0.0,
                        "item_price_details": {
                            "mst_cat_discount": 0.00,
                            "sub_price": 0.00,
                            "sub_promotional_price": 0.0,
                            "sub_price_discount_per": 0.0,
                            "sub_price_discount_fix": 0.0,
                            "final_price": 0.0,
                            "price_current_taken_type": "Def",
                            "price_id": "0"
                        },
                        "isCheckboxCheck": false,
                        "dish_price_details": [],
                        "modifier_details": [],
                        "set_item_details": [],
                        "suspend_details": {
                            "is_suspend_type": null,
                            "is_normal_supend": null,
                            "is_promo_suspend": null
                        },
                        "special_icon_details": []
                    },
                    {
                        "mst_product_id": 15207,
                        "mst_product_code": "MOD03",
                        "mst_product_name": "LESS SPICY",
                        "mst_cat_id": 410,
                        "price_type": 1,
                        "mst_cat_discount": 0.0,
                        "mst_product_default_price": 0.0,
                        "mst_product_dish_ids": null,
                        "sides_pro_count": 1,
                        "is_sus_product": 0,
                        "mst_product_modifier_error_msg": "Sorry, you have exceeded the maximum number of selection for this item",
                        "fix_ptype_id": 2,
                        "mst_product_image": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "mst_product_image_web": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "subitem_type": 0,
                        "is_listing_type": false,
                        "product_qty": 0.0,
                        "item_price_details": {
                            "mst_cat_discount": 0.00,
                            "sub_price": 0.00,
                            "sub_promotional_price": 0.0,
                            "sub_price_discount_per": 0.0,
                            "sub_price_discount_fix": 0.0,
                            "final_price": 0.0,
                            "price_current_taken_type": "Def",
                            "price_id": "0"
                        },
                        "isCheckboxCheck": false,
                        "dish_price_details": [],
                        "modifier_details": [],
                        "set_item_details": [],
                        "suspend_details": {
                            "is_suspend_type": null,
                            "is_normal_supend": null,
                            "is_promo_suspend": null
                        },
                        "special_icon_details": []
                    },
                    {
                        "mst_product_id": 15206,
                        "mst_product_code": "MOD02",
                        "mst_product_name": "LESS OIL",
                        "mst_cat_id": 410,
                        "price_type": 1,
                        "mst_cat_discount": 0.0,
                        "mst_product_default_price": 0.0,
                        "mst_product_dish_ids": null,
                        "sides_pro_count": 1,
                        "is_sus_product": 0,
                        "mst_product_modifier_error_msg": "Sorry, you have exceeded the maximum number of selection for this item",
                        "fix_ptype_id": 2,
                        "mst_product_image": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "mst_product_image_web": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "subitem_type": 0,
                        "is_listing_type": false,
                        "product_qty": 0.0,
                        "item_price_details": {
                            "mst_cat_discount": 0.00,
                            "sub_price": 0.00,
                            "sub_promotional_price": 0.0,
                            "sub_price_discount_per": 0.0,
                            "sub_price_discount_fix": 0.0,
                            "final_price": 0.0,
                            "price_current_taken_type": "Def",
                            "price_id": "0"
                        },
                        "isCheckboxCheck": false,
                        "dish_price_details": [],
                        "modifier_details": [],
                        "set_item_details": [],
                        "suspend_details": {
                            "is_suspend_type": null,
                            "is_normal_supend": null,
                            "is_promo_suspend": null
                        },
                        "special_icon_details": []
                    }
                ]
            },
            {
                "mst_cat_id": 1,
                "mst_cat_code": "",
                "mst_cat_name": "SetDessert",
                "side_cat_count": 0,
                "side_cat_max_count": 0,
                "is_required": true,
                "per_qty": 0,
                "per_qty_max": 0,
                "is_pro_qty_type": true,
                "is_for_repeat_set_combo": false,
                "mst_product_repeat_group_no_of_times": 0,
                "product_details": [
                    {
                        "mst_product_id": 1170,
                        "mst_product_code": "ABN01",
                        "mst_product_name": "Awesome Beginnings",
                        "mst_cat_id": 204,
                        "price_type": 1,
                        "mst_cat_discount": 0.0,
                        "mst_product_default_price": 0.0,
                        "mst_product_dish_ids": null,
                        "sides_pro_count": 1,
                        "is_sus_product": 0,
                        "mst_product_modifier_error_msg": "Sorry, you have exceeded the maximum number of selection for this item",
                        "fix_ptype_id": 2,
                        "mst_product_image": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "mst_product_image_web": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "subitem_type": 1,
                        "is_listing_type": false,
                        "product_qty": 0.0,
                        "item_price_details": {
                            "mst_cat_discount": 0.00,
                            "sub_price": 0.00,
                            "sub_promotional_price": 0.0,
                            "sub_price_discount_per": 0.0,
                            "sub_price_discount_fix": 0.0,
                            "final_price": 0.0,
                            "price_current_taken_type": "Def",
                            "price_id": "0"
                        },
                        "isCheckboxCheck": false,
                        "dish_price_details": [],
                        "modifier_details": [],
                        "set_item_details": [],
                        "suspend_details": {
                            "is_suspend_type": null,
                            "is_normal_supend": null,
                            "is_promo_suspend": null
                        },
                        "special_icon_details": []
                    },
                    {
                        "mst_product_id": 1173,
                        "mst_product_code": "ABN04",
                        "mst_product_name": "Awesome Beginnings",
                        "mst_cat_id": 207,
                        "price_type": 3,
                        "mst_cat_discount": 0.0,
                        "mst_product_default_price": 0.0,
                        "mst_product_dish_ids": null,
                        "sides_pro_count": 1,
                        "is_sus_product": 0,
                        "mst_product_modifier_error_msg": "Sorry, you have exceeded the maximum number of selection for this item",
                        "fix_ptype_id": 2,
                        "mst_product_image": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "mst_product_image_web": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "subitem_type": 1,
                        "is_listing_type": false,
                        "product_qty": 0.0,
                        "item_price_details": {},
                        "isCheckboxCheck": false,
                        "dish_price_details": [
                            {
                                "dish_id": 2,
                                "dish_name": "Medium",
                                "dish_abb": "Medium",
                                "dish_price": {
                                    "mst_cat_discount": 0.00,
                                    "sub_price": 0.10,
                                    "sub_promotional_price": 0.00,
                                    "sub_price_discount_per": 0.00,
                                    "sub_price_discount_fix": 0.00,
                                    "final_price": 0.10,
                                    "price_current_taken_type": "Com",
                                    "price_id": "77"
                                },
                                "is_default": "1"
                            }
                        ],
                        "modifier_details": [
                            {
                                "modifier_id": "1",
                                "modifier_name": "Spicy",
                                "modifier_abb": "Spicy",
                                "modifier_need_printer": "False",
                                "modifier_type": "Com",
                                "sub_product_modifers_id": "20",
                                "modifier_options": [
                                    {
                                        "sub_option_id": 9,
                                        "modifier_options_id": 9,
                                        "modifier_options_name": "NO",
                                        "modifier_options_abb": "NO",
                                        "modifier_options_default": 1,
                                        "modifier_options_price": 0.00,
                                        "modifier_options_printer": "0",
                                        "modifier_options_type": "Main"
                                    },
                                    {
                                        "sub_option_id": 8,
                                        "modifier_options_id": 8,
                                        "modifier_options_name": "YES",
                                        "modifier_options_abb": "YES",
                                        "modifier_options_default": 0,
                                        "modifier_options_price": 0.00,
                                        "modifier_options_printer": "0",
                                        "modifier_options_type": "Main"
                                    }
                                ]
                            }
                        ],
                        "set_item_details": [],
                        "suspend_details": {
                            "is_suspend_type": null,
                            "is_normal_supend": null,
                            "is_promo_suspend": null
                        },
                        "special_icon_details": []
                    },
                    {
                        "mst_product_id": 785,
                        "mst_product_code": "GEGLS",
                        "mst_product_name": "(Cold Brew) Gryphon  Earl Grey Lavender Strawberry",
                        "mst_cat_id": 222,
                        "price_type": 1,
                        "mst_cat_discount": 0.0,
                        "mst_product_default_price": 0.0,
                        "mst_product_dish_ids": null,
                        "sides_pro_count": 1,
                        "is_sus_product": 0,
                        "mst_product_modifier_error_msg": "Sorry, you have exceeded the maximum number of selection for this item",
                        "fix_ptype_id": 2,
                        "mst_product_image": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "mst_product_image_web": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "subitem_type": 1,
                        "is_listing_type": false,
                        "product_qty": 0.0,
                        "item_price_details": {
                            "mst_cat_discount": 0.00,
                            "sub_price": 20.00,
                            "sub_promotional_price": 0.00,
                            "sub_price_discount_per": 0.00,
                            "sub_price_discount_fix": 0.00,
                            "final_price": 20.00,
                            "price_current_taken_type": "Com",
                            "price_id": "5829"
                        },
                        "isCheckboxCheck": false,
                        "dish_price_details": [],
                        "modifier_details": [],
                        "set_item_details": [],
                        "suspend_details": {
                            "is_suspend_type": null,
                            "is_normal_supend": null,
                            "is_promo_suspend": null
                        },
                        "special_icon_details": []
                    },
                    {
                        "mst_product_id": 1146,
                        "mst_product_code": "D002",
                        "mst_product_name": "Steamed Boston Lobster with Minced Garlic",
                        "mst_cat_id": 195,
                        "price_type": 1,
                        "mst_cat_discount": 0.0,
                        "mst_product_default_price": 0.0,
                        "mst_product_dish_ids": null,
                        "sides_pro_count": 1,
                        "is_sus_product": 0,
                        "mst_product_modifier_error_msg": "Sorry, you have exceeded the maximum number of selection for this item",
                        "fix_ptype_id": 2,
                        "mst_product_image": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "mst_product_image_web": "https://appspos.apdeliver.com/AppsPOSDemoSAS//images/Product/Box/",
                        "subitem_type": 1,
                        "is_listing_type": false,
                        "product_qty": 0.0,
                        "item_price_details": {
                            "mst_cat_discount": 0.00,
                            "sub_price": 0.00,
                            "sub_promotional_price": 0.0,
                            "sub_price_discount_per": 0.0,
                            "sub_price_discount_fix": 0.0,
                            "final_price": 0.0,
                            "price_current_taken_type": "Def",
                            "price_id": "0"
                        },
                        "isCheckboxCheck": false,
                        "dish_price_details": [],
                        "modifier_details": [
                            {
                                "modifier_id": "5",
                                "modifier_name": "SALT",
                                "modifier_abb": "SALT",
                                "modifier_need_printer": "True",
                                "modifier_type": "Com",
                                "sub_product_modifers_id": "14",
                                "modifier_options": [
                                    {
                                        "sub_option_id": 5,
                                        "modifier_options_id": 5,
                                        "modifier_options_name": "LESS",
                                        "modifier_options_abb": "LESS",
                                        "modifier_options_default": 0,
                                        "modifier_options_price": 5.00,
                                        "modifier_options_printer": "0",
                                        "modifier_options_type": "Main"
                                    },
                                    {
                                        "sub_option_id": 7,
                                        "modifier_options_id": 7,
                                        "modifier_options_name": "NORMAL",
                                        "modifier_options_abb": "NORMAL",
                                        "modifier_options_default": 1,
                                        "modifier_options_price": 1.00,
                                        "modifier_options_printer": "0",
                                        "modifier_options_type": "Main"
                                    },
                                    {
                                        "sub_option_id": 6,
                                        "modifier_options_id": 6,
                                        "modifier_options_name": "MORE",
                                        "modifier_options_abb": "MORE",
                                        "modifier_options_default": 0,
                                        "modifier_options_price": 2.00,
                                        "modifier_options_printer": "0",
                                        "modifier_options_type": "Main"
                                    }
                                ]
                            },
                            {
                                "modifier_id": "1",
                                "modifier_name": "Spicy",
                                "modifier_abb": "Spicy",
                                "modifier_need_printer": "False",
                                "modifier_type": "Com",
                                "sub_product_modifers_id": "14",
                                "modifier_options": [
                                    {
                                        "sub_option_id": 9,
                                        "modifier_options_id": 9,
                                        "modifier_options_name": "NO",
                                        "modifier_options_abb": "NO",
                                        "modifier_options_default": 1,
                                        "modifier_options_price": 0.00,
                                        "modifier_options_printer": "0",
                                        "modifier_options_type": "Main"
                                    },
                                    {
                                        "sub_option_id": 8,
                                        "modifier_options_id": 8,
                                        "modifier_options_name": "YES",
                                        "modifier_options_abb": "YES",
                                        "modifier_options_default": 0,
                                        "modifier_options_price": 0.00,
                                        "modifier_options_printer": "0",
                                        "modifier_options_type": "Main"
                                    }
                                ]
                            }
                        ],
                        "set_item_details": [],
                        "suspend_details": {
                            "is_suspend_type": null,
                            "is_normal_supend": null,
                            "is_promo_suspend": null
                        },
                        "special_icon_details": []
                    }
                ]
            }
        ]
    }
}
  constructor(private service:EmployeeService,private router:Router){

  }

  ngOnInit(): void {
    this.service.currentData.subscribe((data) => {
      this.receivedJsonData = data; 
      console.log(this.receivedJsonData)
    });

    const jsonObservable : Observable<any> = of(this.jsonData)
    jsonObservable.subscribe((jsonObservableData)=>{
        const group = jsonObservableData.data.details.reduce((acc: any, curr) => {
            let key=""
              key = curr.mst_cat_name;
          
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(curr);
            return acc;
          }, {});
      
          this.groupData = Object.keys(group ).map(key => ({
              mst_cat_name: key,
              products: group[key]
          }));
    })

    
 
  }
  showselectedProducts(){

    const jsonObservable : Observable<any> = of(this.groupData)
    jsonObservable.subscribe((jsonObservableData)=>{
        this.selectedData = this.groupData.map(category => {
            return {
              ...category,
              products: category.products.map(product => {
                return {
                  ...product,
                  product_details: product.product_details.filter(item => item.isCheckboxCheck === true)
                };
              }).filter(product => product.product_details.length > 0)
            };
          }).filter(category => category.products.length > 0);
    })

    }
  
}
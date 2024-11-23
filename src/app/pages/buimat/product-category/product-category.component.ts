import { Component,OnInit ,ViewChild,ElementRef,EventEmitter,Output} from '@angular/core';
import { AppService }   from '@services/app.service';
import { ProductService }   from '@services/products.service';
import { Router, NavigationEnd } from '@angular/router';
import { first } from 'rxjs/operators';
import { OrderService } from '@services/order.service';
import { SharedService } from '@services/shared.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  @ViewChild('widgetsContent') widgetsContent: ElementRef;
  // @Output() productDetails_ = new EventEmitter();
  displayMode: number =1;
  // brandData: any = {};
  // brandLists:any =[];
  // orderLists:any =[];

  minPrice=0;
  maxPrice=0;
  category_productsData: any = [];
  category_productsDataLists: any =[];
  temp_productLists: any =[];
  group_category_productsDataLists: any =[];
  brandList:any=[]


  alldataLists: any =[];


  category_id:string="";
  category_name:string="";
  isSubcategory:boolean=false;
  is_brand:false=false;
  error=""
  favourites:any=[]
  rangeValues: number[];
  textInput = "";
  pincode:string="";
  _ls_categoryProducts:any={}

  filter_subCategory:any=[]
  filter_brand:any=[]
  filter_options:any=[]


  constructor(
    private appServices     : AppService ,
    private productServices     : ProductService ,
    private orderServices:OrderService,
    private sharedServices:SharedService,
    private router:Router) {   
  }

  public ngOnInit() : void{
    

    
    var infoLocation = localStorage.getItem('locationInfo')!;
    if(infoLocation!=null){
      var data_location = JSON.parse(infoLocation);
      this.pincode= data_location.pincode;
    }
  


    const cate_products = localStorage.getItem("categoryProducts")!;
    this.favourites = localStorage.getItem("favourites")!;
    this._ls_categoryProducts = JSON.parse(cate_products);
    this.category_id = this._ls_categoryProducts._id;
    this.category_name = this._ls_categoryProducts.categoryName;
    
    window.scrollTo(0, 0) 


    this.getProductbyCategory(this.category_id);
    this.getSingleCategory(this.category_id);
    this.getProductFilter(this.category_id);

  }

  onDisplayModeChange(mode: number): void {
    this.displayMode = mode;
  }
  productDetails(product){
    this.router.navigate(['/products/'+product.productName])

  }

  showProductDetails(data:any){
    this.appServices.setProductDetails(data);
    localStorage.setItem("_productInfo",JSON.stringify(data));
    this.router.navigate(['/products/', data.productName]);
  }
  onSliderChange(){
    const minVal = this.rangeValues[0]
    const maxVal = this.rangeValues[1]
   // console.log(JSON.stringify(this.group_category_productsDataLists))
    //console.log(minVal+"-----"+maxVal)
    this.group_category_productsDataLists = this.temp_productLists;
    this.group_category_productsDataLists = this.group_category_productsDataLists.filter(user =>
      user.products.some(data => data.zone.price >= minVal && data.zone.price <= maxVal)
    );
  }
  /*--------------- Category-------------- */
  getSingleCategory(categoryID){
    
    this.productServices.getSingleCategory(categoryID,this.pincode).subscribe((data:any) => {
       var brandData = data;
       this.brandList = brandData.data.category.brand
    });
  }
  getProductbyCategory(categoryID){

      this.productServices.getProductbyCategory(categoryID,this.pincode).subscribe((data: {}) => {
          this.category_productsData = data;
          console.log("=product==category = = ="+JSON.stringify(this.category_productsData))

         
          this.isSubcategory = this.category_productsData.data.isSubcategory!
          this.alldataLists = this.category_productsData.data.products;
          
         this.category_productsDataLists = this.alldataLists;
         console.log("=product==category = = ="+  this.isSubcategory)

          // let { minValue, maxValue } = this.category_productsDataLists.reduce(
          //   (acc, curr) => ({
          //     minValue: Math.min(acc.minValue,curr.zone.price),
          //     maxValue: Math.max(acc.maxValue,curr.zone.price)
          //   }),
          //   { minValue: Number.POSITIVE_INFINITY, maxValue: Number.NEGATIVE_INFINITY }
          // );
          // this.minPrice = minValue;
          // this.maxPrice =maxValue
          // this.rangeValues=[];
          // this.rangeValues.push(this.minPrice);
          // this.rangeValues.push(this.maxPrice);



          const group = this.category_productsDataLists.reduce((acc: any, curr) => {
            let key=""
            if(this.isSubcategory){
              key = curr.subcategory.subcategoryName;
            }
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(curr);
            return acc;
          }, {});
      
          this.group_category_productsDataLists = Object.keys(group ).map(key => ({
            subcategory: key,
            products: group[key]
          }));
          this.temp_productLists = this.group_category_productsDataLists;
          this.updateProducts();
      });
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


              for(var k=0;k<this.group_category_productsDataLists?.length;k++){
                for(var j=0;j<this.group_category_productsDataLists[k].products.length;j++){

                  if(this.group_category_productsDataLists[k].products[j]._id ===  cData._id){
                      this.group_category_productsDataLists[k].products[j].favourite = status_;
                      break;
                  }
                }
              }
              this.getFavourites();
            }   
          },
            error: error => {
                this.error = error;
            }
        });
  
  
  }


  createKeyFromValue(array: any[], keyField: string): any {
    console.log("==="+JSON.stringify(array))
    return array.reduce((acc, obj) => {
      acc[obj[keyField]] = obj.optionValue.filter(item => item.checked).map(item => item.name);
      return acc;
    }, {});
  }

  searchData(){


    var brands =this.filter_brand
          .filter(item => item.checked)
          .map(item => item._id);
    var subCategories =this.filter_subCategory
          .filter(item => item.checked)
          .map(item => item._id);


   const jsonObject_Options = this.createKeyFromValue(this.filter_options, 'fieldName');


   var filterJson={
    "category": [this.category_id],
    "brand": brands,
    "subcategory": subCategories,
    "options":jsonObject_Options,
    "query": this.textInput
    }

    //console.log("==search - - -"+JSON.stringify(filterJson))
    
    this.productServices.getProductSearch(filterJson).subscribe((data: {}) => {
      console.log( "  - - -data- - -  "+JSON.stringify(data))  
      this.category_productsData = data;
      this.isSubcategory = this.category_productsData.data.isSubcategory!
      this.alldataLists = this.category_productsData.data.results;
      this.category_productsDataLists = this.alldataLists;
    
      let { minValue, maxValue } = this.category_productsDataLists.reduce(
        (acc, curr) => ({
          minValue: Math.min(acc.minValue,curr.zone.price),
          maxValue: Math.max(acc.maxValue,curr.zone.price)
        }),
        { minValue: Number.POSITIVE_INFINITY, maxValue: Number.NEGATIVE_INFINITY }
      );
      this.minPrice = minValue;
      this.maxPrice =maxValue
      this.rangeValues=[];
      this.rangeValues.push(this.minPrice);
      this.rangeValues.push(this.maxPrice);



      const group = this.category_productsDataLists.reduce((acc: any, curr) => {
        let key=""
        if(this.isSubcategory){
          key = curr.subcategory.subcategoryName;
        }
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(curr);
        return acc;
      }, {});
  
      this.group_category_productsDataLists = Object.keys(group ).map(key => ({
        subcategory: key,
        products: group[key]
      }));
      this.temp_productLists = this.group_category_productsDataLists;
      this.updateProducts();
      window.scrollTo(0, 0);
  });

    

  }
  clear(){

    this.filter_brand.forEach(obj => {
      obj['checked'] = false;
    });

    this.filter_subCategory.forEach(obj => {
      obj['checked'] = false;
    });
    this.textInput=""

   this.filter_options.forEach(obj => {
      obj['fieldName'] = obj.fieldName;
      obj['optionValue']=this.convertToJSONArray(obj.fieldValue);
    });
    this.getProductbyCategory(this.category_id);
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
  updateProducts(){
  }

  private convertToJSONArray(commaSeparatedString: string): { name: string; checked: boolean }[] {
    const items = commaSeparatedString.split(',');
    return items.map(item => ({ name: item.trim(), checked: false }));
  }

  getProductFilter(categoryID){
    
    var jsonData={
      "category": categoryID,
      "brand": "",
      "subcategory": ""
    }

    this.orderServices.getproductFilter(jsonData,this.pincode)
    .pipe(first())
    .subscribe({
        next: (data) => {


            this.filter_subCategory = data.data.filter.subcategory
            this.filter_brand = data.data.filter.brand
            const options = data.data.filter.options
            
           // alert("helo"+JSON.stringify(data))


            this.filter_brand.forEach(obj => {
              obj['checked'] = false;
            });

            this.filter_subCategory.forEach(obj => {
              obj['checked'] = false;
            });

            if(options){
              options.forEach(obj => {
                obj['fieldName'] = obj.fieldName;
                obj['optionValue']=this.convertToJSONArray(obj.fieldValue);
              });
              this.filter_options=options;
            }
            

           // console.log("=filter_options=="+JSON.stringify(this.filter_options))


        
      },
        error: error => {
            this.error = error;
            //Swal.fire("Error!",error.error.message,  "error")   
        }
    });
  }
  /*--------------- Category-------------- */




}
 


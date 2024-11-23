import { Component,OnInit,ViewChild,ElementRef } from '@angular/core';
import { UntypedFormBuilder,FormArray, Validators, FormGroup } from '@angular/forms';
import { AppService, Zone_Product }   from '@services/app.service';
import { OrderService}   from '@services/order.service';
import Swal from 'sweetalert2';
import { ExcelService } from '@services/excel.service';
import { ExcelProducts, Products } from '@services/data.service';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { first } from 'rxjs/operators';
import {Sort, MatSortModule} from '@angular/material/sort';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import {MycurrencyPipe} from '../../../../_helpers/custom.currencypipe';
import moment from 'moment';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { PdfDownloadService } from 'src/app/_services/pdf-download.service';
import { saveAs} from 'file-saver';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [DatePipe,MycurrencyPipe,MessageService]
})
export class AdminComponent implements OnInit
{
  @ViewChild("file") fileInput: ElementRef;
  @ViewChild('brandImage') _view_brandImg: ElementRef;
  @ViewChild('categoryImage') _view_categoryImg: ElementRef;
  @ViewChild('productImage') _view_productImg: ElementRef;
  categoryForm: FormGroup;
  subCategoryForm: FormGroup;
  brandForm: FormGroup;
  productForm: FormGroup;
  zoneForm: FormGroup;
  fieldForm: FormGroup;
  simpleUnitForm: FormGroup;
  compoundUnitForm: FormGroup;
  quantityForm:FormGroup;
  orderStatusForm:FormGroup;
  formOrderFilter:FormGroup;
  formProductFilter: FormGroup;
  eInvoiceForm: FormGroup;
  public isLoading : boolean = true;

  allZonePincode: string =""

  is_superAdmin = false;
  isBrandEdit = false;
  isCategoryEdit = false;
  isSubCategoryEdit = false;
  isZoneEdit= false;
  isFieldEdit= false;
  isSimpleUnitEdit= false;
  isCompoundUnitEdit= false;
  isSubCategory = false;
  isInvoiceSubmit = false;
  isAddProduct= false;
  e_invoice : boolean = false;
  _eInvoiceForm : boolean = false;

  isSplitDelivery: boolean = false;
  isQtyAvailable : boolean= false


  isExplicit : boolean= false
  unitValues:any={}

  temp_m_category="";

  temp_brandID="";
  temp_categoryID="";
  temp_subCategoryID="";
  temp_zoneID="";
  temp_fieldID="";
  temp_productID=""
  temp_sUnit_id="";
  temp_cUnit_id=""
  temp_FieldName="";

  edit_categoryID=""
  edit_subCategoryID="";
  alterValue: any; // You may use a specific type based on your use case

  s_categoryId=""
  s_subCategoryId=""
  s_brandId=""
  f_categoryId=""
  _fromUnit=""
  _toUnit=""
  p_zoneId =""
  p_categoryId=""
  pfcategoryId=""
  pfsubcategoryId=""
  p_brandID=""
  p_subCategoryID=""
  _categoryId=""
  
  page = 1;
  pageSize = 10;
  _u_page = 1;
  _u_pageSize = 10;
  _product_page = 1;
  _product_pageSize = 10;

  userRole:String=""
  bearerToken = "";
  urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  zoneProduct: Zone_Product[] = [];

  src_BrandImg!:String
  imageSrc_Category!:String
  imageSrc_SubCategory!:String
  imageSrc_Product!:String
  
  error=""
  isProductEdit= false;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];
  nModule = 1; //1 for Validate, 2 for Upload
  _selected_image="";
  isUserDetails_View = false;
  isOrderDetails_View = false;
  importProducts: ExcelProducts[] = [];

  _productLists: Products[] = [];
  _product_bulk_lists: Products[] = [];
  _product_bulk_error_lists: Products[] = [];
  
  // dropdownSettings:IDropdownSettings;

  _excel_ordersList:any[]=[]

  selectedOption: any;

  role:string=""
  productTempData:any=[];
  cityData: any = {};
  cityLists:any =[];

  brandData: any = {};
  brandLists:any =[];

  selectedBrandLists:any=[];
  category_brandLists:any=[];

  category_subCategoryLists:any=[];

  pf_selectedBrandLists:any=[];
  pf_category_brandLists:any=[];
  pf_selectedCategoryID="";
  pf_selectedSubCategoryID="";

  product_Filter_selectedSubCategoryLists:any=[];
  product_filter_subcategory_brandLists:any=[];


  selectedOrderStatus:any=[];
  _order_start_date=""
  _order_end_date=""

  categoryData: any = {};
  categoryLists:any =[];

  subCategoryData: any = {};
  subCategoryLists:any =[];

  subCategoryLists__:any =[];
  p_subCategoryLists__:any =[];

  zoneData: any = {};
  zoneDataLists:any =[];

  s_units_DataLists:any =[];
  c_units_DataLists:any =[];

  orderLists:any[] =[];
  filterOrderLists:any[]=[]


  associatedUnit_Lists:any=[]

  _data_OrderInfo:any

  fieldData: any = {};
  fieldDataLists:any =[];
  fieldOptionsDataLists:any =[];
  selectedFiles: File[] = [];

  dashboardData:any={}

  productData: any = {};
  productDataLists:any[] =[];
  filter_productDataLists:any[]=[];
  productOptionData_:any={}

  _s_product_info:any={}

  userData: any = {};
  userLists:any[] =[];
  private format = 'YYYY-MM-DD';

  _m_brandDetails :any;

  _userDetails :any;
  _orderDetails:any;
  _order_to_be_Delivered:any;
  _singleOrderInfo :any;
  _splitDeliveryDetails:any=[];
  _orderPriceDetails:any;
  _field_subCategoryLists:any =[];
  selected_OrderId =""
  selected_OrderId_OrderStatus=""
  
  selected_splitDeliveryID=""

  selectedFieldType =""
  _fieldTypes : any = "DropDown";

  fieldTypeValues: any = ["DropDown", "Input"];
  deliveryTime: any =  ['24 hours','48 hours','Above 48 hours'];

  orderStatusValue_: any =  [
    { label: 'Delivered', id: '1', disabled: false },
    { label: 'Dispatched', id: '2', disabled: false },
    { label: 'Transit', id: '3', disabled: false },   
    { label: 'In Process', id: '4', disabled: false },
    { label: 'Partial Delivered', id: '5', disabled: false },
    { label: 'Cancelled', id: '6', disabled: false },
    { label: 'Failed', id: '7', disabled: true }, 
  ];
  orderStatusList: any = ['Delivered','Dispatched', 'Transit','In Process','Cancelled','Failed'];
  // orderStatusList_Split: any = ['Delivered','Partial Delivered','Dispatched', 'Transit','In Process','Cancelled'];
  // orderStatusList_: any = ['Delivered','Partial Delivered','Dispatched', 'Transit','In Process'];


  orderStatusList_Split: any = ['Delivered','Dispatched', 'Transit','In Process','Cancelled'];
  orderStatusList_: any = ['Delivered','Dispatched', 'Transit','In Process'];

  decimalValues: any = [0,1,2];
  _decimalPoint=0
  term=""



  i=0
  constructor(
    private formBuilder: UntypedFormBuilder,    
    private appServices     : AppService,
    private orderServices     : OrderService,
    private messageService: MessageService,
    private http: HttpClient,
    private excelSrv: ExcelService,private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private datePipe: DatePipe,
    private currencyPipe: MycurrencyPipe,
    private pdfService: PdfDownloadService
    ) {
  }

  is_categorySubmit = false;
  is_subCategorySubmit = false;
  is_productsSubmit = false;
  is_brandSubmit= false;
  is_quantitySubmit = false
  is_zoneSubmit= false;
  is_fieldSubmit= false;
  is_productSubmit = false
  is_unitSubmit = false
  is_c_unitSubmit = false
  _product_Images : any = [];
  base64Image: any;

  // _product_Images_d : any = [];
  public ngOnInit() : void{
    // setTimeout(_ =>
    // {
    //   
    // }, 2000);
    
   this.role= localStorage.getItem("role")!.toLowerCase().replace(/\s/g, "");
   this.is_superAdmin = this.role==="superadmin"?true:false
   this.bearerToken =  localStorage.getItem('token')!
    this.getBrandLists()
    this.getCatgoryLists()
    this.getUserLists()
    this.getZoneLists()
    this.getSubCatgoryLists()
    this.getFieldLists()
    this.getProductLists()
    this.getDashboardCount()
    this.getSimpleUnitLists()
    this.getCompoundUnitLists()
    this.getOrderLists()

    this.categoryForm = this.formBuilder.group({
      categoryName: ['', [Validators.required]],
      brandID: [null],
      categoryImage: ['', [Validators.required]],

    });

    this.subCategoryForm = this.formBuilder.group({
      categoryId: [null, [Validators.required]],
      subCategoryName: ['',[Validators.required]] ,
    });

    this.brandForm = this.formBuilder.group({
      brandName: ['', [Validators.required]],
      url: [null, [Validators.pattern(this.urlRegex)]],
      brandImg: ['', [Validators.required]],
      // categoryId: [null, [Validators.required]],
      // subCategoryId: [null, [Validators.required]],
      // price: [null, [Validators.required]],
    });
    this.fieldForm = this.formBuilder.group({
      categoryId: ['', [Validators.required]],
      subcategoryId: [''],
      options: this.formBuilder.array([this.initOptionRows()])
    });

    // this.subCategoryForm.controls['subCategoryName'].disable();
    this.productForm = this.formBuilder.group({
      // categoryId: [''],
      // subcategoryId: [''],
      // brandId: [''],
      // altUnitPricing:[''],
      // isPrimaryPricing: [true],
      // isAltPricing: [false],
      // productName: ['', []],
      // description: ['', [ ]],
      // mrp: ['', [ ]],
      // minimumOrderQty: ['', [ ]],
      // perUnitPricing: ['', [ ]],
      // sgst: ['', [ ]],
      // cgst:['', [ ]],
      // hsn:['', [ ]],
      // zone: this.formBuilder.array([]),
      // productImage:  ['', []],
      // options: this.formBuilder.array([])
      categoryId: ['', [Validators.required]],
      subcategoryId: [''],
      brandId: [''],
      altUnitPricing:[''],
      isPrimaryPricing: [true, Validators.required],
      isExplicitUnit: [false],
      isAltPricing: [false, Validators.required],
      productName: ['', [Validators.required]],
      description: ['', [ Validators.required]],
      mrp: ['', [ Validators.required]],
      minimumOrderQty: ['', [ Validators.required]],
      perUnitPricing: ['', [ Validators.required]],
      sgst: ['', [ Validators.required]],
      cgst:['', [ Validators.required]],
      hsn:['', [ Validators.required]],
      deliveryTime:[this.deliveryTime[0], [ Validators.required]],
      zone: this.formBuilder.array([]),
      productImage:  [''],
      options: this.formBuilder.array([]),
      fromUnit: [''],
      toUnit: [''],
      toValue: [''],

    });


    this.zoneForm = this.formBuilder.group({
      // categoryId: [null, [Validators.required]],
      // subCategoryId: [null, [Validators.required]],
      zoneName: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pincode: ['', [ Validators.required]],
    });
    this.quantityForm =this.formBuilder.group({
      quantityData: this.formBuilder.array([]),
    });

    this.simpleUnitForm = this.formBuilder.group({
      formatName: ['', [Validators.required]],
      formatSymbol: ['', [Validators.required]],
      symbolToBeDisplayed: ['', [ Validators.required]],
      decimalPoint: [this._decimalPoint, [ Validators.required]],
    });
  
    this.orderStatusForm = this.formBuilder.group({  
      status:  ['']  
    });  
    this.formOrderFilter = this.formBuilder.group({  
       orderStatus:  ['']  ,
      _order_start_date:  ['']  ,
      _order_end_date:  ['']  
    }); 
    
    this.formProductFilter = this.formBuilder.group({
       categoryId:  ['']  ,
       subcategoryId:  ['']  ,
       brandId:  [''] ,
       text:  ['']  
    })
    
    this.compoundUnitForm = this.formBuilder.group({
      fromUnit: ['', [Validators.required]],
      toUnit: ['', [Validators.required]],
      toValue: ['', [ Validators.required]],
    });

        
    this.eInvoiceForm = this.formBuilder.group({
    vehicleNumber: ['', [Validators.required]],
    transportDocNumber: ['', [Validators.required]],
    driverName: ['', [Validators.required]],
    driverContact:['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],

    // transportationDistance: ['', [ Validators.required]],
    });
  }
  
  get f1() { return this.categoryForm.controls; }
  get f2() { return this.subCategoryForm.controls; }
  get fb() { return this.brandForm.controls; }
  get fp() { return this.productForm.controls; }
  get fz() { return this.zoneForm.controls; }
  get ff() { return this.fieldForm.controls; }
  get funit() { return this.simpleUnitForm.controls; }
  get fcunit() { return this.compoundUnitForm.controls; }
  get fInvoice() { return this.eInvoiceForm.controls; }
  get fQ() { return this.quantityForm.controls; }

  get fof(){  
    return this.formOrderFilter.controls;  
  }  
  get fs(){  
    return this.orderStatusForm.controls;  
  }  





  onFileChange(event:any) {
    const max_size = 1000000;
    const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];

    const reader = new FileReader();
    const file:File = event.target.files[0];


    if (file.size > max_size) {
        alert("Image Size should not exceed more than 1 MB")
        return false;
    }

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.src_BrandImg = reader.result as string;
        this.brandForm.patchValue({
          fileSource: reader.result
        });
        this.brandForm.get('brandImg')?.setValue(event.target.files[0]);
      };
    }
  }

  initOptionRows() {
    return this.formBuilder.group({
      // fieldName: ['', [Validators.required]],
      // fieldValue: ['',[Validators.required]],
      fieldName: [''],
      fieldValue: [''],
      fieldType:[this._fieldTypes],
      isFilter:false
    });
  } 

  newSplitOrderData(): FormGroup {
    return this.formBuilder.group({
      productId : [''],
      uid: [''],
      quantity: [''],
      availableQuantity: [''],
      splitQuantity: ['', [Validators.min(this.quantityForm.get('availableQuantity')!.value),Validators.required]],
    });
  }
  onItemSelect(item: any) {
   // console.log(item);
  }
  onSelectAll(items: any) {
   // console.log(items);
  }
  getZoneName(id){
    let zoneName = this.zoneDataLists.find(element => {
      return element._id === id;
    }).zoneName;
  
    return zoneName;   
  }

  Space(event:any){
    if(event.target.selectionStart === 0 && event.code==="Space"){
      event.preventDefault();
    }
  }
  pincode(event:any){
    if(event.target.selectionStart === 0 && event.code==="Space" && event.code===","){
      event.preventDefault();
    }
  }
    /*--------------- brand-------------- */

    onBrandSubmit(){
      this.is_brandSubmit = true;
      if (this.brandForm.invalid) {
        return;
      }
      var str_brandName = this.brandForm.get('brandName')?.value.trim();
      if(this.brandForm.get('url')?.value!=null){
        var url = this.brandForm.get('url')?.value.trim();
      }

        
      const formDataNew = new FormData();   
      formDataNew.append('brandName', str_brandName);
      formDataNew.append('url', url);
      formDataNew.append('brandImg', this.brandForm.get('brandImg')?.value);

      // for(let keyValuePair of formDataNew.entries()){
      //   console.log(keyValuePair); 
      // }
      if(!this.isBrandEdit){
        this.appServices.addBrand(formDataNew)
          .pipe(first())
          .subscribe({
              next: (data) => {
                if(data.status){
                  Swal.fire('Success', data.message, 'success');
                  this.getBrandLists();
                  this.formReset();
                }else{
                  Swal.fire("Oops...", "Unable to create "+str_brandName+". Duplicate Entry", "error");
                }
               },
              error: error => {
                  this.error = error;
                  Swal.fire("Error!",error.error.message,  "error")   
              }
          });
        
      }else{
        if(this.temp_brandID=="")return;
        this.appServices.updateBrand( this.temp_brandID,formDataNew)
        .pipe(first())
        .subscribe({
            next: (data) => {
              if(data.status){
                Swal.fire('Success', data.message, 'success');
                this.getBrandLists();
                this.formReset();
              }else{
                Swal.fire("Oops...", "Unable to create "+str_brandName+". Duplicate Entry", "error");
              }
             },
            error: error => {
                this.error = error;
                Swal.fire("Error!",error.error.message,  "error")   
            }
        });
      }
      
  }

   getBrandLists(){
    this.appServices.getBrandLists().subscribe((data: {}) => {
      
      this.brandData = data;
      this.brandLists = this.brandData.data.brands;
    });

  
  }

   deleteBrand(data:any){
    var brandName =data.brandName;
    Swal.fire({
      text: 'Are you sure you want to delete "'+brandName+'"?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then((result) => {
      if (result.value) {
        this.appServices.deleteBrand(data._id).subscribe((data: any) => {
          if(data.status){
            Swal.fire('Removed!', '"'+brandName+'" Brand removed successfully.', 'success');
            this.getBrandLists();
            this.formReset();
          }else{
            Swal.fire("Oops...", "Error! Please try again", "error");
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

   editBrand(data:any){

    this.formReset()
    this.isBrandEdit = true;
    this.temp_brandID = data._id;

    this.brandForm.patchValue({
      brandName: data.brandName,
      url:data.url,
      brandImg: data.brandImg
    });
    this.src_BrandImg = data.brandImg
    window.scrollTo(0,document.body.scrollHeight);
  }


   onTableDataChange(event: any) {
    this.page = event;
  }

   onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }
   /*--------------- brand-------------- */




  /*--------------- Category-------------- */
  onCategoryImagSelect(event:any) {
    const max_size = 1000000;
    const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];

    const reader = new FileReader();
    const file:File = event.target.files[0];

    if (file.size > max_size) {
        alert("Image Size should not exceed more than 1 MB")
        return false;
    }

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc_Category = reader.result as string;
        this.categoryForm.patchValue({
          fileSource: reader.result
        });
        this.categoryForm.get('categoryImage')?.setValue(event.target.files[0]);
      };
    }
  }

  onCategorySubmit(){
    var brandIds: any[] = [];


    this.selectedBrandLists = this.categoryForm.get('brandID')?.value;

    this.is_categorySubmit = true;
    var strCategoryName = this.categoryForm.get('categoryName')?.value.trim();

      if (this.categoryForm.invalid) {
        return;
      }
        
      const formDataNew = new FormData();   
      var isSub_category = this.isSubCategory ? true : false;
      formDataNew.append('categoryName', strCategoryName);
      formDataNew.append('categoryImage', this.categoryForm.get('categoryImage')?.value);
      // formDataNew.append('isSubcategory', ""+isSub_category);

      if(this.selectedBrandLists && this.selectedBrandLists.length>0){
        for (let i = 0; i < this.selectedBrandLists.length; i++) {
          brandIds.push(this.selectedBrandLists[i]._id)
        }
        formDataNew.append('brand',brandIds.toString());

      }else{
        formDataNew.append('brand',"");
      }


      // for(let keyValuePair of formDataNew.entries()){
      //   console.log(keyValuePair); 
      // }

      if(!this.isCategoryEdit){
        this.appServices.addCategory(formDataNew)
          .pipe(first())
          .subscribe({
              next: (data) => {
                  if(data.status){
                    Swal.fire('Success', data.message, 'success');
                    this.getCatgoryLists();
                    this.formReset();
                  }else{
                    Swal.fire("Error...", data.message, "error");
                  }
               },
              error: error => {
                  this.error = error;
                  Swal.fire("Error!",error.error.message,  "error")   
              }
          });
      }else{
        if(this.temp_categoryID=="")return;
        this.appServices.updateCategory(this.temp_categoryID,formDataNew)
        .subscribe({
          next: (data) => {
              if(data.status){
                Swal.fire('Success', data.message, 'success');
                this.getCatgoryLists();
                this.formReset();
              }else{
                Swal.fire("Oops...", "Something went wrong!", "error");
              }
           },
          error: error => {
              this.error = error;
              Swal.fire("Error!",error.error.message,  "error")   
          }
      });
      }

  }
  
  getCatgoryLists(){
    this.appServices.getCategoryLists().subscribe((data: {}) => {
      this.categoryData = data;
      this.categoryLists = this.categoryData.data.categories;
    });
  }


  deleteCategory(data:any){

    var name = data.categoryName;
    Swal.fire({
      text: 'Are you sure you want to delete "'+name+'"?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then((result) => {
      //console.log("==="+JSON.stringify(result))
      if (result.value) {
        this.appServices.deleteCategory(data._id).subscribe(
          {       
            next: (data) => {
                if(data.status){
                  Swal.fire('Removed!', '"'+name+'" Category removed successfully.', 'success');
                  this.getCatgoryLists();
                  this.formReset();
                }else{
                  Swal.fire("Oops...", "Something went wrong!", "error");
                }
             },
            error: error => {
                this.error = error;
                if(error.status==400){
                  Swal.fire("ALERT !",error.error.message+". You cannot delete it",  error)   ;
                  // Swal.fire({
                  //   text: error.error.message+". You cannot delete it. Make Inactive",
                  //   icon: 'info',
                  //   showCancelButton: true,
                  //   confirmButtonText: 'Yes, Inactive it.',
                  //   cancelButtonText: 'No, Cancel',
                  // }).then((result) => {
                  //   console.log("==="+JSON.stringify(result))
                  //   if (result.value) {
                  //     this.appServices.deleteCategory_(data._id).subscribe(
                  //       {       
                  //         next: (data) => {
                  //             if(data.status){
                  //               Swal.fire('Removed!', '"'+name+'" Category removed successfully.', 'success');
                  //               this.getCatgoryLists();
                  //               this.formReset();
                  //             }else{
                  //               Swal.fire("Oops...", "Something went wrong!", "error");
                  //             }
                  //          },
                  //          error: error => {
                  //           this.error = error;
                  //           Swal.fire("Error!",error.error.message,  "error")   
                  //          }
                  //         });
                      
                  //   } else if (result.dismiss === Swal.DismissReason.cancel) {
                  //   }
                  //});
                }else{
                  Swal.fire("Error!",error.error.message,  "error")   
                }
            }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });

  }


  editCategory(data:any){
    this.formReset()
    this.isCategoryEdit = true;
    this.temp_categoryID = data._id;

    this.categoryForm.patchValue({
      categoryName: data.categoryName,
      brandID: data.brand,
      categoryImage: data.categoryImage

    });
    this.imageSrc_Category = data.categoryImage
    window.scrollTo(0,document.body.scrollHeight);
    
  }


  /*--------------- Category-------------- */


  
  /*--------------- Sub Category-------------- */

  onSubCategorySubmit(){
      this.is_subCategorySubmit = true;
      if (this.subCategoryForm.invalid) {
        return;
      }
        
      const formDataNew = new FormData();   
      var str_subCategoryName = this.subCategoryForm.get('subCategoryName')?.value.trim();
      formDataNew.append('subcategoryName', str_subCategoryName);
      formDataNew.append('categoryId', this.subCategoryForm.get('categoryId')?.value);
      // formDataNew.append('options',JSON.stringify(this.subCategoryForm.get('options')?.value));

      // for(let keyValuePair of formDataNew.entries()){
      //   console.log(keyValuePair); 
      // }
      if(!this.isSubCategoryEdit){
        this.appServices.addSubCategory(formDataNew)
        .pipe(first())
        .subscribe({
            next: (data) => {
                if(data.status){
                  Swal.fire('Success', 'Sub category added Successfully!', 'success');
                  this.getSubCatgoryLists();
                  this.formReset();
                }else{
                  Swal.fire("Oops...", "Something went wrong!", "error");
                }
             },
            error: error => {
                this.error = error;
                Swal.fire("Error!",error.error.message,  "error")   
            }
        });
      }else{
        if(this.temp_subCategoryID=="")return;
        this.appServices.updateSubCategory(this.temp_subCategoryID,formDataNew)
        .pipe(first())
        .subscribe({
            next: (data) => {
                if(data.status){
                  Swal.fire('Success', data.message, 'success');
                  this.getSubCatgoryLists();
                  this.formReset();
                }else{
                  Swal.fire("Oops...", "Unable to create "+str_subCategoryName+". Duplicate Entry", "error");
                }
                  },
            error: error => {
                this.error = error;
                Swal.fire("Error!",error.error.message,  "error")   
            }
        });
      }
    
  }

  editSubCategory(data:any){
    this.formReset()
    this.isSubCategoryEdit = true;
    this.temp_subCategoryID= data._id;
    
    this.subCategoryForm.patchValue({
      categoryId: data.category._id,
      subCategoryName: data.subcategoryName
    });
    window.scrollTo(0,document.body.scrollHeight);
  }
  updateCategoryStatus(data){
    var _name =data.categoryName;
    Swal.fire({
      text: 'Are you sure you want to active the  "'+_name+'"?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.appServices.updateCategoryStatus_(data._id)
        .subscribe({
          next: (data) => {
              if(data.status){
                Swal.fire('Success', data.message, 'success');
                this.getCatgoryLists();
                this.formReset();
              }else{
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

  
  updateSubCategoryStatus(data){
    var _name =data.subcategoryName;
    Swal.fire({
      text: 'Are you sure you want to active the  "'+_name+'"?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.appServices.updateSubCategoryStatus(data._id)
        .subscribe({
          next: (data) => {
              if(data.status){
                Swal.fire('Success', data.message, 'success');
                this.getSubCatgoryLists();
                this.formReset();
              }else{
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

  updateProductStatus(data){
    var _name =data.product.productName;
    Swal.fire({
      text: 'Are you sure you want to active the  "'+_name+'"?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.appServices.updateProductStatus(data._id).subscribe((data: any) => {
          if(data.status){
            this.getProductLists();
            this.formReset();
          }else{
            Swal.fire("Oops...", "Error! Please try again", "error");
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  deleteSubCategory(data:any){
    var name = data.subcategoryName;
    Swal.fire({
      text: 'Are you sure you want to delete "'+name+'"?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then((result) => {
      //console.log("==="+JSON.stringify(result))
      if (result.value) {
        this.appServices.deleteSubCategory(data._id).subscribe(
          {       
            next: (data) => {
                if(data.status){
                  Swal.fire('Removed!', '"'+name+'" Category removed successfully.', 'success');
                  this.getSubCatgoryLists();
                  this.formReset();
                }else{
                  Swal.fire("Oops...", "Something went wrong!", "error");
                }
             },
            error: error => {
                this.error = error;
                if(error.status==400){
                  Swal.fire({
                    text: error.error.message+". You cannot delete it. Make Inactive",
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Inactive it.',
                    cancelButtonText: 'No, Cancel',
                  }).then((result) => {
                    if (result.value) {
                      this.appServices.deleteSubCategory_(data._id).subscribe(
                        {       
                          next: (data) => {
                              if(data.status){
                                Swal.fire('Removed!', '"'+name+'" SubCategory removed successfully.', 'success');
                                this.getSubCatgoryLists();
                                this.formReset();
                              }else{
                                Swal.fire("Oops...", "Something went wrong!", "error");
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
                }else{
                  Swal.fire("Error!",error.error.message,  "error")   
                }
            }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });

  }

  getSubCatgoryLists(){
    this.appServices.getSubCategoryLists().subscribe((data: {}) => {
      this.subCategoryData = data;
      this.subCategoryLists = this.subCategoryData.data.subcategories;
    });
  }

   /*--------------- Sub Category-------------- */

   /*--------------- zone-------------- */
   getZoneLists(){
      this.isLoading = true
      this.appServices.getZoneLists().subscribe((data: {}) => {
            
            this.zoneData = data;
            this.zoneDataLists = this.zoneData.data.zones;
              for(var i=0;i<this.zoneDataLists.length;i++){
                const resultString: string = this.zoneDataLists[i].pincode.join(',');
                if(this.allZonePincode==""){
                  this.allZonePincode = resultString;
                }else{
                  this.allZonePincode += ',' + resultString;
                }
              }


              let control = this.productForm.get('zone') as FormArray;
              for(var i=0;i<this.zoneDataLists.length;i++){
                  control.push(this.formBuilder.group({
                  'zoneName':  this.zoneDataLists[i].zoneName,
                  'zoneId': this.zoneDataLists[i]._id,
                  'price':[''],
                  'isVariablePricing':[false],
                  'variablePricings':this.formBuilder.array([])
                }));
              }
      
      });
   }

   onZoneSubmit(){


      this.is_zoneSubmit = true;
      if (this.zoneForm.invalid) {
        return;
      }
        
      if(this.zoneDataLists.length>0){
        var zoneName =this.zoneForm.get('zoneName')?.value.trim()
        for (var i=0;i<this.zoneDataLists.length;i++) {
          if(zoneName=== this.zoneDataLists[i].zoneName && this.temp_zoneID!=this.zoneDataLists[i]._id){
            this.messageService.add({
              severity: "error",
              key: 'c',
              detail: "Zone Name "+zoneName+" already exists"
            });
            return;
          }
        }
      }


      var zonePINCODE =this.zoneForm.get('pincode')?.value.trim()
      zonePINCODE = zonePINCODE.replace(/\s+$/, '');
      zonePINCODE = zonePINCODE.replace(/,\s*$/, '');

      const uniqueValues = new Set<string>();
      const values: string[] = zonePINCODE.split(',');
      for (const value of values) {
        if (/^\d{6}$/.test(value)) {
            if (uniqueValues.has(value)) {
                this.messageService.add({
                  severity: "error",
                  key: 'c',
                  detail: "Duplicate PINCODE "+value+" found"
                });
                return true; // Indicates that a duplicate was found
            } else {
                uniqueValues.add(value);
            }
        }else{
          this.messageService.add({
            severity: "error",
            key: 'c',
            detail: "Invalid Pincode found "+value
          });
          return
        }
      }


      const values1: string[] = zonePINCODE.split(',');
      const values2: string[] = this.allZonePincode.split(',');
      
  
      const commonValues: string[] = values1.filter(value => values2.includes(value));
      if(!this.isZoneEdit){
        if (commonValues.length > 0) {
          this.messageService.add({
            severity: "error",
            key: 'c',
            detail: commonValues.join(', ')+" - PINCODE already exits in different ZONE "
          });
          return;
        } 
      }else{
        let resultString: string=""
        for(var i=0;i<this.zoneDataLists.length;i++){
          if(this.zoneDataLists[i]._id !== this.temp_zoneID){
            resultString = this.zoneDataLists[i].pincode.join(',');
          }
        }
        const values1_: string[] = zonePINCODE.split(',');
        const values2_: string[] = resultString.split(',');
        const commonValues_: string[] = values1_.filter(value => values2_.includes(value));
        if (commonValues_.length > 0) {
          this.messageService.add({
            severity: "error",
            key: 'c',
            detail: commonValues_.join(', ')+" - PINCODE already exits in different ZONE "
          });
          return;
        } 
       
      }

    

      if(!this.isZoneEdit){
        const _data =[{
          "zoneName":this.zoneForm.get('zoneName')?.value.trim(),
          "city":this.zoneForm.get('city')?.value.trim(),
          "pincode":zonePINCODE
          }]
        this.appServices.addZone(_data)
        .subscribe({
          next: (data) => {
            if(data.status){
              Swal.fire('Success', 'Zone added Successfully!', 'success');
              this.getZoneLists();
              this.formReset();
            }
           },
          error: error => {
              this.error = error;
              Swal.fire("Error!",error.error.message,  "error")   
          }
      });
      }else{
        const _data ={
          "zoneName":this.zoneForm.get('zoneName')?.value.trim(),
          "city":this.zoneForm.get('city')?.value.trim(),
          "pincode":this.zoneForm.get('pincode')?.value.trim()
          }
        this.appServices.updateZone(this.temp_zoneID, _data)
        .subscribe({
          next: (data) => {
            if(data.status){
            Swal.fire('Success', 'Zone updated Successfully!', 'success');
            this.getZoneLists();
            this.formReset();
            }
           },
          error: error => {
              this.error = error;
              Swal.fire("Error!",error.error.message,  "error")   
          }
      });
      }
    }

   deleteZone(data:any){

      Swal.fire({
        text: 'Are you sure you want to delete?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, go ahead.',
        cancelButtonText: 'No, let me think',
      }).then((result) => {
        if (result.value) {
          this.appServices.deleteZone(data._id).subscribe((data: any) => {
            if(data.status){
              Swal.fire('Removed!', 'Deleted successfully.', 'success');
              this.getZoneLists();
              this.formReset();
            }else{
              Swal.fire("Oops...", "Error! Please try again", "error");
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }

  editZone(data:any){
    this.formReset()
    this.isZoneEdit = true;
    this.temp_zoneID= data._id;
    this.zoneForm.patchValue({
      zoneName: data.zoneName,
      city: data.city,
      pincode: data.pincode.toString()
    });
    window.scrollTo(0,document.body.scrollHeight);
    
  }

  /*----------------------------------- zone----------------------------------- */

  getSimpleUnitLists(){
    this.isLoading = true
    this.appServices.getSimpleUnitLists().subscribe((data:any) => {
          
          this.s_units_DataLists = data.data.units;
    });
 }

  getCompoundUnitLists(){
    this.isLoading = true
    this.appServices.getCompoundUnitLists().subscribe((data:any) => {
          

          this.c_units_DataLists = data.data.units;
    });
  }

  onUnitSubmit(){
    this.is_unitSubmit = true;
    if (this.simpleUnitForm.invalid) {
      return;
    }
      
     const _data ={
      "formatName":this.simpleUnitForm.get('formatName')?.value.trim(),
      "formatSymbol":this.simpleUnitForm.get('formatSymbol')?.value.trim(),
      "decimalPoint":this.simpleUnitForm.get('decimalPoint')?.value,
      "symbolToBeDisplayed":this.simpleUnitForm.get('symbolToBeDisplayed')?.value.trim()
      }

      if(!this.isSimpleUnitEdit){
        this.appServices.addSimpleUnit(_data).subscribe((data: any) => {
          if(data.status){
            Swal.fire('Success', 'Simple Unit added Successfully!', 'success');
            this.getSimpleUnitLists();
            this.formReset();
          }else{
            Swal.fire("Oops...", data.message, "error");
          }
        });
      }else{
        this.appServices.updatesimpleUnit(this.temp_sUnit_id, _data).subscribe((data: any) => {
          if(data.status){
            Swal.fire('Success', 'Simple Unit updated Successfully!', 'success');
            this.getSimpleUnitLists();
            this.formReset();
          }else{
            Swal.fire("Oops...", data.message, "error");
          }
        });
      }
  }
  onCompoundUnitSumbit(){
    this.is_c_unitSubmit = true;
    if (this.compoundUnitForm.invalid) {
      return;
    }
      
     const _data ={
        "fromUnit":this.compoundUnitForm.get('fromUnit')?.value,
        "toUnit":this.compoundUnitForm.get('toUnit')?.value,
        "toValue":this.compoundUnitForm.get('toValue')?.value,
      }

      if(!this.isCompoundUnitEdit){
        this.appServices.addCompoundUnit(_data).subscribe((data: any) => {
          if(data.status){
            Swal.fire('Success', 'Compound Unit added Successfully!', 'success');
            this.getCompoundUnitLists();
            this.formReset();
          }else{
            Swal.fire("Oops...", "Something went wrong!", "error");
          }
        });
      }else{
        this.appServices.updateCompoundUnit(this.temp_cUnit_id, _data).subscribe((data: any) => {
          if(data.status){
            Swal.fire('Success', 'Compound Unit updated Successfully!', 'success');
            this.getCompoundUnitLists();
            this.formReset();
          }else{
            Swal.fire("Oops...", "Something went wrong!", "error");
          }
        });
      }
  }

  deleteSimpleUnit(data:any){

    Swal.fire({
      text: 'Are you sure you want to delete?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then((result) => {
      if (result.value) {
        this.appServices.deleteSimpleUnit(data._id).subscribe((data: any) => {
          if(data.status){
            Swal.fire('Removed!', 'Deleted successfully.', 'success');
            this.getSimpleUnitLists();
            this.formReset();
          }else{
            Swal.fire("Oops...", "Error! Please try again", "error");
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  editSimpleUnit(data:any){
    this.formReset()
    this.isSimpleUnitEdit = true;
    this.temp_sUnit_id= data._id;
    
    this.simpleUnitForm.patchValue({
      formatName:data.formatName,
      formatSymbol:data.formatSymbol,
      decimalPoint:data.decimalPoint,
      symbolToBeDisplayed:data.symbolToBeDisplayed
    });
    window.scrollTo(0,document.body.scrollHeight);
    
  }

  deleteCompoundUnit(data:any){

    Swal.fire({
      text: 'Are you sure you want to delete?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then((result) => {
      if (result.value) {
        this.appServices.deleteCompoundUnit(data._id).subscribe((data: any) => {
          if(data.status){
            Swal.fire('Removed!', 'Deleted successfully.', 'success');
            this.getCompoundUnitLists();
            this.formReset();
          }else{
            Swal.fire("Oops...", "Error! Please try again", "error");
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  editCompoundUnit(data:any){
    this.formReset()
    this.isCompoundUnitEdit = true;
    this.temp_cUnit_id= data._id;
    
    this.compoundUnitForm.patchValue({
      fromUnit:data.fromUnit._id,
      toUnit:data.toUnit._id,
      toValue:data.toValue
    });
    window.scrollTo(0,document.body.scrollHeight);
    
  }

    /*--------------- field-------------- */

    isSubCategoryOption = false;
    onCategoryChange(categoryID:any,subCategory){
      this.subCategoryLists__ =[];
      this.appServices._getSingleSubCategoryLists(categoryID).subscribe((data:any) => {
        this.subCategoryLists__ = data.data.subcategories;
         if(  this.subCategoryLists__.length > 0) {
          if(!this.isFieldEdit){
            this.fieldForm.patchValue({
              subcategoryId: ''
            });
          }else{
            if(subCategory==null||subCategory==""){
              this.fieldForm.patchValue({
                subcategoryId: ''
              });
            }else{
              this.fieldForm.patchValue({
                subcategoryId: subCategory._id
              });
            }
          }
          //this.fieldForm.controls['subcategoryId'].setErrors({ isRequired: true });
         } else {
          //this.fieldForm.controls['subcategoryId'].setErrors({ isRequired: false });
          this.fieldForm.patchValue({
            subcategoryId: ''
          });
         }
      });
    }

    checkForDuplicates(key: string,jsonArray): boolean {
      this.temp_FieldName = ""
      const values = jsonArray.map(item => item[key]);

      for (let i = 0; i < values.length; i++) {
        for (let j = i + 1; j < values.length; j++) {
          if (values[i] === values[j]) {
            this.temp_FieldName = values[i]
            return true; 
          }
        }
      }
  
      return false; 
    }
  

    onFieldSubmit(){
      this.messageService.clear();
      this.is_fieldSubmit = true;
      if (this.fieldForm.invalid) {
        return;
      }
      const subCategoryID= this.fieldForm.get('subcategoryId')?.value
      if(this.subCategoryLists__.length>0 && subCategoryID==''){
        this.messageService.add({
          severity: "warn",
          key: 'tr',
          detail: "Please select the Sub Category"
        });
        return;
      }

      var optionData_ = this.fieldForm.get('options')?.value;
      for(var i=0;i<optionData_.length;i++){
        if(optionData_[i].fieldName==""){
   
            this.messageService.add({
              severity: "warn",
              key: 'tr',
              detail: "Enter Field Name"
            });
         
          return;
        }
        if(optionData_[i].fieldType=="DropDown"){
          if(optionData_[i].fieldValue==""){
              this.messageService.add({
                severity: "warn",key: 'tr',
                detail: "Enter Field Value"
              });
            return
          }
        }
      }

        const hasDuplicates = this.checkForDuplicates('fieldName',optionData_);
        if (hasDuplicates) {
          this.messageService.add({
            severity: "warn",
            key: 'tr',
            detail: "Duplicate Field Name "+this.temp_FieldName+" founded."
          });
          return;
        } else {
        }
      
        var optionValues = this.fieldForm.get('options')?.value;
        optionValues = optionValues.map(item => ({ ...item, fieldValue: this.trimTrailingComma(item.fieldValue) }));

        const _data ={
          "categoryId":this.fieldForm.get('categoryId')?.value,
          "subcategoryId":this.fieldForm.get('subcategoryId')?.value,
          "options":optionValues
        }

        // const _data ={
        //   "categoryId":this.fieldForm.get('categoryId')?.value,
        //   "subcategoryId":this.fieldForm.get('subcategoryId')?.value,
        //   "options":this.fieldForm.get('options')?.value
        // }

  
      if(!this.isFieldEdit){
        this.appServices.addFields(_data).subscribe((data: any) => {
          if(data.status){
            Swal.fire('Success', 'Fields added Successfully!', 'success');
            this.getFieldLists();
            this.formReset();
          }else{
            Swal.fire("Oops...", data.message, "error");
          }
        });
      }else{
        if(this.temp_fieldID=="")return;
        this.appServices.updateFields(this.temp_fieldID,_data).subscribe((data: any) => {
          if(data.status){
            Swal.fire('Success', data.message, 'success');
            this.getFieldLists();
            this.formReset();
          }else{
            Swal.fire("Oops...", "Duplicate Entry", "error");
          }
        });
      }
    }

    deleteFields(data:any){
      Swal.fire({
        text: 'Are you sure you want to delete',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, go ahead.',
        cancelButtonText: 'No, let me think',
      }).then((result) => {
        if (result.value) {
          this.appServices.deleteField(data._id).subscribe((data: any) => {
            if(data.status){
              Swal.fire('Removed!', 'Field removed successfully.', 'success');
              this.getFieldLists();
              this.formReset();
            }else{
              Swal.fire("Oops...", "Error! Please try again", "error");
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  
    }

    selected = "----"

    selectedUnit = "----"

    editField(data:any){
      this.formReset()
      this.isFieldEdit = true;
      this.temp_fieldID= data._id;

      this.onCategoryChange(data.category._id,data.subcategory)
      this.fieldForm.patchValue({
        categoryId: data.category._id,
        options:  this.updateOptions(data)
      });
      window.scrollTo(0,document.body.scrollHeight);
      
    }

    updateOptions(data){

      let frmArray = this.fieldForm.get('options') as FormArray;
      frmArray.clear();

      let control = this.fieldForm.get('options') as FormArray;
      data.options.forEach(x=>{
          control.push(this.formBuilder.group({
            // fieldName: [x.fieldName, [Validators.required]],
            // fieldValue:  [x.fieldValue, [Validators.required]],
            fieldName: [x.fieldName],
            fieldValue:  [x.fieldValue],
            fieldType: this.fieldTypeValues[this.switchResult(x.fieldType)],
            isFilter: x.isFilter
          }));
      });
    }

    getFieldLists(){
      this.isLoading = true
      this.appServices.getFieldLists().subscribe((data: {}) => {
            
            this.fieldData = data;
            this.fieldDataLists = this.fieldData.data.fields;
       
      });
    }

    get options_() : FormArray {
      return this.fieldForm.get('options') as FormArray;
    }
    newOptions_(): FormGroup {
      return this.formBuilder.group({
        // fieldName: ['', [Validators.required]],
        // fieldValue: ['',[Validators.required]],
         fieldName: [''],
        fieldValue: [''],
        fieldType:[this._fieldTypes],
        isFilter:false
      })
    }
    addItems_() {
      this.options_.push(this.newOptions_());
    }
    deleteRow_(index: number) {
      this.options_.removeAt(index);
    }

    onSelectChange(e:any,i){
      if(e.target.value==="Input"){
        this.fieldForm.get('options')?.['controls'][i].get('fieldValue').setValue("")
      }else{
      }
    }

    onStatusChange(status, id, orderID ){

      const json={
        'status':status,
        "isSplitDelivery": true,
        "splitDeliveryId": id
      }
      this.orderServices.updateOrderStatus(json, orderID)
      .pipe(first())
      .subscribe({
          next: (data) => {
            Swal.fire('Success', data.message, 'success');
            this.modalService.dismissAll();
            this.getOrderLists();
          },
          error: error => {
              this.error = error;
          }
      });

    }
    onOrderStatus(e:any){      

    if(this.isSplitDelivery && this._order_to_be_Delivered.length>0){
      this.messageService.add({
        severity: "error",
        key: 'c',  
        detail: "Please complete the entire order. It cannot be changed to "+e.target.value,
        life:2000
      });
      this.orderStatusForm.patchValue({
        status:   this.selected_OrderId_OrderStatus 
      });
      return
    }  
    if((this.selected_OrderId_OrderStatus==='Transit' ||this.selected_OrderId_OrderStatus==='Dispatched'||this.selected_OrderId_OrderStatus==='Partial Delivered' ) && e.target.value==='In Process'){
        this.messageService.add({
          severity: "error",
          key: 'c',  
          detail: "The order status was already in "+this.selected_OrderId_OrderStatus+". It cannot be changed to "+e.target.value,
          life:2000
        });
        // this.orderStatusForm.patchValue({
        //   status:   this.orderStatusList[this.switchOrderStatus(this.selected_OrderId_OrderStatus)] 
        // });
        this.orderStatusForm.patchValue({
          status:   this.selected_OrderId_OrderStatus 
        });
  
      return
    }
      if((this.selected_OrderId_OrderStatus==='Dispatched'||this.selected_OrderId_OrderStatus==='Partial Delivered' ) && e.target.value==='Transit'){
          this.messageService.add({
            severity: "error",
            key: 'c',  
            detail: "The order status was already in "+this.selected_OrderId_OrderStatus+". It cannot be changed to "+e.target.value,
            life:2000
          });
          // this.orderStatusForm.patchValue({
          //   status:   this.orderStatusList[this.switchOrderStatus(this.selected_OrderId_OrderStatus)] 
          // });
          this.orderStatusForm.patchValue({
            status:   this.selected_OrderId_OrderStatus 
          });
    
       return
    }

      if((this.selected_OrderId_OrderStatus==='Partial Delivered') && e.target.value==='Dispatched'){
        this.messageService.add({
          severity: "error",
          key: 'c',  
          detail: "The order status was already in "+this.selected_OrderId_OrderStatus+". It cannot be changed to "+e.target.value,
          life:2000
        });
        // this.orderStatusForm.patchValue({
        //   status:   this.orderStatusList[this.switchOrderStatus(this.selected_OrderId_OrderStatus)] 
        // });
        this.orderStatusForm.patchValue({
          status:   this.selected_OrderId_OrderStatus 
        });
  
        return
      }

      const json={
        'status':e.target.value,
        "isSplitDelivery": false,
        "splitDeliveryId": ""
      }
      this.selected_OrderId_OrderStatus = e.target.value;
      this.orderServices.updateOrderStatus(json, this.selected_OrderId)
      .pipe(first())
      .subscribe((data) => {
            Swal.fire('Success', data.message, 'success');
            this.modalService.dismissAll();
            this.getOrderLists();
            this.getIndividualOrderDetails()
          },(error) => {
            // Handle error response
            console.error('Error occurred:', error);
            Swal.fire( 'Error', error.error.message, 'error');
            // You can also customize the error handling and display messages to the user
         });
    }
    /*--------------- field-------------- */

  /*--------------- products-------------- */


  getVariablePrice(i):FormArray{
    return this.productForm.get('zone')?.['controls'][i].get('variablePricings') as FormArray;
  }

  addPricingVariable(i){
    this.productForm.get('zone')?.['controls'][i].get('variablePricings').push(this.addVariablePricing());
  }
  explicitUnit(event){
    //alert(event.currentTarget.checked)
    this.isExplicit=!this.isExplicit
    this.productForm.get('isExplicitUnit')?.setValue(this.isExplicit)

  }

  change_p_pricing(event){

   if(event.currentTarget.checked){
    this.productForm.get('isAltPricing')?.setValue(false)
   }else{
    this.productForm.get('isPrimaryPricing')?.setValue(true)
   }
  }
  change_a_pricing(event){
    
     if(event.currentTarget.checked){
       this.productForm.get('isPrimaryPricing')?.setValue(false)
     }else{
      this.productForm.get('isAltPricing')?.setValue(true)
     }
  }
  checkValue(i){
       const ZoneData_ =  this.productForm.get('zone')?.value;
       var temp = ZoneData_[i];

       if(!temp.isVariablePricing){
          this.productForm.get('zone')?.['controls'][i].get('isVariablePricing').setValue(false);
          const _varPrice = this.productForm.get('zone')?.['controls'][i].get('variablePricings') as FormArray;
          while (_varPrice.length) {
            _varPrice.removeAt(0);
         }
       }else{
          this.productForm.get('zone')?.['controls'][i].get('variablePricings').push(this.addVariablePricing());
       }
  }
  

  deleteVariablePrice_(i: number, j:number) {
    this.productForm.get('zone')?.['controls'][i].get('variablePricings').removeAt(j);
    if(this.productForm.get('zone')?.['controls'][i].get('variablePricings').value.length==0){
      this.productForm.get('zone')?.['controls'][i].get('isVariablePricing').setValue(false);
    }
  }


  onUnitPriceChange(id:any){
    this.productForm.patchValue({
      altUnitPricing:['']
    });
    this.appServices.getassociatedUnit(id).subscribe((data:any) => {
      this.associatedUnit_Lists = data.data.units;
    });
    this.alterValue =null
  }

  onAltPriceChange(id:any){
    // if(id===''){
    //    this.productForm.get('isPrimaryPricing')?.setValue(true)
    //    this.productForm.get('isAltPricing')?.setValue(false)
    // }else{
    //   this.productForm.get('isPrimaryPricing')?.setValue(false)
    //   this.productForm.get('isAltPricing')?.setValue(true)
    // }

  }
  get getOptionsProducts() : FormArray {
    return this.productForm.get('options') as FormArray;
  }

 
  onProductCategoryChange(categoryID:any){
    let control = this.productForm.get('options')?.value;
    //this.productForm.controls['brandId'].setErrors({ isRequired: false });
    //this.productForm.controls['subcategoryId'].setErrors({ isRequired: false });
    for(var k=0;k<control.length;k++){
      this.getOptionsProducts.removeAt(k)
    }

    
    this.category_brandLists=[];
    const _data = this.categoryLists.filter(s => s._id === categoryID);
    this.category_brandLists = _data[0].brand;
    if(this.category_brandLists.length==0){
      //this.productForm.controls['brandId'].setErrors({ isRequired: false });
      this.productForm.patchValue({
        brandId: ''
      });
    }else{
      if(this.isProductEdit){
          this.productForm.patchValue({
            brandId: this.productTempData.product.brand._id
          });
      }
      //this.productForm.controls['brandId'].setErrors({ isRequired: true });
    }

    this.p_subCategoryLists__=[]
    this.appServices._getSingleSubCategoryLists(categoryID).subscribe((data:any) => {
      this.p_subCategoryLists__ = data.data.subcategories;
        if(  this.p_subCategoryLists__.length > 0) {
          //this.productForm.controls['subcategoryId'].setErrors({ isRequired: true });
      
          if(this.isProductEdit){
            this.edit_subCategoryID = this.productTempData.product.subcategory._id;
            this.productForm.patchValue({
              subcategoryId: this.productTempData.product.subcategory._id
            });
            this.getFieldBySubCategory()
          }
        } else {
          //this.productForm.controls['subcategoryId'].setErrors({ isRequired: false });
          this.productForm.patchValue({
            subcategoryId: ''
          });
          this.getFieldByCategory();
       }
    });
  }
  
  getFieldByCategory(){

    const cat_id = this.productForm.get('categoryId')?.value;

    this.appServices.getFieldByCategoryLists(cat_id).subscribe((data:any) => {
      let frmArray = this.productForm.get('options') as FormArray;
      frmArray.clear();

      if(data.status){
          if(data.data.isSubcategory){
            return;
          }else{
              this.fieldOptionsDataLists = [];
              this.fieldOptionsDataLists = data.data.fields;
              this.productForm.patchValue({
                   options: [this.addProductOptions()]
              });
          }
          
      }else{
      }
       
    });
  }

  onSubCategoryChange(){
    this.getFieldBySubCategory()
  }

  getFieldBySubCategory(){

    const cat_id = this.productForm.get('categoryId')?.value;
    const subCat_id = this.productForm.get('subcategoryId')?.value;
    
    this.productForm.controls['options'].reset();
    this.productForm.get('options') as FormArray;

    this.appServices.getFieldBySubCategory(cat_id,subCat_id).subscribe((data:any) => {


      let frmArray = this.productForm.get('options') as FormArray;
      frmArray.clear();

      if(data.data.fields != null){
        this.fieldOptionsDataLists =[];
        this.fieldOptionsDataLists = data.data.fields.options;
        this.productForm.patchValue({
          options:  this.addProductOptions()
        });
      }else{
        this.fieldOptionsDataLists =[];
      }
    });
  }

  get optionsProducts_() : FormArray {
    return this.productForm.get('options') as FormArray;
  }

  get zoneProductPrice() : FormArray {
    return this.productForm.get('zone') as FormArray;
  }
  get splitOrderData() {
    return this.quantityForm.get('quantityData') as FormArray;
  }
  updateDropDown(e,i){
    //console.log(e.target.value+' - - - '+i)
    const value_options =  this.productForm.get('options')?.['controls'][i].get('value').value;
    const valueLists = value_options.split(',');
    //this.selected = e.target.value
    this.productForm.get('options')?.['controls'][i].get('selectedValue').setValue(e.target.value.trim()) 
    //console.log(JSON.stringify(valueLists))
    //console.log(JSON.stringify(this.productForm.get('options')?.value))
  }
  
  updateInput(e,i){
    //console.log(e.target.value+' - - - '+i)
    this.productForm.get('options')?.['controls'][i].get('selectedValue').setValue(e.target.value.trim())

    //console.log(JSON.stringify(this.productForm.get('options')?.value))
  }
  
  addProductOptions() {
    //console.log("--field options---"+JSON.stringify(this.fieldOptionsDataLists))

    if(!this.isProductEdit){
      let control = this.productForm.get('options') as FormArray;
      for(var i=0;i<this.fieldOptionsDataLists.length;i++){
          control.push(this.formBuilder.group({
          'key':  this.fieldOptionsDataLists[i].fieldName, 
          'value': this.fieldOptionsDataLists[i].fieldValue,
          'type':  this.fieldOptionsDataLists[i].fieldType, 
          'selectedValue': this.fieldOptionsDataLists[i].fieldType=="Input"?'':this.setDropDown(this.fieldOptionsDataLists[i].fieldValue),
        }));
      }
    }else{
      let control = this.productForm.get('options') as FormArray;
      for(var i=0;i<this.fieldOptionsDataLists.length;i++){
       //console.log("--fv-- -"+this.fieldOptionsDataLists[i].fieldName +" = = = "+this.productOptionValue(this.fieldOptionsDataLists[i].fieldName))
          control.push(this.formBuilder.group({
          'key':  this.fieldOptionsDataLists[i].fieldName, 
          'value': this.fieldOptionsDataLists[i].fieldType=="Input"?this.productOptionValue(this.fieldOptionsDataLists[i].fieldName):this.fieldOptionsDataLists[i].fieldValue,
          'type':  this.fieldOptionsDataLists[i].fieldType, 
          'selectedValue': this.productOptionValue(this.fieldOptionsDataLists[i].fieldName)
        }));
      }

      //console.log("--ff-- -"+JSON.stringify(this.productForm.get('options')?.value))

      // const jsonDataOptions = this.productForm.get('options')?.value;
      // for (var k=0;k<jsonDataOptions.length;k++){
      //   this.productForm.get('options')?.patchValue({
      //      value: jsonDataOptions[k].selectedValue
      //   });
      // }
     
    }
  }
  productOptionValue(fieldName){
    //console.log("--fn-- -"+ fieldName)

    for (const key in this.productTempData.product.options) {
      if (this.productTempData.product.options.hasOwnProperty(key)) {
        const value = this.productTempData.product.options[key];
        if (key===fieldName) {
          return value
        }
      }
    }
  }

  setDropDown(dropDownLists){
    const valueLists = dropDownLists.split(',');
    return valueLists[0]
  }

  loadValue(i){
    const value_options =  this.productForm.get('options')?.['controls'][i].get('value').value;
    const valueLists = value_options.split(',').map(option => option.trim());
    // this.productForm.get('options')?.['controls'][i].get('selectedValue').setValue(valueLists[0])
    return valueLists;

  
  }

  getOptionType(i){
    const optionType =  this.productForm.get('options')?.['controls'][i].get('type').value;
    return optionType;
  }

//   onProductImageChange(event:any) {
    
//     const max_size = 1000000;d
//     const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
//     if (event.target.files && event.target.files[0]) {
//       var filesAmount = event.target.files.length;
//       for (let i = 0; i < Math.min(filesAmount, 4); i++) {
//           var reader = new FileReader();
//           reader.onload = (event:any) => {
//               this._product_Images_d.push(event.target.result); 
//               this.productForm.patchValue({
//                 fileSource: this._product_Images
//               });
//           }
//           reader.readAsDataURL(event.target.files[i]);  
//       }
//     }
//     for (var i = 0; i < event.target.files.length; i++) { 
//       this._product_Images.push(event.target.files[i]);
//     }
      
//  }

//  handleFileInput(event: any): void {
//    const files: FileList = event.target.files;
//    if(!this.isProductEdit){
//     this.selectedImages = [];
//     this._product_Images=[]
//    }

//    const maxImages = 4;
//    for (let i = 0; i < Math.min(files.length, maxImages); i++) {
//      const reader = new FileReader();
//      reader.onload = (e: any) => {
//        this.selectedImages.push(e.target.result);
//      };
//      reader.readAsDataURL(files[i]);
//    }
//     for (var i = 0; i < event.target.files.length; i++) { 
//       this._product_Images.push(event.target.files[i]);
//     }
//  }
 
//   deleteImage(index:number,url){
//     this.selectedImages.splice(index, 1);
//     this._product_Images.splice(index, 1);
//   }


trimTrailingComma(value: string): string {
  if (typeof value === 'string' && value.endsWith(',')) {
    return value.slice(0, -1); // Remove the trailing comma
  }
  return value;
}

  getFileFromUrl(imageUrl: string): void {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], `image_${Date.now()}.jpg`, { type: 'image/jpeg' });
        this.selectedFiles.push(file);
      })
      .catch(error => console.error('Error loading image:', error));
  }
  
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length + this.selectedFiles.length > 4) {
      alert('You can select up to 4 images.');
      return;
    }
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
  }

  getFileSrc(file: File): string {
    return URL.createObjectURL(file);

    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = () => {
    //   // 'result' contains the base64-encoded string
    //   return reader.result;
    // };
    // return '';
  }

  
  clearImages(): void {
    this.selectedFiles = [];
  }
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onProductsSubmit(){
    this.productOptionData_ = {};
    this.zoneProduct=[];
      
    this.is_productsSubmit = true;
    if (this.productForm.invalid) {
      return;
    }
    this.messageService.clear()

    const sgst= this.productForm.get('sgst')?.value
    const cgst= this.productForm.get('cgst')?.value

    if(sgst!==cgst || sgst==0 || cgst==0){
      this.messageService.add({
        severity: "warn",
        key: 'tr',
        detail: "SGST and CGST should be same and cannot be 0"
      });
      return;
    }

    const subCategoryID= this.productForm.get('subcategoryId')?.value
    if(this.p_subCategoryLists__.length>0 && subCategoryID==''){
      this.messageService.add({
        severity: "warn",
        key: 'tr',
        detail: "Please select the SubCategory"
      });
      return;
    }
    const brandID= this.productForm.get('brandId')?.value
    if(this.category_brandLists.length>0 && brandID==''){
      this.messageService.add({
        severity: "warn",
        key: 'tr',
        detail: "Please select the Brand"
      });
      return;
    }
    

    if(this.isExplicit){
      const toUnit =  this.productForm.get('toUnit')?.value
      const fromUnit =  this.productForm.get('fromUnit')?.value
      const toValue =  this.productForm.get('toValue')?.value

      if(fromUnit==''){
        this.messageService.add({
          severity: "warn",
          key: 'tr',
          detail: "Select the Higher Conversion Unit"
        });
        return;
      }
      if(toUnit==''){
        this.messageService.add({
          severity: "warn",
          key: 'tr',
          detail: "Select the Lower Conversion Unit"
        });
        return;
      }
      if(toValue==''){
        this.messageService.add({
          severity: "warn",
          key: 'tr',
          detail: "Enter the Conversion Value"
        });
        return;
      }
     this.unitValues ={"fromUnit":fromUnit, "toUnit":toUnit, "toValue": toValue}

    }else{
      this.unitValues={}
    
    }
    const isaltPrice =  this.productForm.get('isAltPricing')?.value
    const altUnitPricing =  this.productForm.get('altUnitPricing')?.value
    
    if(isaltPrice){
          const altUnitPricing =  this.productForm.get('altUnitPricing')?.value
          if(altUnitPricing == "" || altUnitPricing == null){
            this.messageService.add({
              severity: "warn",
              key: 'tr',
              detail: "Please Select Alternate unit Pricing"
            });
            return;
          }
    }
    

    const data_ =  this.productForm.get('options')?.value
    for(var k=0 ;k<data_.length;k++){
      if(data_[k].selectedValue=="" ||data_[k].selectedValue==null){
          this.messageService.add({
            severity: "warn",
            key: 'tr',
            detail: "Please select/enter the value for the field "+data_[k].key
          });
          return;
        }
    }
    data_.forEach(filter => {
      this.productOptionData_[filter.key] = filter.selectedValue
    })
    const ZoneData_ =  this.productForm.get('zone')?.value;



    for (let i = ZoneData_.length - 1; i >= 0; i--) {
      const jsonObj = ZoneData_[i];
    
      // Check if the specific key has an empty value
      const isEmptyValue = jsonObj['price'] === '' ||jsonObj['price'] === null;
    
      if (isEmptyValue) {
        // Remove the object if the key has an empty value
        ZoneData_.splice(i, 1);
      }
    }

    if(ZoneData_.length==0){
      this.messageService.add({
        severity: "warn",
        key: 'tr',
        detail: "Please enter the price for atlease one zone"
      });
      return;
    }

    for(var l=0;l<ZoneData_.length;l++){
      // if(ZoneData_[l].price=="" ||ZoneData_[l].price==null){
      //   this.messageService.add({
      //     severity: "warn",
      //     key: 'tr',
      //     detail: "Please enter the price for the zone "+ZoneData_[l].zoneName
      //   });
      //   return;
      // }
      if(ZoneData_[l].variablePricings.length>0){
        const data_VP= ZoneData_[l].variablePricings;
        for(var k=0 ;k<data_VP.length;k++){
          if(data_VP[k].from=="" ||data_VP[k].from==null){
            this.messageService.add({
              severity: "warn",
              key: 'tr',
              detail: "Please enter the variable from value for the zone  "+ZoneData_[l].zoneName
            });
            return;
          }
          if(data_VP[k].to==""||data_VP[k].to==null){
            this.messageService.add({
              severity: "warn",
              key: 'tr',
              detail: "Please enter the variable to value for the zone  "+ZoneData_[l].zoneName
            });
            return;
          }
          if(data_VP[k].price==null||data_VP[k].price==""){
            this.messageService.add({
              severity: "warn",
              key: 'tr',
              detail: "Please enter the variable price value for the zone  "+ZoneData_[l].zoneName
            });
            return;
          }
        }
      }
    }

    for(var i=0; i<ZoneData_.length;i++) {
      var temp = ZoneData_[i];
      let tempZone = {
        zoneId:temp.zoneId,
        price:temp.price,
        isVariablePricing:temp.isVariablePricing,
        variablePricings:JSON.parse(JSON.stringify(temp.variablePricings))
      };   

      this.zoneProduct.push(tempZone);
    }

    
    if(this.selectedFiles.length==0){
      this.messageService.add({
        severity: "warn",
        key: 'tr',
        detail: "Products Images are missing"
      });
      return;
    }


      const formDataNew = new FormData();   
      [...this.selectedFiles].forEach((file) => {
        formDataNew.append("image", file, file.name);
      });
      formDataNew.append('productName', this.productForm.get('productName')?.value.trim());
      formDataNew.append('categoryId', this.productForm.get('categoryId')?.value);
      formDataNew.append('subcategoryId', this.productForm.get('subcategoryId')?.value);
      formDataNew.append('brandId', this.productForm.get('brandId')?.value);
      formDataNew.append('description', this.productForm.get('description')?.value);
      formDataNew.append('cgst', this.productForm.get('cgst')?.value);
      formDataNew.append('sgst', this.productForm.get('sgst')?.value);
      formDataNew.append('hsn', this.productForm.get('hsn')?.value);
      formDataNew.append('isPrimaryPricing', this.productForm.get('isPrimaryPricing')?.value);
      formDataNew.append('isExplicitUnit', this.productForm.get('isExplicitUnit')?.value);
      formDataNew.append('isAltPricing', this.productForm.get('isAltPricing')?.value);
      formDataNew.append('mrp', this.productForm.get('mrp')?.value);
      formDataNew.append('perUnitPricing', this.productForm.get('perUnitPricing')?.value);
      formDataNew.append('altUnitPricing', this.productForm.get('altUnitPricing')?.value===null?'': this.productForm.get('altUnitPricing')?.value);
      formDataNew.append('minimumOrderQty', this.productForm.get('minimumOrderQty')?.value);
      formDataNew.append('zone', JSON.stringify(this.zoneProduct));
      formDataNew.append('explicitUnit',JSON.stringify(this.unitValues));
      formDataNew.append('deliveryTime',this.productForm.get('deliveryTime')?.value);
      formDataNew.append('options',  JSON.stringify(this.productOptionData_).replaceAll("\\", ""));
      
      // for(let keyValuePair of formDataNew.entries()){
      //   console.log(keyValuePair); 
      // }
      let jsonObject = {};
      formDataNew.forEach((value, key) => {
        jsonObject[key] = value;
      });
      let jsonString = JSON.stringify(jsonObject);
      console.log(" = = "+jsonString);
      // for(let keyValuePair of formDataNew.entries()){
      //   console.log(keyValuePair); 
      // }

      
      if(!this.isProductEdit){
        this.appServices.addProducts(formDataNew)
          .pipe(first())
          .subscribe({
              next: (data) => {
    
                this.getProductLists();
             
                this.formReset();
                this.isAddProduct= false;
                Swal.fire({
                  title: 'Success',
                  text:  data.message,
                  icon: "success",
                  timer:1000
                });

                this.clearProductFilter()
               },
              error: error => {
                  this.error = error;
                  Swal.fire("Error!",error.error.message,  "error")   
              }
          });

      }else{
        
        if(this.temp_productID=="")return;
        this.appServices.updateProduct(this.temp_productID, formDataNew).subscribe((data: any) => {
          if(data.status){
            this.isAddProduct= false;
            this.getProductLists();
            this.formReset();
            Swal.fire({
              title: 'Success',
              text:  'Product updated Successfully!',
              icon: "success",
              timer:1000
            });
          }else{
            Swal.fire("Oops...", "Something went wrong!", "error");
          }
        });
      }
}


deleteProduct(data:any){

  Swal.fire({
    text: 'Are you sure you want to delete the product '+ data.product.productName,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Yes, go ahead.',
    cancelButtonText: 'No, let me think',
  }).then((result) => {
    if (result.value) {

      this.appServices.deleteProduct(data._id).subscribe((data: any) => {
        if(data.status){
          Swal.fire('Removed!', 'Product removed successfully.', 'success');
          this.modalService.dismissAll();
          this.getProductLists();
          this.formReset();
        }else{
          Swal.fire("Oops...", "Error! Please try again", "error");
        }
      },(error) => {
        // Handle error response
        Swal.fire( 'Error', error.message, 'error');
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
    }
  });

}

isProductAdd(){
  this.formReset();
  this.addProduct();
  this.isAddProduct =!this.isAddProduct;

}


addProduct(){
  this.formReset();
  let control = this.productForm.get('zone') as FormArray;
  for(var i=0;i<this.zoneDataLists.length;i++){
      control.push(this.formBuilder.group({
      'zoneName':  this.zoneDataLists[i].zoneName,
      'zoneId': this.zoneDataLists[i]._id,
      'price':['', []],
      'isVariablePricing':[false],
      'variablePricings':this.formBuilder.array([])
    }));
  }
}
addVariablePricing(): FormGroup {
  return this.formBuilder.group({
    from:['', []],
    to:['', []],
    price:['', []],
  });
}
editProduct(data:any){
  //console.log(JSON.stringify(data))
    this.isExplicit = false;
    this.formReset();
    this.modalService.dismissAll();
    this.productTempData = data;

   // console.log("---"+JSON.stringify(this.productTempData))

    this.productForm.controls['zone'].reset();

    var _zoneDataList = this.zoneDataLists

    let control = this.productForm.get('zone') as FormArray;
    for(var i=0;i<this.productTempData.zones.length;i++){
        control.push(this.formBuilder.group({
        'zoneName':  this.productTempData.zones[i].zone.zoneName,
        'zoneId': this.productTempData.zones[i].zone._id,
        'price':this.productTempData.zones[i].price,
        'isVariablePricing':this.productTempData.zones[i].isVariablePricing,
        'variablePricings':this.formBuilder.array([])
      }));
    }

    let control_ = this.productForm.get('zone') as FormArray;
    _zoneDataList.forEach(item1 => {
      if (!this.productTempData.zones.some(item2 => item1['_id'] === item2.zone['_id'])) {
                 control_.push(this.formBuilder.group({
                'zoneName':  item1.zoneName,
                'zoneId':item1._id,
                'price':"",
                'isVariablePricing':false,
                'variablePricings':this.formBuilder.array([])
              }));
      }
    });




    for(var i=0;i<this.productTempData.zones.length;i++){
      for(var k =0;k<this.productTempData.zones[i].variablePricings.length;k++){
        const control_varPrice = this.productForm.get('zone')?.['controls'][i].get('variablePricings') as FormArray;
        control_varPrice.push(this.formBuilder.group({
          'from': this.productTempData.zones[i].variablePricings[k].from,
          'to': this.productTempData.zones[i].variablePricings[k].to,
          'price': this.productTempData.zones[i].variablePricings[k].price,
        }));
      }
    }


    this._product_Images=[]
    for (const imageUrl of this.productTempData.product.image) {
      this.getFileFromUrl(imageUrl);
    }


    this.isProductEdit = true;

    this.temp_productID= data._id;
    this.edit_categoryID = data.product.category._id;
    this.onProductCategoryChange(data.product.category._id)
    this.onUnitPriceChange(data.product.perUnitPricing)
    this.productForm.patchValue({
      hsn:data.product.hsn,
      productName: data.product.productName,
      categoryId: data.product.category._id,
      description: data.product.description,
      cgst:data.product.cgst,
      sgst:data.product.cgst,
      mrp:data.product.mrp,
      minimumOrderQty:data.product.minimumOrderQty,
      isPrimaryPricing:data.product.isPrimaryPricing,
      isAltPricing:data.product.isAltPricing,
      perUnitPricing:data.product.perUnitPricing,
      altUnitPricing:data.product.altUnitPricing,

    });
    this.isAddProduct = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });


}


getProductLists(){
  this.isLoading = true
  this.appServices.getProductLists().subscribe((data: {}) => {
        

        this.productDataLists=[];
        this.filter_productDataLists=[];
        this.productData = data;
        this.productDataLists = this.productData.data.products;
        this.filter_productDataLists = this.productDataLists;
        //this.filter_productDataLists = this.filter_productDataLists.filter(item => item._id==="6526397432543e0703093f2e");

  });
}


getDashboardCount(){
  this.isLoading = true
  this.appServices.getDashboardCount().subscribe((data_: any) => {
        
        this.dashboardData = data_.data;
   
  });

}
  /*--------------- products-------------- */

  /*----------------------------------- Users----------------------------------- */

  
  getUserLists(){
    this.isLoading = true
    this.appServices.getUserLists().subscribe((data: {}) => {

        
        this.userData = data;
        this.userLists = this.userData.data.users;
     
    });
  
  }
  approveUser(jsonData:any){
       const _data ={
         "status":'Active'
      }
      this.appServices.updateUser(jsonData._id,_data).subscribe((data: any) => {
        if(data.status){
          Swal.fire('Updated!', 'User updated successfully.', 'success');
          this.getUserLists()
          this.modalService.dismissAll()
        }else{
          Swal.fire("Oops...", "Error! Please try again", "error");
        }
   
      });
  }
  userUpdate(data:any){
    var userName =data.username;
    var status_text = data.status==='Active'?'Disabled':'Inactive'
    const _data ={
        "status":status_text
    }

    Swal.fire({
      text: 'Are you sure you want to ' +status_text+ ' the user '+ userName +'?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then((result) => {
      if (result.value) {
        this.appServices.updateUser(data._id,_data).subscribe((data: any) => {
          if(data.status){
            Swal.fire('Updated!', 'User updated successfully', 'success');
            this.getUserLists();
            this.isUserDetails_View=false
            this.modalService.dismissAll()
          }else{
            Swal.fire("Oops...", "Error! Please try again", "error");
          }
       
        });
    
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });




  }
  deleteUser(data:any){
    var userName =data.username;
    Swal.fire({
      text: 'Are you sure you want to delete the user"'+userName+'"?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then((result) => {
      if (result.value) {
        this.appServices.deleteUser(data._id).subscribe((data: any) => {
          if(data.status){
            Swal.fire('Removed!', '"'+userName+'" User removed successfully.', 'success');
            this.getUserLists();
            this.isUserDetails_View=false
            this.modalService.dismissAll()
          }else{
            Swal.fire("Oops...", "Error! Please try again", "error");
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  logout(){
    Swal.fire({
      text: 'Are you sure you want to logout?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then((result) => {
      if (result.value) {
        this.authenticationService.logout(1);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  
  onFileImportChange(evt: any) {
    this.nModule = 1;

    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {

      const bstr: string = e.target.result;
      const data = <any[]>this.excelSrv.importFromFile(bstr);

      const header: string[] = Object.getOwnPropertyNames(new ExcelProducts());
      const importedData = data.slice(1, -1);

      this.importProducts = importedData.map(arr => {
        const obj = {};
        for (let i = 0; i < header.length; i++) {
          const k = header[i];
          obj[k] = arr[i];
        }
        return <ExcelProducts>obj;
      })
      // this.loadInstoreForDisplay();

      this.fileInput.nativeElement.value = "";
    };
    reader.readAsBinaryString(target.files[0]);

  }
  /*----------------------------------- Users----------------------------------- */

  downloadSplitInvoice(splitDeliveryId){
    this.appServices.downloadsplitInvoice(this.selected_OrderId,splitDeliveryId)
    .subscribe(
      (data: Blob) => {
        var file = new Blob([data], { type: 'application/pdf' })
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL); 
        var a         = document.createElement('a');
        a.href        = fileURL; 
        a.target      = '_blank';
        a.download    = this.selected_OrderId+'.pdf';
        document.body.appendChild(a);
        a.click();
      },
      (error) => {
        Swal.fire( 'Error', error.error.message, 'error');
      }
    );
  }

  downloadInvoice()  {
    this.appServices.downloadInvoice(this.selected_OrderId)
    .subscribe(
      (data: Blob) => {
        var file = new Blob([data], { type: 'application/pdf' })
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL); 
        var a         = document.createElement('a');
        a.href        = fileURL; 
        a.target      = '_blank';
        a.download    = this.selected_OrderId+'.pdf';
        document.body.appendChild(a);
        a.click();
      },
      (error) => {
        Swal.fire( 'Error', error.error.message, 'error');
      }
    );
  }
  downloadContent(url: string) {
    saveAs( url, this.selected_OrderId)
  }


  


    submitText() {
      if(this.nModule == 1) {
        return "Validate";
      } else {
        return "Upload";
      }
    }
    
    submitButtonClicked() {
      if(this.nModule == 1) {
      } else {
      // this.uploadInstore(modalID);
      }
    }

    formReset(){

      this.isExplicit = false;

      
      this.is_brandSubmit = false;
      this.is_categorySubmit = false;
      this.is_subCategorySubmit = false;
      this.is_zoneSubmit = false;
      this.is_fieldSubmit = false;
      this.is_productsSubmit = false;
      this.is_unitSubmit = false;
      this.is_c_unitSubmit = false;
      this.isProductEdit= false;
      this.selectedFiles=[];
      this.clearImages();

      this.src_BrandImg = "";
      this.imageSrc_Category = "";
      this.imageSrc_Product = "";

      this.brandForm.reset();
      this.categoryForm.reset();
      this.subCategoryForm.reset();
      this.zoneForm.reset();
      this.fieldForm.reset();
      this.productForm.reset();
      this.simpleUnitForm.reset();
      this.compoundUnitForm.reset();
      this.formProductFilter.reset();
      
      this.isBrandEdit = false;
      this.isCategoryEdit = false;
      this.isSubCategoryEdit = false;
      this.isZoneEdit = false;
      this.isFieldEdit = false;
      this.isSimpleUnitEdit = false;
      this.isCompoundUnitEdit = false

  
      this.temp_brandID=""
      this.temp_categoryID=""
      this.temp_subCategoryID=""
      this.temp_zoneID=""
      this.temp_fieldID=""
      this.temp_productID=""
      this.temp_sUnit_id=""
      this.temp_cUnit_id=""
      

      this._view_brandImg.nativeElement.value = "";
      this._view_categoryImg.nativeElement.value = "";
      //this._view_productImg.nativeElement.value = "";


      this.fieldForm = this.formBuilder.group({
        categoryId: ['', [Validators.required]],
        subcategoryId: [''],
        options: this.formBuilder.array([this.initOptionRows()])
      });
      
      this.subCategoryForm = this.formBuilder.group({
        categoryId: ['', [Validators.required]],
        subCategoryName: ['',[Validators.required]] ,
      });
      
      this.simpleUnitForm = this.formBuilder.group({
        formatName: ['', [Validators.required]],
        formatSymbol: ['', [Validators.required]],
        symbolToBeDisplayed: ['', [ Validators.required]],
        decimalPoint: [this._decimalPoint, [ Validators.required]],
      });

      this.productForm = this.formBuilder.group({
        categoryId: ['', [Validators.required]],
        subcategoryId: [''],
        brandId: [''],
        altUnitPricing:[''],
        isPrimaryPricing: [true, Validators.required],
        isAltPricing: [false, Validators.required],
        isExplicitUnit: [false],
        productName: ['', [Validators.required]],
        description: ['', [ Validators.required]],
        mrp: ['', [ Validators.required]],
        hsn: ['', [ Validators.required]],
        minimumOrderQty: ['', [ Validators.required]],
        perUnitPricing: ['', [ Validators.required]],
        sgst: ['', [ Validators.required]],
        cgst:['', [ Validators.required]],
        deliveryTime:[this.deliveryTime[0], [ Validators.required]],
        zone: this.formBuilder.array([]),
        productImage:  [''],
        options: this.formBuilder.array([]),
        fromUnit: [''],
        toUnit: [''],
        toValue: [''],
      });
      this.compoundUnitForm = this.formBuilder.group({
        fromUnit: ['', [Validators.required]],
        toUnit: ['', [Validators.required]],
        toValue: ['', [ Validators.required]],
      });

      
    }
    onInvoiceSubmit(){
      this.isInvoiceSubmit = true;
      if (this.eInvoiceForm.invalid) {
        return;
      }
      var jsonData = 
        {
          "vehicleNumber" : this.eInvoiceForm.get('vehicleNumber')?.value.trim(),
          "transportDocNumber": this.eInvoiceForm.get('transportDocNumber')?.value.trim(),
          "driverName": this.eInvoiceForm.get('driverName')?.value.trim(),
          "driverContact": this.eInvoiceForm.get('driverContact')?.value,
          "transportationDistance": 0,
          "isSplitDelivery":this.isSplitDelivery,
          "splitDeliveryId": this.isSplitDelivery?this.selected_splitDeliveryID:''
      }

    // console.log(this.selected_OrderId+"==="+JSON.stringify(jsonData))

      this.orderServices.eInvoice(jsonData, this.selected_OrderId)
      .pipe(first())
      .subscribe((data) => {
       // console.log(this.selected_OrderId+"==="+JSON.stringify(data))

            if(data.status){
              const einvoiceUrl = data.data.einvoiceUrl;
              const eWayBillUrl = data.data.eWayBillUrl
              
              Swal.fire( 'Success', data.message, 'success');
             
              //console.log(einvoiceUrl+" - - - "+eWayBillUrl)
              if(einvoiceUrl!=""){
                saveAs(einvoiceUrl,"E-Invoice"+this.selected_OrderId)
                // this.pdfService.downloadPdf(einvoiceUrl).subscribe(
                //   (blob: Blob) => {
                //     this.pdfService.savePdf(blob, "eInvoice_"+this.selected_OrderId);
                //   },
                //   (error) => {
                //     console.error('Error downloading PDF', error);
                //   }
                // );
              }
               if(eWayBillUrl!=""){
                 saveAs(eWayBillUrl,"eWayBillUrl_"+this.selected_OrderId)
              }
              this.modalService.dismissAll();
              this.getIndividualOrderDetails()
              //this.getOrderLists();

            }else{
              // console.log(JSON.stringify(data))
              Swal.fire( 'Error', data.message, 'error');
              this.modalService.dismissAll();
            }
         
          },(error) => {
            // Handle error response
            console.error('Error occurred:', error);
            Swal.fire( 'Error', error.error.message, 'error');
            // You can also customize the error handling and display messages to the user
          }
      );  
    }
    showUserDetails(content,data:any){
      this.isUserDetails_View = true;
      this._userDetails= data;
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size:'xl'}).result.then((result) => {
      }, (reason) => {
      });
    }
    showProductDetails(content,data:any){
      this._s_product_info = data;
      this._selected_image = this._s_product_info.product.image[0];

      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size:'xl'}).result.then((result) => {
      }, (reason) => {
      });
    }
    
    expandedItem: any = null;
  
    showOrderDetails(data:any){

      this._orderDetails=[]
      this._order_to_be_Delivered=[]

      this.isQtyAvailable = false;
      this.isOrderDetails_View = true;
      this.e_invoice = false;
      this._data_OrderInfo = data;
      this.selected_OrderId_OrderStatus = data.status;
      if(this.selected_OrderId == data.orderId){
        this.selected_OrderId = '';
      }else{
        this.selected_OrderId = data.orderId ;
      }


      this.orderStatusForm.patchValue({
        status:   data.status
      });
      this.isQtyAvailable = false

      this.getIndividualOrderDetails()
    }
    getIndividualOrderDetails(){
      this.orderServices.getOrderDetails(this.selected_OrderId)
      .pipe(first())
      .subscribe({
          next: (data) => {
            console.log("---"+JSON.stringify(data.data))
            this._singleOrderInfo=[];
            this._singleOrderInfo = data.data.orderInfo[0];

            if(this._singleOrderInfo._id.isSplitDelivery){
              this._splitDeliveryDetails= this._singleOrderInfo.splitDeliveryDetails;
              this.isSplitDelivery = true
            }else{
              this.isSplitDelivery= false
            }
            this._orderDetails= this._singleOrderInfo.products;
            
            for(var k=0;k<this._orderDetails.length;k++){
              if(this._orderDetails[k].availableQuantity==0){
                this.isQtyAvailable = false
              }else{
                this.isQtyAvailable= true;
                break;
              }
            }
            this._order_to_be_Delivered = this._orderDetails.filter(item => item.availableQuantity>0);
            let frmArray = this.quantityForm.get('quantityData') as FormArray;
            frmArray.clear();
            
            let control = this.quantityForm.get('quantityData') as FormArray;
              for(var i=0;i<this._order_to_be_Delivered.length;i++){
                  control.push(this.formBuilder.group({
                  'productId':  this._order_to_be_Delivered[i].productDetails._id, 
                  'product_Name':  this._order_to_be_Delivered[i].productDetails.productName, 
                  'uid': this._order_to_be_Delivered[i].uid,
                  'quantity':  this._order_to_be_Delivered[i].quantity, 
                  'availableQuantity':  this._order_to_be_Delivered[i].availableQuantity,
                  'splitQuantity':  this._order_to_be_Delivered[i].availableQuantity,
                }));
              }
            this._orderPriceDetails= this._singleOrderInfo._id;
            window.scrollTo(0,document.body.scrollHeight)
        },
          error: error => {
              this.error = error;
          }
      });
    }



    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return  `with: ${reason}`;
      }
    }
    exportexcel(){
      for(var i=0; i<this.orderLists.length;i++) {
        var tempImport = this.orderLists[i];
        let _temp_Orders = {
          'S.NO':i+1,
          'ORDER ID':tempImport.orderId,
          'ORDERED DATE':this.datePipe.transform(tempImport.orderedDate, 'dd-MMM-yyyy hh:mm a'),
          'TRADE NAME':tempImport.user.tradeName,
          'TOTAL PRICE (with GST)':tempImport.totalPriceWithGST,
          'TOTAL PRICE (wIthout GST)':tempImport.totalPriceWithoutGST,
          'EMAIL':tempImport.user.email,
          'MOBILE NO':tempImport.user.mobileNo,
          'ADDRESS LINE 1':tempImport.deliveryAddress.addressLine1,
          'ADDRESS LINE 2':tempImport.deliveryAddress.addressLine2,
          'CITY':tempImport.deliveryAddress.city,
          'STATE':tempImport.deliveryAddress.state,
          'PINCODE':tempImport.deliveryAddress.pincode,
          'STATUS':tempImport.status
        };   
        this._excel_ordersList.push(_temp_Orders);
      }
      this.excelSrv.exportAsExcelFile( this._excel_ordersList, 'Orders');
    }

    userexcel(){
      for(var i=0; i<this.userLists.length;i++) {
        var tempImport = this.userLists[i];
        let _temp_Users = {
          'S.NO':i+1,
          'USER NAME':tempImport.username,
          'TRADE NAME':tempImport.tradeName,
          'EMAIL':tempImport.email,
          'MOBILE NO':tempImport.mobileNo,
          'TRADE LICENSE NO':tempImport.tradeLicenseNo,
          'BILLING ADDRESS':tempImport.addressLine1+", "+tempImport.addressLine2+", "+tempImport.city+", "+tempImport.state+"-"+tempImport.pincode,
          'STATUS':tempImport.status,
          'CREATED DATE':this.datePipe.transform(tempImport.createdDate, 'dd-MMM-yyyy hh:mm a')
        };   
        this._excel_ordersList.push(_temp_Users);
      }
      this.excelSrv.exportAsExcelFile( this._excel_ordersList, 'Users');
    }
    productExportExcel(){
      for(var i=0; i<this.productDataLists.length;i++) {
        var tempImport = this.productDataLists[i];
        let _temp_Users = {
          'S.NO':i+1,
          'PRODUCT':tempImport.product.productName,
          'CATEGORY':tempImport.product.category.categoryName,
          'SUB CATEGORY':tempImport.product.subcategory?.subcategoryName,
          'BRAND NAME':tempImport.product.brand?.brandName,
          'DESCRIPTION':tempImport.product.description,
          'SGST':tempImport.product.sgst,
          'CGST':tempImport.product.cgst,
          'MRP':tempImport.product.mrp,
          'MINIMUM ORDER QUANTITY':tempImport.product.minimumOrderQty,

        };   
        this._excel_ordersList.push(_temp_Users);
      }
      this.excelSrv.exportAsExcelFile( this._excel_ordersList, 'PRODUCTS');
    }
  /*--------------- products-------------- */
  dateStart(event) {
    if(event.value){
      this._order_start_date =  moment(event.value).format(this.format);
      //this._order_start_date =  this.datePipe.transform((event.value),'dd-MM-yyyy')
    } else {
      this._order_start_date = "";
    }
    this.filterOrders()
  } 

  dateEnd(event) {
    if(event.value){
      this._order_end_date =  moment(event.value).format(this.format);
      //this._order_start_date =  this.datePipe.transform((event.value),'dd-MM-yyyy')
    } else {
      this._order_end_date = "";
    }
    this.filterOrders()
  }


    omit_special_char(event:any) {   
      var k;  
      k = event.charCode;  //         k = event.keyCode;  (Both can be used)
      return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
    }

    switchResult(a){
      switch(a){
          case "DropDown": return 0;
          case "Input": return 1;
          case "CheckBox": return 2;
          default: return 0;      
      }
    }

    switchOrderStatus(a){
      switch(a){
          case "Delivered": return 0;
          // case "Partial Delivered": return 1;
          case "Dispatched": return 1;
          case "Transit": return 2;
          case "In Process": return 3;  
          case "Cancelled": return 4;
          default: return 3;      
      }
    }

  // switchResult_(a){
  //   switch(a){
  //       case 0: return "DropDown";
  //       case 1: return "Input";
  //       case 2: return "CheckBox";
  //       default: return "DropDown";      
  //   }
  // }
  isEmpty(data:any){
    return Object.keys(data).length
  }
  showImage(url){
    this._selected_image = url;
  }
  getOrderLists(){
    
    this.appServices.getOrderLists().subscribe((data:any) => {
          this.orderLists = data.data.orders;
          this.filterOrderLists = this.orderLists
          //console.log("-filterOrderLists-"+JSON.stringify(this.filterOrderLists))
    });
  }
  clearFilter(){
    this.selectedOrderStatus=[]
    this.filterOrderLists = this.orderLists;
    this.formOrderFilter.reset();
  }
  clearProductFilter(){
    this.pf_selectedBrandLists=[];
    this.pf_selectedCategoryID=""
    this.pf_selectedSubCategoryID=""
    
    this.formProductFilter = this.formBuilder.group({
      categoryId:  ['']  ,
      subcategoryId:  ['']  ,
      brandId:  [''] ,
      text:  ['']  
   })
    this.filter_productDataLists =[]
    this.filter_productDataLists = this.productDataLists;
        

  }

  filterOrders(){
    var globalList;
    var startDate = true;
    var endDate = true;
    this.filterOrderLists = this.orderLists;

          this.filterOrderLists =  this.filterOrderLists.filter((item) => {
          let orderDate = moment(item.orderedDate).format(this.format)
          // if(this._order_start_date != "" && this._order_end_date==""){
          //   startDate = ( orderDate === this._order_start_date);
          // }
          if(this._order_start_date != "") {
            startDate = ( orderDate >= this._order_start_date);
          } 
          if(this._order_end_date != "") {
            endDate = (orderDate<= this._order_end_date);
          }
          // console.log(orderDate+"--"+moment(orderDate).format(this.format) +" - - "+this._order_start_date)
          // console.log(startDate+" - - - -"+startDate)

        return startDate&&endDate;
      })

      if(this.selectedOrderStatus.length>0){
        this.filterOrderLists = [
          ...this.filterOrderLists.filter(x => this.selectedOrderStatus.includes(x.status))
        ];
      }
    
  }
  onChange(event){
    this.filterOrders()
  }
  onproductFilterCategoryChange(categoryID){
    this.pf_selectedCategoryID = categoryID
    this.pf_selectedBrandLists=[];
    this.filterProducts();
  }
  onChangeBrand(event:any){
    this.filterProducts();
  }

  filterProducts(){
    
    this.pf_category_brandLists=[]
    this.filter_productDataLists = this.productDataLists;
    const _data = this.categoryLists.filter(s => s._id ===   this.pf_selectedCategoryID );
    this.pf_category_brandLists = _data[0].brand;

    //alert("----"+JSON.stringify(_data))
    this.category_subCategoryLists = this.subCategoryLists.filter(s => s.category._id ===   this.pf_selectedCategoryID );
    this.filter_productDataLists = [
      ...this.filter_productDataLists.filter(x => this.pf_selectedCategoryID.includes(x.product.category._id))
    ];
    if(this.pf_selectedSubCategoryID!=""){
      this.filter_productDataLists = [
        ...this.filter_productDataLists.filter(x => this.pf_selectedSubCategoryID.includes(x.product.subcategory._id))
      ];
    }

    if(this.pf_selectedBrandLists.length>0){
      var brandIds: any[] = [];
      for (let i = 0; i < this.pf_selectedBrandLists.length; i++) {
        brandIds.push(this.pf_selectedBrandLists[i]._id)
      }
      this.filter_productDataLists = [
        ...this.filter_productDataLists.filter(x => brandIds.includes(x.product.brand._id))
      ];
    }
  }


  onproductFilterSubCategoryChange(subcategoryID){
    this.pf_selectedSubCategoryID = subcategoryID;
    this.filterProducts();
  }
  getUnitName(id){
    for (let i = 0; i <  this.s_units_DataLists.length; i++) {
      if( this.s_units_DataLists[i]._id===id){
        return (this.s_units_DataLists[i].formatName+" ("+this.s_units_DataLists[i].formatSymbol+")");
      }
    }
  }

  sortData(sort: Sort) {
    const data = this.filterOrderLists.slice();
    if (!sort.active || sort.direction === '') {
      this.filterOrderLists = data;
      return;
    }

      this.filterOrderLists = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'tradeName':
            return compare(a.tradeName, b.tradeName, isAsc);
          case 'totalPriceWithGST':
            return compare(a.totalPriceWithGST, b.totalPriceWithGST, isAsc);
          case 'totalPriceWithoutGST':
            return compare(a.totalPriceWithoutGST, b.totalPriceWithoutGST, isAsc);
          case 'orderedDate':
            return compare(a.orderedDate, b.orderedDate, isAsc);
          case 'status':
              return compare(a.status, b.status, isAsc);
          default:
            return 0;
        }
      });
  }
  splitOrder(){
    this.e_invoice=!this.e_invoice
  }
  placeSplitOrder(){
    this.is_quantitySubmit = true;
    const quantityData =  this.quantityForm.get('quantityData')?.value;
    for(var i=0;i<quantityData.length;i++){
      if(quantityData[i].splitQuantity== null){
        this.messageService.add({
          severity: "warn",
          key: 'tr',
          detail: "Split Quantity should not be empty"
        });
      }
      if(quantityData[i].splitQuantity > quantityData[i].availableQuantity){
          this.messageService.add({
            severity: "warn",
            key: 'tr',
            detail: "Quantity to be delivered exceeds the Available Quantity"
          });
        return;
      }
      if(quantityData[i].splitQuantity == 0 ){
         quantityData.splice(i,1);
      }
    }
    
    if (quantityData.length==0) {
      Swal.fire({
        text: "Invalid Quantity ! You cannot place the order",
        icon: "error",
        timer: 1500
      });
      return
    }
  
    const products:any[] = [];
    for(var i=0;i<quantityData.length;i++){
      const data_ = {
        "uid": quantityData[i].uid,
        "productId": quantityData[i].productId,
        "quantity": quantityData[i].splitQuantity,
      };
      products.push(data_)
    }
    var jsonData = {
      "products": products
    }


    //console.log(JSON.stringify(jsonData))
    this.orderServices.splitOrder(jsonData, this.selected_OrderId)
    .pipe(first())
    .subscribe({
        next: (data) => {
          Swal.fire('Success', data.message, 'success');
          this.modalService.dismissAll();
          this.getOrderLists();
          this.selected_OrderId ="0"
          this.e_invoice=!this.e_invoice
          this.isOrderDetails_View = false;

        },
        error: error => {
            this.error = error;
        }
    });  
  }
  generateEInvoice(status,splitDeliveryID, content){
      this.selected_splitDeliveryID = splitDeliveryID;
      this.eInvoiceForm.reset()
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size:'xl'}).result.then((result) => {
      }, (reason) => {
      });

  }

  openBrands(content,categoryName,brandLists){
    this._m_brandDetails = brandLists;
    this.temp_m_category= categoryName;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size:'md'}).result.then((result) => {
      }, (reason) => {
      });

  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

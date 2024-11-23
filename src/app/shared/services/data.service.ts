export interface Brand {
    state: boolean;
    message: string;
}
export interface Root {
    status: boolean
    data: Data
}

export interface Data {
    brands: Brand[]
}

export interface Brand {
    brandImg: string
    _id: string
    brandName: string
}




export interface Data {
    users: User[]
  }
  
  export interface User {
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


export class ExcelProducts {
    region: string = "";
    showroom: string = "";
    floor: string = "";
    location: string = "";
    assets: string = "";
    creative: string = "";
    particulars: string = "";
    size_w: string= "";
    size_h: string = "";
    name:string = "";
    vendor: string = "";
    installation_date: string="";
    expiry_date:string= "";
    image:string="";

}export class Products { 
    region: string = "";
    showroom: string = "";
    floor: string = "";
    location: string = "";
    asset_type: string = "";
    creative: string = "";
    particulars: string = "";
    vendor: string = "";
    name:string = "";
    size_w: string= "";
    size_h: string = "";
    install_date: string="";
    uploaded_date?: string="";
    expiry_date:string= "";
    region_id?: string = "";
    showroom_id?: string = "";
    location_id?: string= "";
    floor_id?: string= "";
    asset_type_id?: string= "";
    creative_id?: string= "";
    vendor_id?: string= "";
    image?:string="";
    id?: string= "";
}
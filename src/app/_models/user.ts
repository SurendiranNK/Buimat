import { Role } from "./role";

export class Login_ {
  status: boolean
  data: DataLogin
}

export class DataLogin {
  user: UserLogin
  token: string
}

export class UserLogin {
  email: string
  role: Role
  mobileNo: string
  tradeLicenseNo: string
  gstNo: string
  addressLine1: string
  addressLine2: string
  city: string
  pincode: string
  state: string
}

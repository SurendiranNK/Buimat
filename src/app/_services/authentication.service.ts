import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment'
import { Login_ } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<Login_| null>;
    public user: Observable<Login_| null>;
    roleAs = ""
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(jsonData:any) {

        if(!jsonData.remember){
            localStorage.removeItem('adminInfo');
        }
        return this.http.post<any>(`${environment.apiBaseUrl}/users/admin`,jsonData)
            .pipe(map(data => {
                if(data.status){
                    //console.log(" - - - -  -"+JSON.stringify(data))
                    localStorage.setItem('user', JSON.stringify(data));
                    localStorage.setItem("token", data.data.token)
                    localStorage.setItem("role",  data.data.user.role)
                    localStorage.setItem("adminInfo", JSON.stringify(jsonData))
                    this.userSubject.next(data);
                }
                return data;
         }));

    }

    userLogin(jsonData:any){
        if(!jsonData.remember){
            localStorage.removeItem('adminInfo');
        }
        return this.http.post<any>(`${environment.apiBaseUrl}/users/vendor`,jsonData)
            .pipe(map(data => {
                if(data.status){
                    localStorage.setItem('userInfo', JSON.stringify(data.data.user));
                    localStorage.setItem("token",data.data.token)
                    localStorage.setItem("role",data.data.user.role)
                }
                return data;
         }));
    }
    logout(type:number) {
        localStorage.clear();
        this.userSubject.next(null);
        this.user = this.userSubject.asObservable();
        if(type==1){
            this.router.navigate(['/login']);
        }else{
            this.router.navigate(['/mobile-verification']);
        }
    }

    sendOTP(jsonData:any) {
        return this.http.post<any>(`${environment.apiBaseUrl}/otp/send`,jsonData)
            .pipe(map(data => {
                if(data.status){
                    
                }
                return data;
         }));
    }

    
    resendEmail(jsonData:any) {
        return this.http.post<any>(`${environment.apiBaseUrl}/users/resendVerifyEmail`,jsonData)
            .pipe(map(data => {
                if(data.status){
                    
                }
                return data;
         }));
    }
    public get getRole(){
        this.roleAs = localStorage.getItem('role')!;
        return this.roleAs;
    }
    verifyOTP(jsonData:any) {
        return this.http.post<RootVerifyOTP>(`${environment.apiBaseUrl}/otp/verifyWeb`,jsonData)
            .pipe(map(data => {
                if(data.status){
                    localStorage.removeItem('mobileNo');
                    localStorage.setItem("mobileNo",jsonData.mobileNo)
                    localStorage.setItem("cities", JSON.stringify(data.data.cities))

                }
                return data;
         }));
    }
    register(form:any) {
        return this.http.post<any>(`${environment.apiBaseUrl}/users/register?staging=1`,form)
            .pipe(map(data => {
                if(data.status){
                }
                return data;
         }));
    }

    changePassword(data_:any) {
        return this.http.put<any>(`${environment.apiBaseUrl}/users/changePassword`,data_)
            .pipe(map(data => {
                if(data.status){
                }
                return data;
         }));
    }
    addDeliveryAddress(data_:any) {
        let authToken = localStorage.getItem('token')!
        const headers = new HttpHeaders({'x-auth-token':authToken })
        return this.http.post<any>(`${environment.apiBaseUrl}/users/addDeliveryAddress?isWeb=1`,data_,{ headers: headers })
            .pipe(map(data => {
                if(data.status){
                }
                return data;
         }));
    }
    updateDeliveryAddress(data_:any) {
        let authToken = localStorage.getItem('token')!
        const headers = new HttpHeaders({'x-auth-token':authToken })
        return this.http.put<any>(`${environment.apiBaseUrl}/users/updateDeliveryAddress?isWeb=1`,data_,{ headers: headers })
            .pipe(map(data => {
                if(data.status){
                }
                return data;
         }));
    }
    getPINCODE(city:any){
        return this.http.get<RootPINCODE>(`${environment.apiBaseUrl}/zone/pincode/`+city)
        .pipe(map(data => {
            if(data.status){
            }
            return data;
         }));
    }
    
    getCities(){
        
        return this.http.get<RootCities>(`${environment.apiBaseUrl}/zone/city`)
        .pipe(map(data => {
            if(data.status){
            }
            return data;
         }));
    }
}
/*-------------------Cites---------------*/
export interface RootCities {
    status: boolean
    data: DataCities
  }
  
  export interface DataCities {
    cities: string[]
  }
/*-------------------Cites---------------*/

export interface RootVerifyOTP {
    status: boolean
    message:string
    data: Data
  }
  
export interface Data {
    cities: string[]
    user: User
    isRegistered: boolean
    token: string
}
export interface User {
    username: string
    tradeName: string
    email: string
    mobileNo: string
    addressLine1: string
    addressLine2: string
    city: string
    pincode: string
    state: string
    status: string
    role: string
  }
  
export interface RootPINCODE {
    status: boolean
    message:string
    data: DataPINCODE
  }
  
  export interface DataPINCODE {
    pincode: string[]
  }
  
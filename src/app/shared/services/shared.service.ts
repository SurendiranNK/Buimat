import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private sharedDataSubject = new BehaviorSubject<number>(0); // You can replace 'string' with your data type
  sharedData$ = this.sharedDataSubject.asObservable();


  private sharedDataNumber = new BehaviorSubject<number>(0); // You can replace 'string' with your data type
  sharedDataNumber$ = this.sharedDataNumber.asObservable();


  
  private sharedPinCodeUpdate = new BehaviorSubject<number>(0); // You can replace 'string' with your data type
  sharedPINCODEupdate$ = this.sharedPinCodeUpdate.asObservable();


  updateCartNumber(newValue: number) {
    this.sharedDataSubject.next(newValue);
  }

  updateWishlistNumber(newValue_: number) {
    this.sharedDataNumber.next(newValue_);
  }

  updatePINCODE(newValue_: number) {
    this.sharedPinCodeUpdate.next(newValue_);
  }

}
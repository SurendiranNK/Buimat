import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExternalUrlService {
  constructor(private http: HttpClient) {}

  // Function to make a GET request to an external URL
  getExternalUrlData(url: string): Observable<any> {
    return this.http.get(url);
  }
}
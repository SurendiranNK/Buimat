// loading.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading: boolean = false;

  constructor() { }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  getLoading(): boolean {
    return this.loading;
  }
}
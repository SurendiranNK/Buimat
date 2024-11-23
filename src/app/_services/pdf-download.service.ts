
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class PdfDownloadService {
  constructor(private http: HttpClient) {}

  downloadPdf(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  savePdf(blob: Blob, fileName: string): void {
    saveAs(blob, fileName);
  }
}
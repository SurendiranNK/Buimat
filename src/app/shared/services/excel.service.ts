// import { Injectable } from '@angular/core';
// import * as XLSX from 'xlsx';

// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// const EXCEL_EXTENSION = '.xlsx';
// @Injectable({
//   providedIn: 'root'
// })
// export class ExcelService {

//   constructor() { }

//   public importFromFile(bstr: string): XLSX.AOA2SheetOpts {
//     /* read workbook */
//     const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true  });

//     /* grab first sheet */
//     const wsname: string = wb.SheetNames[0];
//     const ws: XLSX.WorkSheet = wb.Sheets[wsname];

//     /* save data */
//     const data = <XLSX.AOA2SheetOpts>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

//     return data;
//   }


//   public exportToFile(fileName: string, element_id: string) {
//     if (!element_id) throw new Error('Element Id does not exists');

//     let tbl = document.getElementById(element_id);
//     let wb = XLSX.utils.table_to_book(tbl);
//     XLSX.writeFile(wb, fileName + '.xlsx');
//   }

  
//   public exportAsExcelFile(json: any[], excelFileName: string): void {
    
//     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
//     // console.log('worksheet',worksheet);
//     const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
//     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
//     this.saveAsExcelFile(excelBuffer, excelFileName);
//   }

//   public exportAsExcelFile_(json: any[], excelFileName: string): void {
    
//     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
//     //console.log('worksheet',worksheet);
//     const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
//     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
//     this.saveAsExcelFile(excelBuffer, excelFileName);
//   }

  
//   private saveAsExcelFile(buffer: any, fileName: string): void {
//     const data: Blob = new Blob([buffer], {
//       type: EXCEL_TYPE
//     });
//     //FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
//   }

// }

import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public importFromFile(bstr: string): XLSX.AOA2SheetOpts {
    /* read workbook */
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true  });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    const data = <XLSX.AOA2SheetOpts>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

    return data;
  }


  public exportToFile(fileName: string, element_id: string) {
    if (!element_id) throw new Error('Element Id does not exists');

    let tbl = document.getElementById(element_id);
    let wb = XLSX.utils.table_to_book(tbl);
    XLSX.writeFile(wb, fileName + '.xlsx');
  }

  
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportAsExcelFile_(json: any[], excelFileName: string): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    //console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
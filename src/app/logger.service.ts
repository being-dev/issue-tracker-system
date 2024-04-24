import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  public info(object: any): void {
    console.info(object);
  }

  public log(object:any): void {
    console.log(object);
  }

  public warn(object:any): void {
    console.warn(object);
  }

  public error(object:any): void {
    console.error(object);
  }

  public alert(object:any) : void {
    this.alert(JSON.stringify(object));
  }
}

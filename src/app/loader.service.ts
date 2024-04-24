import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading: boolean = false;

  constructor() { }

  public setLoading(loading: boolean): void {
    this.loading = loading;
  }

  public getLoading(): boolean {
    return this.loading;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public data: Observable<any> = this.dataSubject.asObservable();

  constructor() {}

  sendData(data: any): void {
    this.dataSubject.next(data);
  }

}
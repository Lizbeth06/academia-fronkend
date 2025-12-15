import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Sector } from '../model/sede.model';


@Injectable({
  providedIn: 'root'
})
export class SectorService extends GenericService<Sector>{
  private sectorChange: Subject<Sector[]> = new Subject<Sector[]>

  constructor(
    protected override http: HttpClient,
  ) { 
    super(
      http,
      `${environment.HOST}/api/sector`
    );
  }

  setSectorChange(data:Sector[]){
    this.sectorChange.next(data);
  }

  getSectorChange(){
    return this.sectorChange.asObservable();
  }
  
}

import { inject, Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogoData } from '../model/dialogo-data';
import { ConfirmDialogComponent } from '../common/components/confirm-dialog/confirm-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class DialogFormService {
  
  readonly dialog = inject(MatDialog)
  
  openDialog<T>(component:Type<any>,data?:DialogoData<T>,width:string='auto'):Observable<T|undefined>{
    const config: MatDialogConfig<DialogoData<T>> = {
      maxWidth: 'none',
      width,
      data
    }
    const dialogRef = this.dialog.open(component,config)

    return dialogRef.afterClosed() as Observable<T|undefined>
    
  }

  confirmDialog<T>(data:DialogoData<T>): Observable<boolean> {
      const dialogRef = this.dialog.open(ConfirmDialogComponent<T>, {
        width: '350px',
        data
      });
  
      return dialogRef.afterClosed();
    }
}
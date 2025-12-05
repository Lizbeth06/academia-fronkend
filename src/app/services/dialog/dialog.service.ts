import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCustomData } from '../../model/dialog.model';
import { DialogcustomComponent } from '../../admin/dialogcustom/dialogcustom.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private matDialog: MatDialog) { }

  openDialogCustom(data: DialogCustomData) {
    return this.matDialog.open(DialogcustomComponent, {
      data,
      disableClose: true,
      autoFocus: false,
    })
  }
}

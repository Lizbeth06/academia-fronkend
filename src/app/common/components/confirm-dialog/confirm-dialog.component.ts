import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogoData } from '../../../model/dialogo-data';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MaterialModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent <T> { 
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: DialogoData<T>,
  ) {}

  confirmar(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false); 
  }
}
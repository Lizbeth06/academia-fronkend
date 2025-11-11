import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DialogCustomData } from '../../model/dialog.model';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-dialogcustom',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatDialogModule],
  template: '<button type="button" class="closeDialogUp" mat-dialog-close></button><ng-container *ngTemplateOutlet="data.template"> </ng-container>',
  // templateUrl: './dialogcustom.component.html',
  styleUrl: './dialogcustom.component.css',
})
export class DialogcustomComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogCustomData){}

}

import { Component, Inject, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../material/material.module';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Ubigeo } from '../../../../model/ubigeo';
import { UbigeoService } from '../../../../services/ubigeo.service';

@Component({
  selector: 'app-convocatoria-form',
  imports: [MaterialModule],
  templateUrl: './convocatoria-form.component.html',
  styleUrl: './convocatoria-form.component.css'
})
export class ConvocatoriaFormComponent{
 
}


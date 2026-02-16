import { Validators } from '@angular/forms';

export interface DocumentConfig {
  placeholder: string;
  maxlength: number;
  formControl: string;
  validators: any[];
}

export const DocumentConfigs: Record<number, DocumentConfig> = {
  1: {
    placeholder: 'Nro. de DNI',
    maxlength: 8,
    formControl: 'dni',
    validators: [
      Validators.required,
      Validators.pattern(/^\d{8}$/)
    ]
  },
  2: {
    placeholder: 'Nro. carnet extranjeria',
    maxlength: 12,
    formControl: 'carnet',
    validators: [
      Validators.required,
      Validators.pattern(/^\d{12}$/)
    ]
  },
  3: {
    placeholder: 'Nro. Pasaporte',
    maxlength: 12,
    formControl: 'pass',
    validators: [
      Validators.required
    ]
  }
};

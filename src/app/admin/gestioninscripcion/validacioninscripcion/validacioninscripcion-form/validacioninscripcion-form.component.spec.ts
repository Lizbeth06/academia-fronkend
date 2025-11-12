import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacioninscripcionFormComponent } from './validacioninscripcion-form.component';

describe('ValidacioninscripcionFormComponent', () => {
  let component: ValidacioninscripcionFormComponent;
  let fixture: ComponentFixture<ValidacioninscripcionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidacioninscripcionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidacioninscripcionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

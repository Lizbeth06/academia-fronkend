import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacioninscripcionListaComponent } from './validacioninscripcion-lista.component';

describe('ValidacioninscripcionListaComponent', () => {
  let component: ValidacioninscripcionListaComponent;
  let fixture: ComponentFixture<ValidacioninscripcionListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidacioninscripcionListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidacioninscripcionListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

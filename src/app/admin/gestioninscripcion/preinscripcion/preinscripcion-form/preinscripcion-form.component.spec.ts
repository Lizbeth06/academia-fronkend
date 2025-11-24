import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreinscripcionFormComponent } from './preinscripcion-form.component';

describe('PreinscripcionFormComponent', () => {
  let component: PreinscripcionFormComponent;
  let fixture: ComponentFixture<PreinscripcionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreinscripcionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreinscripcionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

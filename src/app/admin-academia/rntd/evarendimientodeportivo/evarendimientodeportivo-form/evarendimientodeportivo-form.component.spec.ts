import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvarendimientodeportivoFormComponent } from './evarendimientodeportivo-form.component';

describe('EvarendimientodeportivoFormComponent', () => {
  let component: EvarendimientodeportivoFormComponent;
  let fixture: ComponentFixture<EvarendimientodeportivoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvarendimientodeportivoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvarendimientodeportivoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

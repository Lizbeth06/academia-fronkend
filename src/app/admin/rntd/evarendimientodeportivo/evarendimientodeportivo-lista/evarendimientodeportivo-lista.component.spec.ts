import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvarendimientodeportivoListaComponent } from './evarendimientodeportivo-lista.component';

describe('EvarendimientodeportivoListaComponent', () => {
  let component: EvarendimientodeportivoListaComponent;
  let fixture: ComponentFixture<EvarendimientodeportivoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvarendimientodeportivoListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvarendimientodeportivoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

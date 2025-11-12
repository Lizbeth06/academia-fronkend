import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreinscripcionListaComponent } from './preinscripcion-lista.component';

describe('PreinscripcionListaComponent', () => {
  let component: PreinscripcionListaComponent;
  let fixture: ComponentFixture<PreinscripcionListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreinscripcionListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreinscripcionListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

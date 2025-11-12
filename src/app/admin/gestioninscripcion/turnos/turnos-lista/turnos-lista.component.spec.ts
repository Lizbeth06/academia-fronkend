import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosListaComponent } from './turnos-lista.component';

describe('TurnosListaComponent', () => {
  let component: TurnosListaComponent;
  let fixture: ComponentFixture<TurnosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporadaListaComponent } from './temporada-lista.component';

describe('TemporadaListaComponent', () => {
  let component: TemporadaListaComponent;
  let fixture: ComponentFixture<TemporadaListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporadaListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporadaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

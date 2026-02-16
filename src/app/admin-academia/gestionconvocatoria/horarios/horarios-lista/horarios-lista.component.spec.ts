import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosListaComponent } from './horarios-lista.component';

describe('HorariosListaComponent', () => {
  let component: HorariosListaComponent;
  let fixture: ComponentFixture<HorariosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorariosListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorariosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocatoriasCardComponent } from './convocatorias-card.component';

describe('ConvocatoriasCardComponent', () => {
  let component: ConvocatoriasCardComponent;
  let fixture: ComponentFixture<ConvocatoriasCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvocatoriasCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvocatoriasCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

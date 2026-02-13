import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporadaFormComponent } from './temporada-form.component';

describe('TemporadaFormComponent', () => {
  let component: TemporadaFormComponent;
  let fixture: ComponentFixture<TemporadaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporadaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporadaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

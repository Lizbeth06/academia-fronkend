import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosFormComponent } from './turnos-form.component';

describe('TurnosFormComponent', () => {
  let component: TurnosFormComponent;
  let fixture: ComponentFixture<TurnosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

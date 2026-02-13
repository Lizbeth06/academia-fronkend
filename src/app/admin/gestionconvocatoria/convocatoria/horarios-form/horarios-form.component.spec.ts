import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosFormComponent } from './horarios-form.component';

describe('HorariosFormComponent', () => {
  let component: HorariosFormComponent;
  let fixture: ComponentFixture<HorariosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorariosFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorariosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

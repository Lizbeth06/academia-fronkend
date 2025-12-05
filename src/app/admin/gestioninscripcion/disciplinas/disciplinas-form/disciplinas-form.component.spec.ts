import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinasFormComponent } from './disciplinas-form.component';

describe('DisciplinasFormComponent', () => {
  let component: DisciplinasFormComponent;
  let fixture: ComponentFixture<DisciplinasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplinasFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisciplinasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

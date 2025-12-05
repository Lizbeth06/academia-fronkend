import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComvocatoriaFormComponent } from './comvocatoria-form.component';

describe('ComvocatoriaFormComponent', () => {
  let component: ComvocatoriaFormComponent;
  let fixture: ComponentFixture<ComvocatoriaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComvocatoriaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComvocatoriaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

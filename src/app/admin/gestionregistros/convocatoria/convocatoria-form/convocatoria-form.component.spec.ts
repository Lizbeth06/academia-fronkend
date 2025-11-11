import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocatoriaFormComponent } from './convocatoria-form.component';

describe('ConvocatoriaFormComponent', () => {
  let component: ConvocatoriaFormComponent;
  let fixture: ComponentFixture<ConvocatoriaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvocatoriaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvocatoriaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

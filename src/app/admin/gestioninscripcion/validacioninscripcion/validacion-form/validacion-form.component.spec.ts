import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionFormComponent } from './validacion-form.component';

describe('ValidacionFormComponent', () => {
  let component: ValidacionFormComponent;
  let fixture: ComponentFixture<ValidacionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidacionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

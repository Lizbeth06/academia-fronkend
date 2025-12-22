import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecthorarioFormComponent } from './selecthorario-form.component';

describe('SelecthorarioFormComponent', () => {
  let component: SelecthorarioFormComponent;
  let fixture: ComponentFixture<SelecthorarioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecthorarioFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecthorarioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

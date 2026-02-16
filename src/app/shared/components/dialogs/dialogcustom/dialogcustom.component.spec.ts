import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogcustomComponent } from './dialogcustom.component';

describe('DialogcustomComponent', () => {
  let component: DialogcustomComponent;
  let fixture: ComponentFixture<DialogcustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogcustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogcustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

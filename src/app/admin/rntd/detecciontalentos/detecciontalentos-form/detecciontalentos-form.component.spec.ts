import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetecciontalentosFormComponent } from './detecciontalentos-form.component';

describe('DetecciontalentosFormComponent', () => {
  let component: DetecciontalentosFormComponent;
  let fixture: ComponentFixture<DetecciontalentosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetecciontalentosFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetecciontalentosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

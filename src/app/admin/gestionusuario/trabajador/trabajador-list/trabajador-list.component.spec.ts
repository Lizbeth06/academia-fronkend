import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajadorListComponent } from './trabajador-list.component';

describe('TrabajadorListComponent', () => {
  let component: TrabajadorListComponent;
  let fixture: ComponentFixture<TrabajadorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrabajadorListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrabajadorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

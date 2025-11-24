import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadodetalentosFormComponent } from './listadodetalentos-form.component';

describe('ListadodetalentosFormComponent', () => {
  let component: ListadodetalentosFormComponent;
  let fixture: ComponentFixture<ListadodetalentosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadodetalentosFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadodetalentosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

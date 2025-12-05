import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedesListaComponent } from './sedes-lista.component';

describe('SedesListaComponent', () => {
  let component: SedesListaComponent;
  let fixture: ComponentFixture<SedesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SedesListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SedesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaListaComponent } from './ayuda-lista.component';

describe('AyudaListaComponent', () => {
  let component: AyudaListaComponent;
  let fixture: ComponentFixture<AyudaListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AyudaListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AyudaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListahorarioComponent } from './listahorario.component';

describe('ListahorarioComponent', () => {
  let component: ListahorarioComponent;
  let fixture: ComponentFixture<ListahorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListahorarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListahorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

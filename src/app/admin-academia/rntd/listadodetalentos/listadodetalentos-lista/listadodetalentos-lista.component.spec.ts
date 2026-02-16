import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadodetalentosListaComponent } from './listadodetalentos-lista.component';

describe('ListadodetalentosListaComponent', () => {
  let component: ListadodetalentosListaComponent;
  let fixture: ComponentFixture<ListadodetalentosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadodetalentosListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadodetalentosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

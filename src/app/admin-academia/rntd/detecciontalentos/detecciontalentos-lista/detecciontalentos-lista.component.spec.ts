import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetecciontalentosListaComponent } from './detecciontalentos-lista.component';

describe('DetecciontalentosListaComponent', () => {
  let component: DetecciontalentosListaComponent;
  let fixture: ComponentFixture<DetecciontalentosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetecciontalentosListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetecciontalentosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

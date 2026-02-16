import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PerfilListaComponent } from "./perfil-list.component";

describe("PerfilListComponent", () => {
  let component: PerfilListaComponent;
  let fixture: ComponentFixture<PerfilListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilListaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

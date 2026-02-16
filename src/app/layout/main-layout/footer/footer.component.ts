import { Component } from "@angular/core";
import { MaterialModule } from "../../../shared/components/material/material.module";

@Component({
  selector: "app-footer",
  imports: [MaterialModule],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.css",
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}

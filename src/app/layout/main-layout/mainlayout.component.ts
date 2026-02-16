import { Component, OnInit } from "@angular/core";
import { MaterialModule } from "../../shared/components/material/material.module";
import { RouterModule } from "@angular/router";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

@Component({
  selector: "app-mainlayout",
  imports: [MaterialModule, RouterModule, HeaderComponent, FooterComponent, SidebarComponent],
  templateUrl: "./mainlayout.component.html",
  styleUrl: "./mainlayout.component.css",
})
export class MainlayoutComponent implements OnInit {
  ngOnInit(): void {
    console.log("Ingreso");
  }
}

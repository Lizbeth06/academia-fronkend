import { Component, input, OnInit } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Menu, MenuOption } from "../../../../core/model/menu";

@Component({
  selector: "menu-option",
  imports: [RouterLink, RouterLinkActive],
  template: `
    <li class="sidebar-nav-item">
      <a [routerLink]="itemOption().href" routerLinkActive="active" class="sidebar-nav-link">
        <span class="sidebar-nav-abbr"> {{ itemOption().icono }} </span>
        <span class="sidebar-nav-name"> {{ itemOption().nombre }} </span>
      </a>
    </li>
  `,
  styles: `
    .active {
      color: #4daea9;
    }
  `,
})
export class ItemMenuOptionComponent implements OnInit {
  itemOption = input.required<MenuOption>();

  ngOnInit() {}
}

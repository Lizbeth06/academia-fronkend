import { Injectable } from "@angular/core";
import { MenuSubmenu } from "../model/menu";

@Injectable({
  providedIn: "root",
})
export class MenuTreeService {
  buildMenuTree(menus: MenuSubmenu[]): MenuSubmenu[] {
    const map = new Map<number, MenuSubmenu>();
    const roots: MenuSubmenu[] = [];

    for (const menu of menus) {
      map.set(menu.idMenu, { ...menu, children: [] });
    }
    for (const menu of map.values()) {
      if (menu.menupadre === null) {
        roots.push(menu);
      } else {
        const parent = map.get(menu.menupadre);
        parent?.children?.push(menu);
      }
    }
    const sortRecursive = (items: MenuSubmenu[]) => {
      items.sort((a, b) => +a.orden - +b.orden);
      for (const item of items) {
        if (item.children?.length) {
          sortRecursive(item.children);
        }
      }
    };

    sortRecursive(roots);

    return roots;
  }
}

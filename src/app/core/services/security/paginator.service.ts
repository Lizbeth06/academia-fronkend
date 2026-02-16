import { Injectable } from '@angular/core';
import {MatPaginatorIntl} from "@angular/material/paginator";

@Injectable({
  providedIn: 'root'
})
export class PaginatorService extends MatPaginatorIntl {

  override firstPageLabel = `Página inicial`;
  override itemsPerPageLabel = `Registros por página:`;
  override lastPageLabel = `Página final`;
  override nextPageLabel = 'Página siguiente';
  override previousPageLabel = 'Página anterior';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // El texto que aparecerá es del estilo "de 1-20 de 200"
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1}–${endIndex} de ${length}`;
  };
}

  
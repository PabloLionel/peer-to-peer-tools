import { MatPaginatorIntl } from '@angular/material/paginator';

export function customPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'items por pagina:';

  return customPaginatorIntl;
}

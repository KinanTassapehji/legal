import { Sort } from "@angular/material/sort";

export class Utils {
  static getSortObject(orderBy: string | undefined, sortDirection: string | undefined): Sort {
    let sort: Sort = { active: '', direction: '' };

    if (orderBy !== undefined) {
      sort.active = orderBy;
    }

    if (sortDirection !== undefined) {
      sort.direction = sortDirection === 'asc' ? 'asc' : 'desc';
    }

    return sort;
  }
}

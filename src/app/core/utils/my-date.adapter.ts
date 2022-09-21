import { NativeDateAdapter } from '@angular/material/core';
import { format, isValid, parseISO } from 'date-fns';
import { environment } from '../../../environments/environment'

export class MyDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: any): string {
    if (displayFormat === 'input') {
      return format(date, environment.appDateFormat);;
    }

    return date.toDateString();
  }

  override parse(value: any): Date | null {
    if (!isValid(value)) {
      return null;
    }

    const date = format(value, environment.appDateFormat);

    return isValid(date) ? parseISO(date) : null;
  }
}

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

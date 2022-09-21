import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'applyFn',
})
export class ApplyFnPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any[] {
    if (!value) {
      return value;
    }

    const [fnFilter] = args;

    if (!fnFilter) {
      return fnFilter;
    }

    const result = fnFilter(value);

    return fnFilter(value);
  }
}

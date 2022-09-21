import { Pipe, PipeTransform } from '@angular/core';
import { get } from 'lodash-es';
import { format } from 'date-fns';

@Pipe({
  name: 'defvalue',
})
export class DefvaluePipe implements PipeTransform {
  transform(value: unknown, def: string, config: any = {}): unknown {

    if (config.type === 'date') {
      return format(get(value, def, config.defaultValue), config.format);
    }

    if (config.type === 'enum') {
      const path = get(value, def, '');

      return get(config.enum, path, config.defaultValue);
    }

    return get(value, def, config.defaultValue);
  }
}

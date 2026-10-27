import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { SanitizeUtil } from '../utils/sanitize.util';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type === 'custom') return value;
    return SanitizeUtil.deep(value);
  }
}

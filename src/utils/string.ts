import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

export function generateFileName(name: string) {
  return `${randomStringGenerator()}.${name.split('.').pop()?.toLowerCase()}`;
}

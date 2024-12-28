import { instanceToPlain } from 'class-transformer';
import { BaseEntity } from 'typeorm';

export class EntityRelationalHelper extends BaseEntity {
  toJSON() {
    return instanceToPlain(this);
  }
}

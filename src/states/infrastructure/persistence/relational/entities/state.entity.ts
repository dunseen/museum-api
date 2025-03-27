import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'state',
})
export class StateEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 2,
  })
  code: string;
}

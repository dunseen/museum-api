import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { StateEntity } from '../../../../../states/infrastructure/persistence/relational/entities/state.entity';

@Entity({
  name: 'city',
})
export class CityEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @ManyToOne(() => StateEntity, { eager: true })
  state: StateEntity;
}

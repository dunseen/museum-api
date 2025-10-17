import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { SpecieEntity } from '../../../../../species/infrastructure/persistence/relational/entities/specie.entity';
import { CharacteristicEntity } from '../../../../../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';
import { ChangeRequestEntity } from '../../../../../change-requests/infrastructure/persistence/relational/entities/change-request.entity';
@Entity({ name: 'file' })
export class FileEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @Column()
  url: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  approved: boolean;

  @ManyToOne(() => SpecieEntity, (specie) => specie.files)
  @JoinColumn({
    name: 'specieId',
    referencedColumnName: 'id',
  })
  specie: SpecieEntity;

  @ManyToOne(
    () => CharacteristicEntity,
    (characteristic) => characteristic.files,
  )
  @JoinColumn({
    name: 'characteristicId',
    referencedColumnName: 'id',
  })
  characteristic: CharacteristicEntity;

  @ManyToOne(() => ChangeRequestEntity, { nullable: true })
  @JoinColumn({ name: 'changeRequestId', referencedColumnName: 'id' })
  changeRequest?: ChangeRequestEntity | null;
}

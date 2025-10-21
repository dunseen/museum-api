import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CharacteristicTypeEntity } from '../../../../../characteristic-types/infrastructure/persistence/relational/entities/characteristic-type.entity';

@Entity({
  name: 'characteristic_draft',
})
export class CharacteristicDraftEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  name: string;

  @ManyToOne(() => CharacteristicTypeEntity, { eager: true })
  @JoinColumn({ name: 'type_id' })
  type: CharacteristicTypeEntity;

  // Store file paths as JSON array for now
  @Column({ type: 'jsonb', nullable: true })
  filePaths: string[];

  // Store files to delete as JSON array
  @Column({ type: 'jsonb', nullable: true })
  filesToDelete: string[];
}

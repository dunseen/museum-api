import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { SpecieEntity } from '../../../../../species/infrastructure/persistence/relational/entities/specie.entity';
import { ChangeRequestEntity } from '../../../../../change-requests/infrastructure/persistence/relational/entities/change-request.entity';

@Entity({
  name: 'post',
})
export class PostEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SpecieEntity, { nullable: false, eager: true })
  specie: SpecieEntity;

  @ManyToOne(() => ChangeRequestEntity, { nullable: true, eager: true })
  changeRequest?: ChangeRequestEntity | null;

  @Column({ nullable: true })
  changeRequestId?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

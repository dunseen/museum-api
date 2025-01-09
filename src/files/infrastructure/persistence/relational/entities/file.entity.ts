import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Transform } from 'class-transformer';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppConfig } from '../../../../../config/app-config.type';
import appConfig from '../../../../../config/app.config';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { FileConfig, FileDriver } from '../../../../config/file-config.type';
import fileConfig from '../../../../config/file.config';
import { SpecieEntity } from '../../../../../species/infrastructure/persistence/relational/entities/specie.entity';
import { CharacteristicEntity } from '../../../../../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';

@Entity({ name: 'file' })
export class FileEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Transform(
    ({ value }) => {
      if ((fileConfig() as FileConfig).driver === FileDriver.LOCAL) {
        return (appConfig() as AppConfig).backendDomain + value;
      } else if (
        [FileDriver.S3_PRESIGNED, FileDriver.S3].includes(
          (fileConfig() as FileConfig).driver,
        )
      ) {
        const s3 = new S3Client({
          region: (fileConfig() as FileConfig).awsS3Region ?? '',
          credentials: {
            accessKeyId: (fileConfig() as FileConfig).accessKeyId ?? '',
            secretAccessKey: (fileConfig() as FileConfig).secretAccessKey ?? '',
          },
        });

        const command = new GetObjectCommand({
          Bucket: (fileConfig() as FileConfig).awsDefaultS3Bucket ?? '',
          Key: value,
        });

        return getSignedUrl(s3, command, { expiresIn: 3600 });
      }

      return value;
    },
    {
      toPlainOnly: true,
    },
  )
  path: string;

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
}

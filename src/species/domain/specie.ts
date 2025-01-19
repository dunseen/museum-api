import { ApiProperty } from '@nestjs/swagger';
import { Taxon } from '../../taxons/domain/taxon';
import { Characteristic } from '../../characteristics/domain/characteristic';
import { FileType } from '../../files/domain/file';
import { NullableType } from '../../utils/types/nullable.type';

export class Specie {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  readonly scientificName: string;

  @ApiProperty({ type: String })
  readonly commonName: string;

  @ApiProperty({ type: String, nullable: true })
  readonly description: NullableType<string>;

  @ApiProperty({ type: Taxon, isArray: true })
  private readonly _taxons: Taxon[] = [];

  @ApiProperty({ type: Characteristic, isArray: true })
  private readonly _characteristics: Characteristic[] = [];

  @ApiProperty({ type: FileType, isArray: true })
  private readonly _files: FileType[] = [];

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(
    id: number,
    scientificName: string,
    commonName: string,
    description: NullableType<string>,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.scientificName = scientificName;
    this.commonName = commonName;
    this.description = description;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  get taxons(): ReadonlyArray<Taxon> {
    return this._taxons;
  }

  get characteristics(): ReadonlyArray<Characteristic> {
    return this._characteristics;
  }

  get files(): ReadonlyArray<FileType> {
    return this._files;
  }
  addTaxon(taxon: Taxon) {
    this._taxons.push(taxon);
  }

  addCharacteristic(characteristic: Characteristic) {
    this._characteristics.push(characteristic);
  }

  addFile(fileType: FileType) {
    this._files.push(fileType);
  }
}

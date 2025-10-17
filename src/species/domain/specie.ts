import { ApiProperty } from '@nestjs/swagger';
import { Taxon } from '../../taxons/domain/taxon';
import { Characteristic } from '../../characteristics/domain/characteristic';
import { FileType } from '../../files/domain/file';
import { NullableType } from '../../utils/types/nullable.type';
import { City } from '../../cities/domain/city';
import { State } from '../../states/domain/state';
import { Specialist } from '../../specialists/domain/specialist';
import { ChangeRequestStatus } from '../../change-requests/domain/change-request';

export class Specie {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  readonly scientificName: string;

  @ApiProperty({ type: String, nullable: true })
  readonly commonName: NullableType<string>;

  @ApiProperty({ type: Specialist, nullable: true })
  readonly collector: NullableType<Specialist>;

  @ApiProperty({ type: Specialist, nullable: true })
  readonly determinator: NullableType<Specialist>;

  @ApiProperty({ type: String, nullable: true })
  readonly collectLocation: NullableType<string>;

  @ApiProperty({ type: Number })
  readonly lat: number;

  @ApiProperty({ type: Number })
  readonly long: number;

  @ApiProperty({ type: String, nullable: true })
  readonly description: NullableType<string>;

  @ApiProperty({ type: Taxon, isArray: true })
  private readonly _taxons: Taxon[] = [];

  @ApiProperty({ type: Characteristic, isArray: true })
  private readonly _characteristics: Characteristic[] = [];

  @ApiProperty({ type: FileType, isArray: true })
  private readonly _files: FileType[] = [];

  @ApiProperty({ type: City })
  private _city: City;

  @ApiProperty({ type: State })
  private _state: State;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly collectedAt: Date;

  @ApiProperty()
  readonly determinatedAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ enum: ChangeRequestStatus })
  private readonly _status: ChangeRequestStatus;

  @ApiProperty({ type: String, nullable: true })
  private readonly _statusReason: NullableType<string>;

  constructor(
    id: number,
    scientificName: string,
    commonName: NullableType<string>,
    description: NullableType<string>,
    collector: NullableType<Specialist>,
    determinator: NullableType<Specialist>,
    collectLocation: NullableType<string>,
    lat: number,
    long: number,
    collectedAt: Date,
    determinatedAt: Date,
    createdAt?: Date,
    updatedAt?: Date,
    status: ChangeRequestStatus = ChangeRequestStatus.APPROVED,
    statusReason?: NullableType<string>,
  ) {
    this.id = id;
    this.scientificName = scientificName;
    this.commonName = commonName;
    this.description = description;
    this.collector = collector;
    this.determinator = determinator;
    this.collectLocation = collectLocation;
    this.lat = lat;
    this.long = long;
    this.collectedAt = collectedAt;
    this.determinatedAt = determinatedAt;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this._status = status;
    this._statusReason = statusReason ?? null;
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

  get city(): City {
    return this._city;
  }

  get state(): State {
    return this._state;
  }

  get status(): ChangeRequestStatus {
    return this._status;
  }

  get statusReason(): NullableType<string> {
    return this._statusReason;
  }

  addCity(city: City) {
    this._city = city;
  }
  addState(state: State) {
    this._state = state;
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

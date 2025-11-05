import { Specie } from './specie';
import { Taxon } from '../../taxons/domain/taxon';
import { Characteristic } from '../../characteristics/domain/characteristic';
import { FileType } from '../../files/domain/file';
import { NullableType } from '../../utils/types/nullable.type';
import { City } from '../../cities/domain/city';
import { State } from '../../states/domain/state';
import { Specialist } from '../../specialists/domain/specialist';
import { ChangeRequestStatus } from '../../change-requests/domain/change-request';

export class SpecieBuilder {
  private id: number;
  private scientificName: string;
  private commonName: NullableType<string>;
  private description: NullableType<string>;
  private determinator: NullableType<Specialist>;
  private collector: NullableType<Specialist>;
  private collectLocation: NullableType<string>;
  private lat: number;
  private long: number;
  private collectedAt: Date;
  private determinatedAt: Date;
  private createdAt: Date;
  private updatedAt: Date;
  private taxons: Taxon[] = [];
  private characteristics: Characteristic[] = [];
  private files: FileType[] = [];
  private city?: City;
  private state?: State;
  private status?: ChangeRequestStatus;
  private statusReason?: NullableType<string>;
  setId(id: number): this {
    this.id = id;
    return this;
  }

  setScientificName(scientificName: string): this {
    this.scientificName = scientificName;
    return this;
  }

  setCommonName(commonName: NullableType<string>): this {
    this.commonName = commonName;
    return this;
  }
  setDescription(description: NullableType<string>): this {
    this.description = description;
    return this;
  }

  setDeterminator(determinator: NullableType<Specialist>): this {
    this.determinator = determinator;
    return this;
  }

  setCollector(collector: NullableType<Specialist>): this {
    this.collector = collector;
    return this;
  }

  setCollectLocation(location: NullableType<string>): this {
    this.collectLocation = location;
    return this;
  }

  setLat(lat: number): this {
    this.lat = lat;
    return this;
  }

  setLong(long: number): this {
    this.long = long;
    return this;
  }

  setCollectedAt(collectedAt: Date): this {
    this.collectedAt = collectedAt;
    return this;
  }

  setDeterminatedAt(determinatedAt: Date): this {
    this.determinatedAt = determinatedAt;
    return this;
  }

  setCity(city: City): this {
    this.city = city;
    return this;
  }

  setState(state: State): this {
    this.state = state;
    return this;
  }

  setCreatedAt(createdAt: Date): this {
    this.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date): this {
    this.updatedAt = updatedAt;
    return this;
  }

  setStatus(status: ChangeRequestStatus): this {
    this.status = status;
    return this;
  }

  setStatusReason(statusReason: NullableType<string>): this {
    this.statusReason = statusReason;
    return this;
  }
  addTaxon(taxon: Taxon): this {
    this.taxons.push(taxon);
    return this;
  }

  addCharacteristic(characteristic: Characteristic): this {
    this.characteristics.push(characteristic);
    return this;
  }

  addFile(file: FileType): this {
    this.files.push(file);
    return this;
  }

  build(): Specie {
    if (!this.scientificName) {
      throw new Error('ID, scientific name is required to build a Specie.');
    }

    const specie = new Specie(
      this.id,
      this.scientificName,
      this.commonName,
      this.description,
      this.collector,
      this.determinator,
      this.collectLocation,
      this.lat,
      this.long,
      this.collectedAt,
      this.determinatedAt,
      this.createdAt,
      this.updatedAt,
      this.status ?? ChangeRequestStatus.APPROVED,
      this.statusReason ?? null,
    );

    if (this.state) {
      specie.addState(this.state);
    }
    if (this.city) {
      specie.addCity(this.city);
    }

    for (const taxon of this.taxons) {
      specie.addTaxon(taxon);
    }

    for (const characteristic of this.characteristics) {
      specie.addCharacteristic(characteristic);
    }

    for (const file of this.files) {
      specie.addFile(file);
    }

    return specie;
  }
}

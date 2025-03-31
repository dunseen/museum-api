import { Specie } from './specie';
import { Taxon } from '../../taxons/domain/taxon';
import { Characteristic } from '../../characteristics/domain/characteristic';
import { FileType } from '../../files/domain/file';
import { NullableType } from '../../utils/types/nullable.type';
import { City } from '../../cities/domain/city';
import { State } from '../../states/domain/state';

export class SpecieBuilder {
  private id: number;
  private scientificName: string;
  private commonName: NullableType<string>;
  private description: NullableType<string>;
  private location: NullableType<string>;
  private lat: number;
  private long: number;
  private collectedAt: Date;
  private createdAt: Date;
  private updatedAt: Date;
  private taxons: Taxon[] = [];
  private characteristics: Characteristic[] = [];
  private files: FileType[] = [];
  private city: City;
  private state: State;
  setId(id: number): SpecieBuilder {
    this.id = id;
    return this;
  }

  setScientificName(scientificName: string): SpecieBuilder {
    this.scientificName = scientificName;
    return this;
  }

  setCommonName(commonName: NullableType<string>): SpecieBuilder {
    this.commonName = commonName;
    return this;
  }
  setDescription(description: NullableType<string>): SpecieBuilder {
    this.description = description;
    return this;
  }

  setLocation(location: NullableType<string>): SpecieBuilder {
    this.location = location;
    return this;
  }

  setLat(lat: number): SpecieBuilder {
    this.lat = lat;
    return this;
  }

  setLong(long: number): SpecieBuilder {
    this.long = long;
    return this;
  }

  setCollectedAt(collectedAt: Date): SpecieBuilder {
    this.collectedAt = collectedAt;
    return this;
  }

  setCity(city: City): SpecieBuilder {
    this.city = city;
    return this;
  }

  setState(state: State): SpecieBuilder {
    this.state = state;
    return this;
  }

  setCreatedAt(createdAt: Date): SpecieBuilder {
    this.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date): SpecieBuilder {
    this.updatedAt = updatedAt;
    return this;
  }

  addTaxon(taxon: Taxon): SpecieBuilder {
    this.taxons.push(taxon);
    return this;
  }

  addCharacteristic(characteristic: Characteristic): SpecieBuilder {
    this.characteristics.push(characteristic);
    return this;
  }

  addFile(file: FileType): SpecieBuilder {
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
      this.location,
      this.lat,
      this.long,
      this.collectedAt,
      this.createdAt,
      this.updatedAt,
    );

    specie.addCity(this.city);
    specie.addState(this.state);

    this.taxons.forEach(specie.addTaxon);
    this.characteristics.forEach(specie.addCharacteristic);
    this.files.forEach(specie.addFile);

    return specie;
  }
}

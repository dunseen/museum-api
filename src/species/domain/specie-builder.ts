import { Specie } from './specie';
import { Taxon } from '../../taxons/domain/taxon';
import { Characteristic } from '../../characteristics/domain/characteristic';
import { FileType } from '../../files/domain/file';

export class SpecieBuilder {
  private id: number;
  private scientificName: string;
  private commonName: string;
  private createdAt: Date;
  private updatedAt: Date;
  private taxons: Taxon[] = [];
  private characteristics: Characteristic[] = [];
  private files: FileType[] = [];

  setId(id: number): SpecieBuilder {
    this.id = id;
    return this;
  }

  setScientificName(scientificName: string): SpecieBuilder {
    this.scientificName = scientificName;
    return this;
  }

  setCommonName(commonName: string): SpecieBuilder {
    this.commonName = commonName;
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
    if (!this.scientificName || !this.commonName) {
      throw new Error(
        'ID, scientific name, and common name are required to build a Specie.',
      );
    }

    const specie = new Specie(
      this.id,
      this.scientificName,
      this.commonName,
      this.createdAt,
      this.updatedAt,
    );

    this.taxons.forEach(specie.addTaxon);
    this.characteristics.forEach(specie.addCharacteristic);
    this.files.forEach(specie.addFile);

    return specie;
  }
}

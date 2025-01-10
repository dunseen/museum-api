import { CharacteristicType } from '../../characteristic-types/domain/characteristic-type';
import { FileType } from '../../files/domain/file';

export class Characteristic {
  private readonly _id?: number;
  private readonly _name: string;
  private readonly _description: string;
  private readonly _type: CharacteristicType;
  private readonly _files: ReadonlyArray<FileType>;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(
    name: string,
    description: string,
    type: CharacteristicType,
    files: FileType[],
    createdAt: Date,
    updatedAt: Date,
    id?: number,
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._type = type;
    this._files = files;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validateState();
  }

  static create(
    name: string,
    description: string,
    type: CharacteristicType,
    files: FileType[] = [],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    id?: number,
  ): Characteristic {
    return new Characteristic(
      name,
      description,
      type,
      files,
      createdAt,
      updatedAt,
      id,
    );
  }

  get id(): number | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get type(): Readonly<CharacteristicType> {
    return this._type;
  }

  get files(): ReadonlyArray<FileType> {
    return this._files;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  private validateState(): void {
    if (this._id && typeof this._id !== 'number') {
      throw new Error('Characteristic must have an id');
    }
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Characteristic must have a non-empty name');
    }
    if (!this._type) {
      throw new Error('Characteristic must have a type');
    }
  }

  withUpdatedType(newType: CharacteristicType): Characteristic {
    return new Characteristic(
      this._name,
      this._description,
      newType,
      [...this._files],
      this._createdAt,
      new Date(),
      this._id,
    );
  }

  withAddedFile(newFile: FileType): Characteristic {
    return new Characteristic(
      this._name,
      this._description,
      this._type,
      [...this._files, newFile],
      this._createdAt,
      new Date(),
      this._id,
    );
  }
}

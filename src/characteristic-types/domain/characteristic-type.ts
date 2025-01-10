import { ApiProperty } from '@nestjs/swagger';

export class CharacteristicType {
  @ApiProperty({
    type: String,
  })
  private readonly _id?: number;

  @ApiProperty({
    type: String,
  })
  private readonly _name: string;

  @ApiProperty()
  private readonly _createdAt: Date;

  @ApiProperty()
  private readonly _updatedAt: Date;

  private constructor(
    name: string,
    id?: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this._id = id;
    this._name = name;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();

    this.validateState();
  }

  static create(
    name: string,
    id?: number,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ): CharacteristicType {
    return new CharacteristicType(name, id, createdAt, updatedAt);
  }

  get id(): number | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  private validateState(): void {
    if (this._id !== undefined && typeof this._id !== 'number') {
      throw new Error('CharacteristicType id must be a number if provided');
    }
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Characteristic must have a non-empty name');
    }
  }

  withId(id: number): CharacteristicType {
    return new CharacteristicType(
      this._name,
      id,
      this._createdAt,
      this._updatedAt,
    );
  }
}

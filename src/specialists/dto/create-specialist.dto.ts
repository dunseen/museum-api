import { ApiProperty } from '@nestjs/swagger';
import { SpecialistType } from '../domain/specialist';
import { IsEnum, IsString } from 'class-validator';

export class CreateSpecialistDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    enum: SpecialistType,
  })
  @IsEnum(SpecialistType)
  type: SpecialistType;
}

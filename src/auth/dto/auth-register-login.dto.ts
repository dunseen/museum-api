import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusDto } from '../../statuses/dto/status.dto';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '+55123456789' })
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto;

  @ApiPropertyOptional({ type: StatusDto })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;
}

// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateHierarchyDto } from './create-hierarchy.dto';

export class UpdateHierarchyDto extends PartialType(CreateHierarchyDto) {}

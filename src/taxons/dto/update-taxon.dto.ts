// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateTaxonDto } from './create-taxon.dto';

export class UpdateTaxonDto extends PartialType(CreateTaxonDto) {}

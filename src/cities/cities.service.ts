import { Injectable } from '@nestjs/common';
import { CityRepository } from './infrastructure/persistence/city.repository';

@Injectable()
export class CitiesService {
  constructor(private readonly cityRepository: CityRepository) {}

  findAll(stateId?: number) {
    return this.cityRepository.findAll(stateId);
  }
}

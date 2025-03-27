import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityEntity } from '../../../../cities/infrastructure/persistence/relational/entities/city.entity';
import { Repository } from 'typeorm';
import cities from './cities.json';
import states from './states.json';
import { StateEntity } from '../../../../states/infrastructure/persistence/relational/entities/state.entity';

@Injectable()
export class CitySeedService {
  constructor(
    @InjectRepository(CityEntity)
    private cityRepo: Repository<CityEntity>,
    @InjectRepository(StateEntity)
    private stateRepo: Repository<StateEntity>,
  ) {}

  async run() {
    const count = await this.cityRepo.count();

    if (count === 0) {
      console.log('🌱 Seeding states and cities...');
      await this.seedStatesAndCities();
      console.log('✅ Seeding completed.');
    } else {
      console.log('🌱 States and cities already seeded.');
    }
  }

  private async seedStatesAndCities() {
    const chunkSize = 100; // Define the size of each chunk

    // Seed states
    const stateChunks = this.chunkArray(states, chunkSize);
    for (const stateChunk of stateChunks) {
      await this.stateRepo.save(
        this.stateRepo.create(stateChunk.map((state) => ({ ...state }))),
      );
    }

    // Seed cities
    const cityChunks = this.chunkArray(cities, chunkSize);
    for (const cityChunk of cityChunks) {
      await this.cityRepo.save(
        this.cityRepo.create(
          cityChunk.map((city) => {
            const state = new StateEntity();
            state.id = city.stateId;
            return {
              state,
              id: Number(city.id),
              name: city.name,
            };
          }),
        ),
      );
    }
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}

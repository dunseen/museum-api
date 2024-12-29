import { NestFactory } from '@nestjs/core';
import { HierarchySeedService } from './hierarchy/hierarchy-seed.service';
import { TaxonSeedService } from './taxon/taxon-seed.service';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(UserSeedService).run();

  await app.get(TaxonSeedService).run();

  await app.get(HierarchySeedService).run();

  await app.close();
};

void runSeed();

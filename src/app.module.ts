import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './mail/config/mail.config';
import fileConfig from './files/config/file.config';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { HeaderResolver } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MailModule } from './mail/mail.module';
import { HomeModule } from './home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from './config/config.type';
import { SessionModule } from './session/session.module';
import { MailerModule } from './mailer/mailer.module';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});

import { SpeciesModule } from './species/species.module';

import { TaxonsModule } from './taxons/taxons.module';

import { HierarchiesModule } from './hierarchies/hierarchies.module';

import { CharacteristicsModule } from './characteristics/characteristics.module';

import { CharacteristicTypesModule } from './characteristic-types/characteristic-types.module';

import { PostsModule } from './posts/posts.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

import { StatesModule } from './states/states.module';

import { CitiesModule } from './cities/cities.module';

import { SpecialistsModule } from './specialists/specialists.module';
import { ChangeLogsModule } from './change-logs/change-logs.module';

@Module({
  imports: [
    SpecialistsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig, fileConfig],
      envFilePath: ['.env'],
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    infrastructureDatabaseModule,
    DashboardModule,
    PostsModule,
    CharacteristicTypesModule,
    CharacteristicsModule,
    HierarchiesModule,
    TaxonsModule,
    SpeciesModule,
    UsersModule,
    FilesModule,
    AuthModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
    CitiesModule,
    StatesModule,
    ChangeLogsModule,
  ],
})
export class AppModule {}

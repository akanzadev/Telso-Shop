import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config/env.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: async (configService: ConfigType<typeof config>) => {
        const {
          database: {
            postgres: { database, host, port, username, password },
          },
        } = configService;
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: true,
          // logging: true,
          ssl: false,
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class DataBaseModule {}

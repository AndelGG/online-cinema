import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { getMongoDBConfig } from './config/mongo.config'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GenreModule } from './genre/genre.module';
import { FileController } from './file/file.controller';
import { FileModule } from './file/file.module';
import { ActorService } from './actor/actor.service';
import { ActorModule } from './actor/actor.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoDBConfig
    }),
    AuthModule,
    UserModule,
    GenreModule,
    FileModule,
    ActorModule
  ],
  controllers: [AppController, FileController],
  providers: [AppService, ActorService],
})
export class AppModule {}

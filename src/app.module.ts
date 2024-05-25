import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from './infra/mongoose/database.module';
import { MongooseModelsModule } from './schemas/mongoose-models.module';
import { AuthModule } from './auth/auth.module';
import { UserRolesModule } from './app-user-roles/user-roles.module';
import { AppPolicyModule } from './app-permisions-policy/app-policy.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:
    [
      ConfigModule.forRoot({ isGlobal: true }),
      JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
      }),
      AuthModule,
      UsersModule,
      DataBaseModule,
      AppPolicyModule,
      UserRolesModule,
      MongooseModelsModule,
    ],
  controllers: [],
  providers: [],
})

export class AppModule { }

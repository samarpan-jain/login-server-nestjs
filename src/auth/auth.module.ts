import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { UsersModule } from "src/users/users.module";

@Module({
    imports:[PassportModule,UsersModule],
    controllers:[AuthController],
    providers:[AuthService, LocalStrategy]
})

export class AuthModule{}
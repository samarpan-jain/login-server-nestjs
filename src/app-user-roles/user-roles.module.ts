import { Module } from "@nestjs/common";
import { UserRolesController } from "./user-roles.controller";
import { UserRolesService } from "./user-roles.service";

@Module({
    controllers:[UserRolesController],
    providers: [UserRolesService]
})

export class UserRolesModule {}

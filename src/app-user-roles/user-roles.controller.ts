import { Body, Controller, Delete, Get, Param, Post, Put, SetMetadata, UseGuards } from "@nestjs/common";
import { UserRolesService } from "./user-roles.service";
import { CreateUserRolesDto } from "src/dtos/create-user-roles.dto";
import { UpdateUserRolesDto } from "src/dtos/update-user-roles.dto";
import { ActivateGuard } from "src/auth/auth-activate.guard";
import { Modules,ScopeEnum } from "src/auth/auth.const";

@UseGuards(ActivateGuard)
@Controller('user-roles')
export class UserRolesController {
    moduleName:string;
    constructor(private userRolesService: UserRolesService) {
        this.moduleName = Modules.USERS
    }

    @Get()
    @SetMetadata('permissions',{ [''+Modules.ROLES] :ScopeEnum.READ})
    getAllUserRoles() {
        return this.userRolesService.getAllUserRoles();
    }

    @Post('create')
    @SetMetadata('permissions',{ [''+Modules.ROLES] :ScopeEnum.CREATE})
    createUserRole(@Body() userRole: CreateUserRolesDto) {
        return this.userRolesService.createNewRole(userRole);
    }

    @Put('update/:id')
    @SetMetadata('permissions',{ [''+Modules.ROLES] :ScopeEnum.UPDATE})
    updateUserRole(@Param('id') userRoleId: string, @Body() userRole: UpdateUserRolesDto) {
        return this.userRolesService.updateUserRole(userRoleId, userRole);
    }

    @Delete('delete/:name')
    @SetMetadata('permissions',{ [''+Modules.ROLES] :ScopeEnum.DELETE})
    deleteUserRole(@Param('name') userRoleName: string) {
        return this.userRolesService.deleteUserRole(userRoleName);
    }
}
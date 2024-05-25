import { Body, Controller, Delete, Get, Param, Post, Put, SetMetadata, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from 'src/dtos/create-users.dto';
import { UpdateUsersDto } from 'src/dtos/update-users.dto';
import { ActivateGuard } from 'src/auth/auth-activate.guard';
import { Modules, ScopeEnum } from 'src/auth/auth.const';

@UseGuards(ActivateGuard)
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post('create')
    @SetMetadata('permissions', { ['' + Modules.USERS]: ScopeEnum.CREATE })
    createNewUse(@Body() user: CreateUsersDto) {
        return this.userService.createNewUser(user);
    }

    @Put('update/:id')
    @SetMetadata('permissions', { ['' + Modules.USERS]: ScopeEnum.UPDATE })
    updateUser(@Param('id') userId: string, @Body() user: UpdateUsersDto) {
        return this.userService.updateUser(userId, user);
    }

    @Get()
    @SetMetadata('permissions', { ['' + Modules.USERS]: ScopeEnum.READ })
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Delete('delete/:id')
    @SetMetadata('permissions', { ['' + Modules.USERS]: ScopeEnum.DELETE })
    deleteUser(@Param('id') userId: string) {
        return this.userService.deleteUser(userId);
    }
}

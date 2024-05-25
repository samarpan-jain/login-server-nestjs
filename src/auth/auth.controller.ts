import { Body, Controller, Post, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUsersDto } from "src/dtos/create-users.dto";
import { ValidateAuthGuard } from "./auth-validate.guard";

@Controller('auth')
export class AuthController{
    constructor(private authService:AuthService){}

    @Post('login')
    @UseGuards(ValidateAuthGuard)
    async login(@Request() req:{user:CreateUsersDto}){
        return this.authService.login(req?.user);
    }

    @Post('register')
    createSuperUser(@Body() superUser:CreateUsersDto){
        return this.authService.createFirstSuperUser(superUser);
    }
}
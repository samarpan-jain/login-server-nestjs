import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserRolesDto{
    @IsNotEmpty()
    @IsString()
    fullName:string;

    @IsNotEmpty()
    @IsString()
    shortName:string;

    @IsOptional()
    @IsString()
    description?:string;
}

export enum UserRolesEnum{
    SUPER_ADMIN = "SUPER ADMIN"
}
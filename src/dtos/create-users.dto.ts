import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class CreateUsersDto{
    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsEmail()
    emailId: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%-_><#\\^\\*\\.?&])[A-Za-z\d@$!%-_><#\\^\\*\\.?&]{8,}$/, 
    {
        message:'password must contain uppercase, lowercase, number and special character',
    })    
    password: string;

    @IsNotEmpty()
    @IsString()
    userType: string;
}
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { compare, hash } from "bcryptjs";
import { Model } from "mongoose";
import { UserRolesEnum } from "src/dtos/create-user-roles.dto";
import { CreateUsersDto } from "src/dtos/create-users.dto";
import { APP_POLICY_MODEL, AppPolicyDocument } from "src/schemas/app-policy.schema";
import { USER_ROLES_MODEL, UserRolesDocument } from "src/schemas/user-roles.schema";
import { USER_MODEL, UserDocument } from "src/schemas/users.schema";
import { DefaultPoliciesArray } from "./auth.const";

@Injectable()
export class AuthService {

    constructor(@InjectModel(USER_MODEL) private userModel: Model<UserDocument>, @InjectModel(APP_POLICY_MODEL) private policyModel: Model<AppPolicyDocument>, @InjectModel(USER_ROLES_MODEL) private userRoleModel: Model<UserRolesDocument>, @InjectModel(APP_POLICY_MODEL) private appPolicyModel:Model<AppPolicyDocument>, private jwtService: JwtService) { }

    async validateUser(emailId: string, userPassword: string) {
        const user:CreateUsersDto = await this.userModel.findOne({emailId},"+password");
        if (!user) {
            throw new UnauthorizedException("Email Id or Password is Invalid");
        }
        const isValidPassword = await compare(userPassword, user.password);
        if (!isValidPassword) {
            throw new UnauthorizedException("Email Id or Password is Invalid");
        }
        return user;
    }

    async login(user:CreateUsersDto){
        const policy = await this.policyModel.find({ attachedRole: user.userType })
        const payload = { 'permissions':[...policy], emailId:user.emailId, designation:user.userType, name:user.name };
        return { access_token: await this.jwtService.signAsync(payload) };
    }

    async createFirstSuperUser(user:CreateUsersDto){
        if(user.userType!==UserRolesEnum.SUPER_ADMIN){
            throw new UnauthorizedException("Please check the user type carefully.")
        }

        const allUser = await this.userModel.find();
        if(allUser && allUser.length>0){
            throw new UnauthorizedException("Users already exist in the portal.")
        }

        try{
            const saltRounds = Math.floor((Math.random() * 10) + 1);
            user.password = await hash(user.password,saltRounds);
            const new_user = await this.userModel.create(user);
            await this.userRoleModel.create({fullName:UserRolesEnum.SUPER_ADMIN, shortName: UserRolesEnum.SUPER_ADMIN});
            await this.appPolicyModel.insertMany(DefaultPoliciesArray);
            return ({ message: "User created successfully", new_user })
        }
        catch(error){
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }
            throw new InternalServerErrorException();
        }
    }

}
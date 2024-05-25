import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRolesEnum } from 'src/dtos/create-user-roles.dto';
import { CreateUsersDto } from 'src/dtos/create-users.dto';
import { UpdateUsersDto } from 'src/dtos/update-users.dto';
import { USER_ROLES_MODEL, UserRolesDocument } from 'src/schemas/user-roles.schema';
import { USER_MODEL, UserDocument } from 'src/schemas/users.schema';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {

    constructor(@InjectModel(USER_MODEL) private userModel: Model<UserDocument>, @InjectModel(USER_ROLES_MODEL) private userRoleModel: Model<UserRolesDocument>){}

    async getAllUsers() {
        const users = await this.userModel.find();
        return users
    }

    async createNewUser(user: CreateUsersDto) {
        const isAlreadyExist = await this.userModel.findOne({emailId:user.emailId});
        if(isAlreadyExist){
            throw new BadRequestException("User already exist");
        }

        const isUserRoleExist = await this.userRoleModel.findOne({fullName:user.userType})
        if(!isUserRoleExist){
            throw new BadRequestException("User Role does not exist")
        }

        try{
            const saltRounds = Math.floor((Math.random() * 10) + 1);
            user.password = await hash(user.password,saltRounds);
            const new_user = await this.userModel.create(user);
            return ({ message: "User created successfully", new_user })
        }
        catch(error){
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }
            throw new InternalServerErrorException();
        }
    }

    async deleteUser(userId:string) {
        const superAdmin = await this.userModel.find({userType:UserRolesEnum.SUPER_ADMIN});
        const hasSuperAdmin = superAdmin.filter(user=>user.id!=userId).length;
        if(hasSuperAdmin==0){
            throw new UnauthorizedException("Atleast one Super Admin is required");
        }
        const deletedUser = await this.userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new NotFoundException("User not found");
        }
        return {message:"User deleted successfully"};
    }

    async updateUser(userId:string, user:UpdateUsersDto) {
        if(user?.emailId){
            const isAlreadyExist = (await this.userModel.find({},{emailId:user.emailId}))?.filter(user=>user.id!=userId);
            if(isAlreadyExist && isAlreadyExist.length>0){
                throw new BadRequestException("User already exist");
            }
        }

        if(user?.userType){
            const isUserRoleExist = await this.userRoleModel.findOne({fullName:user.userType})
            if(!isUserRoleExist){
                throw new BadRequestException("User Role does not exist")
            }
        }

        if(user?.password){
            const saltRounds = Math.floor((Math.random() * 10) + 1);
            user.password = await hash(user.password,saltRounds);
        }

        const updateUser = await this.userModel.findByIdAndUpdate(userId,user);
        if (!updateUser) {
            throw new NotFoundException("User not found");
        }
        return {message:"User updated successfully"};
    }
}
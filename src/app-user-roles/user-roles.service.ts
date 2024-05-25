import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserRolesDto, UserRolesEnum } from "src/dtos/create-user-roles.dto";
import { UpdateUserRolesDto } from "src/dtos/update-user-roles.dto";
import { USER_ROLES_MODEL, UserRolesDocument } from "src/schemas/user-roles.schema";

@Injectable()
export class UserRolesService {
    constructor(@InjectModel(USER_ROLES_MODEL) private userRolesModel:Model<UserRolesDocument>){}

    async getAllUserRoles(){
        const userRoles = await this.userRolesModel.find();
        return userRoles
    }

    async createNewRole(userRole: CreateUserRolesDto) {
        const isAlreadyExist = await this.userRolesModel.findOne({fullName:userRole.fullName, shortName: userRole.shortName})
        if(isAlreadyExist){
            throw new BadRequestException("User Role already exist");
        }
        try{
            const newUserRole = await this.userRolesModel.create(userRole);
            return ({ message: "User Role created successfully", newUserRole })
        }
        catch(error){
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }
            throw new InternalServerErrorException();
        }
    }

    async deleteUserRole(userRoleName:string) {
        if(userRoleName==UserRolesEnum.SUPER_ADMIN){
            throw new UnauthorizedException("Super Admin cannot be deleted.");
        }
        const deletedUserRole = await this.userRolesModel.findOneAndDelete({fullName:userRoleName});
        if (!deletedUserRole) {
            throw new NotFoundException("User Role not found");
        }
        return {message:"User Role deleted successfully"};
    }

    async updateUserRole(userRoleId:string, userRole:UpdateUserRolesDto){
        if(userRole?.fullName){
            const isNameExist = (await this.userRolesModel.find({fullName:userRole.fullName}))?.filter(role=>role.id!=userRoleId);
            if(isNameExist && isNameExist.length>0){
                throw new BadRequestException("User Role already exist");
            }
        }
        if(userRole?.shortName){
            const isShortNameExist = (await this.userRolesModel.find({shortName:userRole.shortName}))?.filter(role=>role.id!=userRoleId);
            if(isShortNameExist && isShortNameExist.length>0){
                throw new BadRequestException("User Role already exist");
            }
        }

        const updateUserRole = await this.userRolesModel.findByIdAndUpdate(userRoleId,userRole)
        if (!updateUserRole) {
            throw new NotFoundException("User Role not found");
        }
        
        return {message:"User Role updated successfully"};
    }

}
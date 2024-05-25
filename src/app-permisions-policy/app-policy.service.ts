import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DefaultPolicies } from "src/auth/auth.const";
import { CreateAppPolicyDto } from "src/dtos/create-app-policy.dto";
import { UpdateAppPolicyDto } from "src/dtos/update-app-policy.dto";
import { APP_POLICY_MODEL, AppPolicyDocument } from "src/schemas/app-policy.schema";
import { USER_ROLES_MODEL, UserRolesDocument } from "src/schemas/user-roles.schema";

@Injectable()
export class AppPolicyService{

    constructor(@InjectModel(APP_POLICY_MODEL) private appPolicyModel:Model<AppPolicyDocument>, @InjectModel(USER_ROLES_MODEL) private userRolesModel:Model<UserRolesDocument>){}

    async getAllPermissionPolicies(){
        return await this.appPolicyModel.find({},"+attachedRole");
    }

    async getPoliciesByRoleName(userRole:string){
        const policies = await this.appPolicyModel.find({attachedRole:userRole});
        if(!policies){
            throw new BadRequestException("No Policies found for the given Role");
        }
        return policies;
    }

    async createNewAppPolicies(policy:CreateAppPolicyDto){
        if((Object.values(DefaultPolicies)).includes(policy.name.toLowerCase())){
            throw new BadRequestException("You cannot create a policy with default policy name");
        }

        const isAlreadyExist = await this.appPolicyModel.findOne({name:policy.name});
        if(isAlreadyExist){
            throw new BadRequestException("Permission Policy already exist");
        }

        const allRoles = (await this.userRolesModel.find()).map(role=>role.fullName);
        const isRoleExist = policy.attachedRole.filter((role:string)=>!allRoles.includes(role));
        if(isRoleExist && isRoleExist.length>0){
            throw new BadRequestException("User Roles are not valid for this policy")
        }
        
        const newPolicy = await this.appPolicyModel.create(policy);
        return {message:"Policy created successfully",newPolicy}
    }

    async deleteAppPolicy(policyId:string){
        const policy = await this.appPolicyModel.findById(policyId);
        if(!policy){
            throw new NotFoundException("Permission Policy not found")
        }

        if((Object.values(DefaultPolicies)).includes(policy.name.toLowerCase())){
            throw new BadRequestException("You cannot delete a default policy");
        }

        return {message:"Policy deleted successfully"}
    }

    async updateAppPolicy(policyId:string,policy:UpdateAppPolicyDto){
        const isAlreadyExist = (await this.appPolicyModel.find({name:policy.name}))?.filter(policy=>policy.id!=policyId);
        if(isAlreadyExist && isAlreadyExist.length>0){
            throw new BadRequestException("Permission Policy already exist");
        }

        if((Object.values(DefaultPolicies)).includes(policy?.name.toLowerCase())){
            throw new BadRequestException("You cannot update a default policy");
        }

        if(policy?.attachedRole){
            const policies = await this.appPolicyModel.findOne({attachedRole:policy.attachedRole});
            if(!policies){
                throw new BadRequestException("User Roles for this policy are invalid");
            }
        }

        const newPolicy = await this.appPolicyModel.findByIdAndUpdate(policyId,policy);
        if(!newPolicy){
            throw new NotFoundException("Permission Policy not found");
        }

        return {message: "Permission Policy updated successfully"}
    }
}
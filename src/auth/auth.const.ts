import { CreateAppPolicyDto } from "src/dtos/create-app-policy.dto"
import { UserRolesEnum } from "src/dtos/create-user-roles.dto"

export enum ScopeEnum{
    READ = "READ",
    UPDATE = "UPDATE",
    CREATE = "CREATE",
    DELETE = "DELETE"
}

export enum Modules{
    USERS = "USERS",
    ROLES = "ROLES",
    POLICIES = "POLICIES"
}

export const DefaultPolicies:{[key:string]:string} = {
    "USERS" : "users-default",
    "ROLES" : "roles-default",
    "POLICIES" : "policy-default"
}

export const DefaultPoliciesArray:CreateAppPolicyDto[] = [
    {
        name: DefaultPolicies.USERS, 
        functional_module: Modules.USERS, 
        scopes:[ScopeEnum.CREATE, ScopeEnum.READ, ScopeEnum.UPDATE, ScopeEnum.DELETE], 
        attachedRole:[UserRolesEnum.SUPER_ADMIN]
    },
    {
        name: DefaultPolicies.ROLES, 
        functional_module: Modules.ROLES, 
        scopes:[ScopeEnum.CREATE, ScopeEnum.READ, ScopeEnum.UPDATE, ScopeEnum.DELETE], 
        attachedRole:[UserRolesEnum.SUPER_ADMIN]
    },
    {
        name: DefaultPolicies.POLICIES, 
        functional_module: Modules.POLICIES, 
        scopes:[ScopeEnum.CREATE, ScopeEnum.READ, ScopeEnum.UPDATE, ScopeEnum.DELETE], 
        attachedRole:[UserRolesEnum.SUPER_ADMIN]
    }
]
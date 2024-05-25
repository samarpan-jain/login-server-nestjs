import { Body, Controller, Delete, Get, Param, Post, Put, Query, SetMetadata, UseGuards } from "@nestjs/common";
import { AppPolicyService } from "./app-policy.service";
import { CreateAppPolicyDto } from "src/dtos/create-app-policy.dto";
import { UpdateAppPolicyDto } from "src/dtos/update-app-policy.dto";
import { ActivateGuard } from "src/auth/auth-activate.guard";
import { Modules,ScopeEnum } from "src/auth/auth.const";

@UseGuards(ActivateGuard)
@Controller('app-policies')
export class AppPolicyController {
    constructor(private appPolicyService: AppPolicyService) { }

    @Get()
    @SetMetadata('permissions',{ [''+Modules.POLICIES] :ScopeEnum.READ})
    getAllPermissionPolicy() {
        return this.appPolicyService.getAllPermissionPolicies();
    }

    @Get('parameter')
    @SetMetadata('permissions',{ [''+Modules.POLICIES] :ScopeEnum.READ})
    getPolicyByRoleName(@Query('roleName') roleName: string) {
        return this.appPolicyService.getPoliciesByRoleName(roleName);
    }

    @Post('create')
    @SetMetadata('permissions',{ [''+Modules.POLICIES] :ScopeEnum.CREATE})
    createNewPermissionPolicy(@Body() policy: CreateAppPolicyDto) {
        return this.appPolicyService.createNewAppPolicies(policy);
    }

    @Put('update/:id')
    @SetMetadata('permissions',{ [''+Modules.POLICIES] :ScopeEnum.UPDATE})
    updatePermissionPolicy(@Param('id') policyId: string, @Body() policy: UpdateAppPolicyDto) {
        return this.appPolicyService.updateAppPolicy(policyId, policy)
    }

    @Delete('delete/:id')
    @SetMetadata('permissions',{ [''+Modules.POLICIES] :ScopeEnum.DELETE})
    deletePermissionPolicy(@Param('id') policyId: string){
        return this.appPolicyService.deleteAppPolicy(policyId);
    }
}
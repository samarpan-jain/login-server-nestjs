import { Module } from "@nestjs/common";
import { AppPolicyService } from "./app-policy.service";
import { AppPolicyController } from "./app-policy.controller";


@Module({
    controllers:[AppPolicyController],
    providers:[AppPolicyService]
})

export class AppPolicyModule{}
import { PartialType } from "@nestjs/mapped-types";
import { CreateAppPolicyDto } from "./create-app-policy.dto";

export class UpdateAppPolicyDto extends PartialType(CreateAppPolicyDto) { }
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { USER_MODEL, UserSchema } from "./users.schema";
import { USER_ROLES_MODEL, UserRolesSchema } from "./user-roles.schema";
import { APP_POLICY_MODEL, AppPolicySchema } from "./app-policy.schema";

const MODELS = 
[
    {name:USER_MODEL, schema: UserSchema},
    {name:USER_ROLES_MODEL, schema: UserRolesSchema},
    {name:APP_POLICY_MODEL, schema: AppPolicySchema}
]

@Global()
@Module({
    imports:[MongooseModule.forFeature(MODELS)],
    exports: [MongooseModule]
})
export class MongooseModelsModule {}
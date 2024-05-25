import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})

export class AppPermissionPolicies {

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    functional_module: string;

    @Prop({required:true, default:[]})
    scopes:string[];

    @Prop({ required: true, default: [], select: false })
    attachedRole: string[];

    @Prop({ required: false })
    description: string;
}

const schema = SchemaFactory.createForClass(AppPermissionPolicies);

export type AppPolicyDocument = AppPermissionPolicies & Document;
export const AppPolicySchema = schema;
export const APP_POLICY_MODEL = AppPermissionPolicies.name
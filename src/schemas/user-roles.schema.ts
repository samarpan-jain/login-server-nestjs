import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps:true
})

export class UserRoles{
    @Prop({required:true, unique:true})
    fullName:string;

    @Prop({required:true, unique:true})
    shortName:string;

    @Prop({required:false})
    description?:string;
}

const schema = SchemaFactory.createForClass(UserRoles);

export type UserRolesDocument = UserRoles & Document;
export const USER_ROLES_MODEL = UserRoles.name;
export const UserRolesSchema = schema;
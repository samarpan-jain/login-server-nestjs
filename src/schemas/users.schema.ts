import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps:true,
})

export class Users{    
    @Prop({required:true})
    name:string;

    @Prop({required:true, unique:true})
    emailId:string;

    @Prop({required:true, select:false})
    password:string;

    @Prop({required:true})
    userType:string;
}

const schema = SchemaFactory.createForClass(Users);

export type UserDocument = Users & Document;
export const USER_MODEL = Users.name;
export const UserSchema = schema;
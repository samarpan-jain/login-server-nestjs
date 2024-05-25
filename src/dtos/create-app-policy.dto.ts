import { ArrayMinSize, ArrayUnique, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Modules, ScopeEnum } from "src/auth/auth.const";



export class CreateAppPolicyDto{
    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsIn(Object.values(Modules))
    functional_module:string;

    @IsNotEmpty()
    @IsIn(Object.values(ScopeEnum),{each:true})
    scopes: ScopeEnum[];

    @ArrayMinSize(1)
    @ArrayUnique()
    @IsString({each:true})
    attachedRole: string[];

    @IsOptional()
    @IsString()
    description?: string;
}
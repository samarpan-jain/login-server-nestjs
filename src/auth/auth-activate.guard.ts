import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ActivateGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService, private reflector: Reflector) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new ForbiddenException();
    }

    const payload = await this.jwtService.verifyAsync(
      token,
      {
        secret: this.configService.get('JWT_SECRET')
      }
    );

    if (payload?.emailId && payload?.name && payload?.designation) {
      const permissions = this.reflector.get('permissions', context.getHandler());
      if (permissions && payload?.permissions && payload.permissions.length>0) {
        const requiredPolicies = payload?.permissions.filter((policy: any) => policy.functional_module == Object.keys(permissions)[0] && policy.scopes.includes(Object.values(permissions)[0]));
        if (requiredPolicies.length > 0) {
          //We're assigning the payload to the request object here so that we can access it in our route handlers
          request['userDetails'] = payload;
        }
        else {
          throw new ForbiddenException("Not authourize to perform this operation");
        }
      }
      else{
        throw new ForbiddenException("Not authourize to perform this operation");
      }
    }
    else {
      throw new ForbiddenException("Not a valid token");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  canActivate(context: ExecutionContext) {
    try {
      return super.canActivate(context);
    } catch (error) {
      return false; // Si une erreur se produit, renvoie false
    }
  }

  handleRequest(err, user, info) {
    if(err || !user){
      throw err || new UnauthorizedException()
    }
    return user
  }

}

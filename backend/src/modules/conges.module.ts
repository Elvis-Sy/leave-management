import { CongesController } from './../controllers/conges.controller';
import { CongesService } from './../services/conges.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/authorization/auth.guard';
import { RolesGuard } from 'src/auth/authorization/authorization.guard';

@Module({
    imports: [],
    controllers: [
        CongesController, ],
    providers: [
        CongesService, JwtAuthGuard, RolesGuard],
})
export class CongesModule { }

import { FerrierController } from './../controllers/ferrier.controller';
import { FerrierService } from './../services/ferrier.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/authorization/auth.guard';
import { RolesGuard } from 'src/auth/authorization/authorization.guard';

@Module({
    imports: [],
    controllers: [
        FerrierController,],
    providers: [
        FerrierService,JwtAuthGuard, RolesGuard],
})
export class FerrierModule { }

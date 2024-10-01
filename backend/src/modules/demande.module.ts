import { DemandeService } from './../services/demande.service';
import { DemandeController } from './../controllers/demande.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/authorization/auth.guard';
import { RolesGuard } from 'src/auth/authorization/authorization.guard';

@Module({
    imports: [],
    controllers: [
        DemandeController,],
    providers: [
        DemandeService, JwtAuthGuard, RolesGuard],
})
export class DemandeModule { }

import { DemandeService } from './../services/demande.service';
import { DemandeController } from './../controllers/demande.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        DemandeController,],
    providers: [
        DemandeService,],
})
export class DemandeModule { }

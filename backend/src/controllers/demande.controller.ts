/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Post, Param, Body, Patch, } from '@nestjs/common';
import { AddDemandeDto } from 'src/dto/demandeDto';
import { DemandeService } from 'src/services/demande.service';

@Controller('demandes')
export class DemandeController { 
    constructor(private readonly demandeService: DemandeService){}

    @Post('ajout')
    async ajoutEmploye(@Body() demandeDto: AddDemandeDto){
        try {
            await this.demandeService.addDemande(demandeDto);
            return {
                message: 'Demande envoyé avec succès.',
            };
        } catch (error) {
            console.error("Erreur lors de l'ajout':", error);
            return{
                message: "Erreur lors de la creation"
            }
        }
    }

 }

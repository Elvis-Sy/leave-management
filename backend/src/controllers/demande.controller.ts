/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Post, Param, Body, Patch, UseGuards, } from '@nestjs/common';
import { AddDemandeDto } from 'src/dto/demandeDto';
import { DemandeService } from 'src/services/demande.service';
import { JwtAuthGuard } from 'src/auth/authorization/auth.guard';
import { RolesGuard } from 'src/auth/authorization/authorization.guard';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { Role } from 'src/auth/authorization/roleEmploye.enum';

@Controller('demandes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DemandeController { 
    constructor(private readonly demandeService: DemandeService){}

    @Post('ajout')
    @Roles(Role.EMPLOYE)
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

    @Get('attente')
    @Roles(Role.EMPLOYE) //Admin
    async attenteDemande(){
        try {
            const demandes = await this.demandeService.listDemandeAttente();
            return {
                message: 'Demandes en attente listés avec succès.',
                demande: demandes
            };
        } catch (error) {
            console.error("Erreur lors du listage:", error);
            return{
                message: "Erreur lors du listage"
            }
        }
    }

    @Get('valid')
    @Roles(Role.EMPLOYE) //Admin
    async validDemande(){
        try {
            const demandes = await this.demandeService.validDemande();
            return {
                message: 'Demandes avec reponses listés avec succès.',
                demande: demandes
            };
        } catch (error) {
            console.error("Erreur lors du listage:", error);
            return{
                message: "Erreur lors du listage"
            }
        }
    }

    @Get('stats')
    @Roles(Role.EMPLOYE) //Admin
    async statistiqueDemande(){
        try {
            const demandes = await this.demandeService.statutDemande();
            return {
                message: 'Total des statuts listé avec succès.',
                demande: demandes
            };
        } catch (error) {
            console.error("Erreur lors du listage:", error);
            return{
                message: "Erreur lors du listage"
            }
        }
    }

    @Get('approbation')
    @Roles(Role.EMPLOYE) //Admin
    async tauxDemande(){
        try {
            const demandes = await this.demandeService.tauxDemande();
            return {
                message: 'Taux approbation calculé avec succès.',
                demande: demandes
            };
        } catch (error) {
            console.error("Erreur lors du calcul:", error);
            return{
                message: "Erreur lors du listage"
            }
        }
    }

    @Get('tendance')
    @Roles(Role.EMPLOYE) //Admin
    async TypeDemandeCount(){
        try {
            const demandes = await this.demandeService.tendanceDemande();
            return {
                message: 'Tendance des demandes listée avec succès.',
                demande: demandes
            };
        } catch (error) {
            console.error("Erreur lors de l'affichage:", error);
            return{
                message: "Erreur lors de l'affichage"
            }
        }
    }

 }

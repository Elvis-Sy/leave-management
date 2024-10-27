/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Post, Param, Body, Patch, UseGuards, Query, Request, } from '@nestjs/common';
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
    async ajoutDemande(@Body() demandeDto: AddDemandeDto){
        try {
            await this.demandeService.addDemande(demandeDto);
            return {
                message: 'Demande envoyé avec succès.',
            };
        } catch (error) {
            console.error("Erreur lors de l'ajout':", error);
            return{
                message: "Erreur lors de la creation",
                cause: error.message
            }
        }
    }

    @Get('attente')
    @Roles(Role.ADMIN) //Admin
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
    @Roles(Role.ADMIN) //Admin
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
    @Roles(Role.ADMIN) //Admin
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
    @Roles(Role.ADMIN) //Admin
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
    @Roles(Role.ADMIN) //Admin
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

    @Get('searchValid/:val')
    @Roles(Role.ADMIN)
    async validSearch(@Param('val') val: string){
        try {
            const demandes = await this.demandeService.searchValid(val);
            return {
                message: `Demandes listés avec succès avec ${val}.`,
                demande: demandes
            };
        } catch (error) {
            console.error("Erreur lors du listage:", error);
            return{
                message: "Erreur lors du listage"
            }
        }
    }

    @Get('searchAttente/:val')
    @Roles(Role.ADMIN)
    async AttenteSearch(@Param('val') val: string){
        try {
            const demandes = await this.demandeService.searchAttente(val);
            return {
                message: `Demandes listés avec succès avec ${val}.`,
                demande: demandes
            };
        } catch (error) {
            console.error("Erreur lors du listage:", error);
            return{
                message: "Erreur lors du listage"
            }
        }
    }

    @Get('validFiltre')
    @Roles(Role.ADMIN)
    async filtreValid(
        @Query('type') type?: string,
        @Query('dateDebut') dateDebut?: string,
        @Query('dateFin') dateFin?: string,
    ) {
        try {
            const demande = await this.demandeService.filtreValid(type, dateDebut, dateFin);
            return {
                message: "Confirmation réalisée avec succès",
                demande: demande
            }
        } catch (error) {
            console.error('Erreur de filtre:', error);
            return{
                message: error.message
            }
            
        }
    }

    @Get('attenteFiltre')
    @Roles(Role.ADMIN)
    async filtreAttente(
        @Query('type') type?: string,
        @Query('dateDebut') dateDebut?: string,
        @Query('dateFin') dateFin?: string,
    ) {
        try {
            const demande = await this.demandeService.filtreAttente(type, dateDebut, dateFin);
            return {
                message: "Confirmation réalisée avec succès",
                demande: demande
            }
        } catch (error) {
            console.error('Erreur de filtre:', error);
            return{
                message: error.message
            }
            
        }
    }

    @Patch('accept')
    @Roles(Role.ADMIN, Role.MANAGER)
    async accept(@Query('idDM') id: string, @Query('idUser') idEmploye?: string){
        try {
            await this.demandeService.acceptDM(parseInt(id), idEmploye);
            return {
                message: "Demande approuvee",
            }
        } catch (error) {
            console.error('Erreur d\'approbation:', error);
            return{
                message: error.message
            }
            
        }
    }

    @Patch('refuse')
    @Roles(Role.ADMIN, Role.MANAGER)
    async refuse(@Body() motif, @Query('idDM') id: string, @Query('idUser') idEmploye?: string){
        try {
            const motifRefus = motif.motif;
            await this.demandeService.refusDM(motifRefus, parseInt(id), idEmploye);
            return {
                message: "Demande refusee",
            }
        } catch (error) {
            console.error('Erreur de refus:', error);
            return{
                message: error.message
            }
            
        }
    }

    @Get('events')
    @Roles(Role.ADMIN)
    async actif(){
        try {
            const demande = await this.demandeService.CongeEvent();
            return {
                message: "Conge actif réalisé avec succès",
                demande: demande
            }
        } catch (error) {
            console.error('Erreur de filtre:', error);
            return{
                message: error.message
            }
            
        }
    }

    @Get('event/:id')
    @Roles(Role.ADMIN)
    async actifSub(@Param('id') id: string){
        try {
            const demande = await this.demandeService.CongeEventSub(parseInt(id));
            return {
                message: "Conge actif listé avec succès",
                demande: demande
            }
        } catch (error) {
            console.error('Erreur de filtre:', error);
            return{
                message: error.message
            }
            
        }
    }

    @Get('event/:id/employe')
    @Roles(Role.EMPLOYE) //Employe
    async actifSubEmp(@Param('id') id: string){
        try {
            const demande = await this.demandeService.CongeEventEmp(parseInt(id));
            return {
                message: "Conge actif listé avec succès",
                demande: demande
            }
        } catch (error) {
            console.error('Erreur de filtre:', error);
            return{
                message: error.message
            }
            
        }
    }

    @Get('congeFiltre')
    @Roles(Role.ADMIN) //Admin
    async filtreConge(
        @Query('etablissement') etablissement?: string,
    ) {
        try {
            const conge = await this.demandeService.filtreConge(etablissement);
            return {
                message: "Confirmation réalisée avec succès",
                demande: conge
            }
        } catch (error) {
            console.error('Erreur de filtre:', error);
            return{
                message: error.message
            }
            
        }
    }

    @Get('lastDemande/:id')
    @Roles(Role.EMPLOYE) //Employe
    async derniereDemande(@Param('id') id: string) {
        try {
            const conge = await this.demandeService.lastDemande(parseInt(id));
            return {
                message: "Dernière demande réalisée avec succès",
                demande: conge
            }
        } catch (error) {
            console.error('Erreur de filtre:', error);
            return{
                message: error.message
            }
            
        }
    }

    @Get('employeDM/:id')
    @Roles(Role.EMPLOYE) //Employe
    async dmEmploye(@Param('id') id: string) {
        try {
            const dm = await this.demandeService.employeDM(parseInt(id));
            return {
                message: "Dernière demande réalisée avec succès",
                demande: dm
            }
        } catch (error) {
            console.error('Erreur de filtre:', error);
            return{
                message: error.message
            }
            
        }
    }

    @Patch('annulee')
    @Roles(Role.EMPLOYE) //Employe
    async annuleDM(@Body() body){
        try {
            const idDemande = parseInt(body.idDemande)
            const userId = parseInt(body.userId)
            await this.demandeService.annulerDemande(idDemande, userId);
            return {
                message: "Demande annulée avec succès",
            }
        } catch (error) {
            console.error('Erreur de filtre:', error);
            return{
                message: error.message
            }
            
        }
    }

    @Get('soldeEmploye/:id')
    @Roles(Role.EMPLOYE) //Employe
    async soldeEmp(@Param('id') id: string){
        try {
            const solde = await this.demandeService.showSolde(parseInt(id));
            return {
                message: "Solde avec succès",
                demande: solde
            }
        } catch (error) {
            console.error('Erreur de solde:', error);
            return{
                message: error.message
            }
            
        }
    }

    @Patch('update/:id')
    @Roles(Role.EMPLOYE) //Employe
    async updateDM(@Param('id') id: string, @Body() dates){
        try {
            const dateDebut = dates.dateDebut
            const dateFin = dates.dateFin
            await this.demandeService.modifDate(parseInt(id), dateDebut, dateFin);
            return {
                message: "Demande modifiee",
            }
        } catch (error) {
            console.error('Erreur de solde:', error);
            return{
                message: error.message
            }
            
        }
    }


 }

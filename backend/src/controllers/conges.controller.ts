/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/authorization/auth.guard';
import { RolesGuard } from 'src/auth/authorization/authorization.guard';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { Role } from 'src/auth/authorization/roleEmploye.enum';
import { CongesService } from 'src/services/conges.service';

@Controller('conges')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CongesController { 
    constructor(private readonly congesService: CongesService){}

    @Post('ajout')
    @Roles(Role.ADMIN)
    async ajoutDemande(@Body() conge){
        try {
            const design = conge.designType;
            const nbr = conge.nbJours;
            await this.congesService.ajoutType(design, parseInt(nbr));
            return {
                message: 'Type conge ajouté avec succès.',
            };
        } catch (error) {
            console.error("Erreur lors de l'ajout':", error);
            return{
                message: "Erreur lors de la creation",
                cause: error.message
            }
        }
    }

    @Get('list')
    @Roles(Role.ADMIN)
    async listeType(){
        try {
            const type = await this.congesService.listType();
            return {
                message: 'Type conge liste avec succès.',
                type: type
            };
        } catch (error) {
            console.error("Erreur lors du listage:", error);
            return{
                message: "Erreur lors du listage",
                cause: error.message
            }
        }
    }

    @Patch('modif/:id')
    @Roles(Role.ADMIN)
    async Modif(@Param('id') id: string, @Body() conge){
        try {
            const design = conge.designType;
            const nbr = conge.nbJours;
            await this.congesService.updateType(parseInt(id), design, parseInt(nbr));
            return {
                message: 'Type conge modifié avec succès.',
            };
        } catch (error) {
            console.error("Erreur lors de la modification':", error);
            return{
                message: "Erreur lors de la modification",
                cause: error.message
            }
        }
    }

    @Delete('delete/:id')
    @Roles(Role.ADMIN)
    async supprimer(@Param('id') id: string){
        try {
            await this.congesService.suppressionType(parseInt(id));
            return {
                message: 'Suppression réussie',
            };
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            return{
                message: "Erreur lors de la suppression",
                cause: error.message
            }
        }
    }
 }

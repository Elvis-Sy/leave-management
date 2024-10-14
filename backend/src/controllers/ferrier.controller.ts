/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/authorization/auth.guard';
import { RolesGuard } from 'src/auth/authorization/authorization.guard';
import { Role } from 'src/auth/authorization/roleEmploye.enum';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { FerrierService } from 'src/services/ferrier.service';
import { FerrierDto } from 'src/dto/ferrierDto';

@Controller('ferrier')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FerrierController { 
    constructor(private readonly ferrierService: FerrierService){}

    @Post('ajout')
    @Roles(Role.ADMIN)
    async ajoutFerrier(@Body() ferrier: FerrierDto){
        try {
            const ferrie = await this.ferrierService.addFerrier(ferrier)
            return {
                message: 'Ajout d\'un jour ferrier avec succes',
                ferrie: ferrie
            }
        } catch (error) {
            console.log(error.message)
            return {
                message: 'Une erreur est survenu',
            }
        }
    }

    @Get('event')
    async afficheFerrie(){
        try {
            const ferrier = await this.ferrierService.getEvents()
            return {
                message: 'Listage des jours ferries',
                ferrie: ferrier
            }
        } catch (error) {
            console.log(error.message)
            return {
                message: 'Une erreur est survenu',
            }
        }
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    async suppFerrier(@Param('id') id: string){
        try {
            await this.ferrierService.deleteFerrier(parseInt(id))
            return {
                message: 'Jour ferrie supprime ave succes'
            }
        } catch (error) {
            console.log(error.message)
            return {
                message: 'Une erreur est survenu',
            }
        }
    }

    @Get('info/:id')
    async getInfo(@Param('id') id: string){
        try {
            const ferrie = await this.ferrierService.recupeInfo(parseInt(id))
            return {
                message: 'Jour ferrie recuperer ave succes',
                ferrie: ferrie
            }
        } catch (error) {
            console.log(error.message)
            return {
                message: 'Une erreur est survenu',
            }
        }
    }

    @Patch('modif/:id')
    async modifFerrier(@Param('id') id: string, @Body() ferrier: FerrierDto){
        try {
            await this.ferrierService.modifFerrier(parseInt(id), ferrier)
            return {
                message: 'Modification du jour ferrier avec succes',
            }
        } catch (error) {
            console.log(error.message)
            return {
                message: 'Une erreur est survenu',
            }
        }
    }
    

 }

/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, UseGuards } from '@nestjs/common';
import { OtherService } from './other.service';
import { JwtAuthGuard } from 'src/auth/authorization/auth.guard';
import { RolesGuard } from 'src/auth/authorization/authorization.guard';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { Role } from 'src/auth/authorization/roleEmploye.enum';

@Controller('details')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OtherController { 
    constructor(private readonly otherService: OtherService)  {}

    @Get('etablissement')
    async getEtab(){
        try {
            const etab = await this.otherService.allEtablissement()
            return {
                message: "Departement liste avec succes",
                etabi: etab
            }
        } catch (error) {
            return {
                message: "Erreur lors du listage des departement",
                cause: error
            }
        }
    }

    @Get('postes')
    async getPoste(){
        try {
            const postes = await this.otherService.allPoste()
            return {
                message: "Poste liste avec succes",
                poste: postes
            }
        } catch (error) {
            return {
                message: "Erreur lors du listage des postes",
                cause: error
            }
        }
    }

    @Get('types')
    async getType(){
        try {
            const types = await this.otherService.typeConge()
            return {
                message: "Type liste avec succes",
                type: types
            }
        } catch (error) {
            return {
                message: "Erreur lors du listage des types",
                cause: error
            }
        }
    }

    @Get('history')
    @Roles(Role.ADMIN)
    async getHistory(){
        try {
            const types = await this.otherService.history()
            return {
                message: "historique liste avec succes",
                type: types
            }
        } catch (error) {
            return {
                message: "Erreur lors du listage des historiques",
                cause: error
            }
        }
    }
 }

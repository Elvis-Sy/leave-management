/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get } from '@nestjs/common';
import { OtherService } from './other.service';

@Controller('details')
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
 }

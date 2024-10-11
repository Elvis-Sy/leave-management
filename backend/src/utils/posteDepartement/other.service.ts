/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OtherService { 
    constructor(private readonly prisma: PrismaService) {}

    async allEtablissement(){
        const etab = await this.prisma.etablissement.findMany({
            select: {
                idEtablissement: true,
                designEtablissement: true,
                section: true
            }
        })

        const etablissement = etab.map((item)=>{
            return {
                label: item.section == "Direction" ? `Direct. ${item.designEtablissement}` : `Dpt ${item.designEtablissement}`,
                value: item.idEtablissement
            }
        })

        return etablissement
    }

    async allPoste(){
        const poste = await this.prisma.postes.findMany({
            select: {
                idPoste: true,
                designPoste: true
            }
        })

        const postes = poste.map((item) =>{
            return {
                label: item.designPoste,
                value: item.idPoste
            }
        })

        return postes
    }

    async typeConge(){
        const types = await this.prisma.typesConges.findMany({
            select: {
                idType: true,
                designType: true
            }
        })

        const type = types.map((item) =>{
            return {
                label: item.designType,
                value: item.idType
            }
        })

        return type
    }
 }

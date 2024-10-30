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
                designType: true,
                nbJours: true
            }
        })

        const type = types.map((item) =>{
            return {
                label: item.designType,
                value: item.idType,
                duree: item.nbJours || 0
            }
        })

        return type
    }

    async history(){
        const historiques = await this.prisma.historiquesActions.findMany({
            include: {
                user: {
                    select: {
                        nom: true,
                        prenom: true,
                        sexe: true
                    }
                }
            },
            orderBy: {
                dateAction: 'desc'
            },
        })

        const audit = historiques.map((item)=>{
            return {
                id: item.idHistorique,
                action: item.typeAction,
                niveau: item.niveau,
                date: item.dateAction,
                responsable: item.user ? item.user.prenom ? item.user.prenom : item.user.nom : null,
                genre: item.user ? item.user.sexe : null,
                ancienne: item.ancienneValeur,
                nouvelle: item.nouvelleValeur
            }
        })

        return audit
    }

    async filtreHistory(typeAction: string | undefined, dateDebut: string | undefined, dateFin: string | undefined){
        try {
          
          const whereClause: any = {};
      
          // Filtrer par établissement si fourni
          if (typeAction) {
            whereClause.typeAction = typeAction;
          }
      
          // Vérification et inversion si la dateDebut est après la dateFin
          if (dateDebut && dateFin) {
            const startDate = new Date(dateDebut);
            const endDate = new Date(dateFin);
      
            if (startDate > endDate) {
              // Inverser les dates si dateDebut est après dateFin
              whereClause.dateAction = {
                gte: endDate,  
                lte: startDate,
              };
            } else {
              // Dates correctes, pas besoin d'inverser
              whereClause.dateAction = {
                gte: startDate,
                lte: endDate,
              };
            }
          }
      
          // Requête Prisma avec les conditions dynamiques
          const historiques = await this.prisma.historiquesActions.findMany({
            where: whereClause,
            orderBy: {
                dateAction: 'desc'
            },
            include: {
                user: {
                    select: {
                        nom: true,
                        prenom: true,
                        sexe: true
                    }
                }
            }
        })
  
        const audit = historiques.map((item)=>{
            return {
                id: item.idHistorique,
                action: item.typeAction,
                niveau: item.niveau,
                date: item.dateAction,
                responsable: item.user ? item.user.prenom ? item.user.prenom : item.user.nom : null,
                genre: item.user ? item.user.sexe : null,
                ancienne: item.ancienneValeur,
                nouvelle: item.nouvelleValeur
            }
        })

        return audit
        } catch (error) {
          console.error('Erreur lors de la requête Prisma:', error);
          throw error;
        }
      }
 }

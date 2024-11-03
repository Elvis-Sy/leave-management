/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CongesService {
    constructor(private readonly prisma: PrismaService,){}

    //Ajout type conge
    async ajoutType(designType: string, nbJours: number){
        const newType = await this.prisma.typesConges.create({
            data: {
                designType,
                nbJours,
            },
        });

        // Récupération des employés existants
        const employes = await this.prisma.employes.findMany({
            where: {
                compte: {
                    password: {
                        not: null
                    }
                }
            }
        });

        // Création d'un solde pour chaque employé pour le nouveau type de congé
        await Promise.all(employes.map(employe => 
            this.prisma.soldesConges.create({
                data: {
                    idEmp: employe.idEmploye,
                    idType: newType.idType,
                    soldeTotal: 0,
                },
            })
        ));
    }

    //Listage conge
    async listType(){
        const type = await this.prisma.typesConges.findMany()

        const conge = type.map((conge)=>{
            return {
                id: conge.idType,
                designType: conge.designType,
                nbJours: conge.nbJours
            }
        })

        return conge;
    }

    //Modification
    async updateType(idType: number, designType: string, nbJours: number){
        await this.prisma.typesConges.update({
            where: {
                idType
            },
            data: {
                designType,
                nbJours,
            },
        })
    }

    async suppressionType(idType: number) {
        // Suppression des soldes associés au type de congé
        await this.prisma.soldesConges.deleteMany({
            where: { idType }
        });
    
        // Suppression du type de congé
        await this.prisma.typesConges.delete({
            where: { idType }
        });
    }
}

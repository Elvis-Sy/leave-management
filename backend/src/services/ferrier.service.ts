/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { FerrierDto } from 'src/dto/ferrierDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FerrierService { 
    constructor(private readonly prisma: PrismaService,){}

    //Ajouter jours ferriers
    async addFerrier(ferrier: FerrierDto){
        const {dateFeriee, label, description} = ferrier 
        const ferrie = await this.prisma.jourFerries.create({
            data: {
                dateFeriee,
                label,
                description
            }
        })

        const dm = await this.prisma.demandesConges.findMany({
            where: {
                dateDebut: {
                    lte: dateFeriee
                },
                dateFin: {
                    gte: dateFeriee
                }
            }
        })

        if(dm.length > 0){
            const demandeId = dm.map(d => d.idDemande)
            await this.prisma.$transaction(
                demandeId.map(id => 
                  this.prisma.demandesConges.update({
                    where: { idDemande: id },
                    data: {
                      ferries: {
                        connect: { idJour: ferrie.idJour }
                      }
                    }
                  })
                )
            );
        }

        return ferrie
    }

    //Afficher les jours ferries
    async getEvents() {

        // Récupérer tous les jours fériés
        const holidays = await this.prisma.jourFerries.findMany();

        // Mapper les jours fériés en un tableau d'événements
        const events = holidays.map(holiday => ({
            id: holiday.idJour,
            title: holiday.label,
            start: new Date(holiday.dateFeriee),
            end: new Date(holiday.dateFeriee), // Pour les jours fériés, la date de fin est la même que la date de début
            allDay: true ,
            description: holiday.description
        }));

        return events;

    }

    //Supprimer jour ferrier
    async deleteFerrier(idJour: number){
        await this.prisma.$transaction(async (prisma) => {
            //Récupérer les demandes de congé liées
            const demandes = await prisma.demandesConges.findMany({
                where: {
                    ferries: {
                        some: {
                            idJour: idJour, // Condition pour trouver les demandes liées à ce jour férié
                        },
                    },
                },
            });

            //Déconnecter le jour férié de chaque demande de congé
            for (const demande of demandes) {
                await prisma.demandesConges.update({
                    where: { idDemande: demande.idDemande },
                    data: {
                        ferries: {
                            disconnect: { idJour: idJour }, // Déconnecter le jour férié
                        },
                    },
                });
            }

            //Supprimer le jour férié
            await prisma.jourFerries.delete({
                where: {
                    idJour,
                },
            });
        });
    }

    //Recuperer info
    async recupeInfo(idJour: number){
        const info = await this.prisma.jourFerries.findUnique({
            where: {
                idJour
            }
        })

        return info
    }

    //Modifier
    async modifFerrier(idJour: number, ferrier: FerrierDto){
        const {label, description} = ferrier;

        await this.prisma.jourFerries.update({
            where: {
                idJour
            }, 
            data: {
                label,
                description
            }
        })
    }


 }

/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { AddDemandeDto } from 'src/dto/demandeDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DemandeService {
    constructor(private readonly prisma: PrismaService,){}

    //Ajout demandes
    async addDemande(demandeDto: AddDemandeDto){
        const { employeId, typeId, statutId, ...demande } = demandeDto;

        const existingDemande = await this.prisma.demandesConges.findFirst({
            where: {
                employeId: employeId,
                OR: [
                    { statuts: { designStatut: 'En attente' } },
                ],
            },
        });

        if (existingDemande) {
            throw new Error('L\'employé a déjà une demande de congé en cours.');
        }

        await this.prisma.demandesConges.create({
            data: {
                ...demande,
                employe: { connect: { idEmploye: employeId } },
                type: { connect: { idType: typeId } },
                statuts: { connect: { idStatut: statutId } }
            },
        });
    }

    //Listage des demandes en attente
    async listDemandeAttente(){
        const demande = await this.prisma.demandesConges.findMany({
            select: {
                dateDebut: true,
                dateFin: true,
                dateEnvoie: true,
                employe: {
                  select: {
                    nom: true,
                    prenom: true,
                    poste: {
                      select: {
                        designPoste: true
                      }
                    },
                  }
                },
                type: {
                    select: {
                        designType: true
                    }
                }
            },
            where: {
                statuts: {
                    designStatut: 'En attente'  // Filtre les demandes avec le statut "En attente"
                }
            }
        })

        demande.forEach(dm =>{
            const diffTime = Math.abs(new Date(dm.dateFin).getTime() - new Date(dm.dateDebut).getTime() + 1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            (dm as any).nbrJours = diffDays;
        })


        return demande;
    }

    //Listage des demandes validées
    async validDemande(){
        const demande = await this.prisma.demandesConges.findMany({
            select: {
                dateDebut: true,
                dateFin: true,
                dateConfirmation: true,
                dateEnvoie: true,
                employe: {
                  select: {
                    nom: true,
                    prenom: true,
                    poste: {
                      select: {
                        designPoste: true
                      }
                    },
                    manager: {
                        select: {
                            nom: true,
                            prenom: true,
                        }
                    }
                  }
                },
                statuts: {
                    select: {
                        designStatut: true
                    }
                },
                type: {
                    select: {
                        designType: true
                    }
                }
            },
            where: {
                statuts: {
                    designStatut: {
                        not: "En attente"
                    }
                }
            }
        })

        demande.forEach(dm =>{
            const diffTime = Math.abs(new Date(dm.dateFin).getTime() - new Date(dm.dateDebut).getTime() + 1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            (dm as any).nbrJours = diffDays;

            delete dm.dateDebut;
            delete dm.dateFin;
        })

        return demande;

    }

    //Statistiques donnees (approuvee, en attente, etc...)
    async statutDemande(){
        const Count = this.prisma.demandesConges.groupBy({
            by: ['statutId'],
            _count: {
                statutId: true
            }
        })

        //Stocker les comptes
        const total = (await Count).reduce((acc, curr) => {
            acc[`count${curr.statutId}`] = curr._count.statutId;
            return acc;
        }, {});

        return total;
    }

    //Taux d'approbation
    async tauxDemande(){
        const Count = this.prisma.demandesConges.groupBy({
            by: ['statutId'],
            _count: {
                statutId: true
            },
            where: {
                statuts: {
                    OR: [
                        { designStatut: "Refusee" },
                        { designStatut: "Approuvee" }
                    ]
                }
            }
        })

        //Stocker les comptes
        const total: { [key: string]: number } = (await Count).reduce((acc, curr, i) => {
            acc[`${i+1}`] = curr._count.statutId;
            return acc;
        }, {});

        //Somme
        const totalCount = Object.values(total).reduce((sum, value) => sum + value, 0);
        //Pourcentage
        const refus = (total[1] / totalCount) * 100;
        const accord = (total[2] / totalCount) * 100;

        const taux = { "refus": total[1], "tauxRefus": refus.toFixed(1), "accord": total[2], "tauxAccord": accord.toFixed(1) }

        return taux;
    }

    //Type de conge (Tendance)
    async tendanceDemande(){
        const result = await this.prisma.demandesConges.groupBy({
            by: ['typeId', 'dateEnvoie'],
            _count: {
                idDemande: true, // Compte le nombre de demandes
            },
            where: {
                dateEnvoie: {
                    not: null,
                },
            },
            orderBy: {
                dateEnvoie: 'asc', // Ordre croissant par date d'envoi
            }
        });
        
        // Fonction pour formater le mois et l'année
        const formatDate = (date: Date) => {
            const options = { year: 'numeric', month: 'short' } as const; // Utilisez 'as const' pour des types littéraux
            return new Intl.DateTimeFormat('fr-FR', options).format(date);
        };

        // Récupération de tous les type de conge disponibles
        const allTypes = await this.prisma.typesConges.findMany({
            select: {
                idType: true,
            }
        });
        const typeIds = allTypes.map(type => type.idType);

        // Génération de tous les mois de l'année
        const generateAllMonths = (year: number) => {
            const months = {};
            for (let month = 0; month < 12; month++) {
                const date = new Date(year, month);
                const formattedDate = formatDate(date);
                months[formattedDate] = {}; // Initialise chaque mois
            }
            return months;
        };

        const currentYear = new Date().getFullYear();
        const allMonths = generateAllMonths(currentYear);

        // Transformation pour obtenir le mois et le type de congé
        const groupedByMonthAndType = result.reduce((acc, curr) => {
            const date = new Date(curr.dateEnvoie);
            const formattedDate = formatDate(date); // Formate en "Jan 2024"

            if (!acc[formattedDate]) {
                acc[formattedDate] = {};
            }

            const typeId = curr.typeId;
            if (!acc[formattedDate][typeId]) {
                acc[formattedDate][typeId] = 0;
            }

            acc[formattedDate][typeId] += curr._count.idDemande;

            return acc;
        }, allMonths);

        // Initialisation des totaux à 0 pour chaque type de conges manquant dans chaque mois
        for (const month in groupedByMonthAndType) {
            typeIds.forEach(typeId => {
                if (!(typeId in groupedByMonthAndType[month])) {
                    groupedByMonthAndType[month][typeId] = 0; // Ajoute le typeId avec un total de 0
                }
            });
        }

        return groupedByMonthAndType;
    }

}

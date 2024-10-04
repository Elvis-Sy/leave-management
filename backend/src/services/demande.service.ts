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

        // Récupérer tous les statuts possibles
        const statuts = await this.prisma.statutDemande.findMany();

        const Count = this.prisma.demandesConges.groupBy({
            by: ['statutId'],
            _count: {
                statutId: true
            }
        })

        // Créer un objet pour stocker les comptes, initialisé à 0
        const total = {};
        statuts.forEach(statut => {
            total[`count${statut.idStatut}`] = 0; // Initialise chaque statut à 0
        });

        // Remplir les comptes avec les résultats de groupBy
        (await Count).forEach(curr => {
            total[`count${curr.statutId}`] = curr._count.statutId;
        });

        return total;
    }

    //Taux d'approbation
    async tauxDemande() {

        // Récupérer tous les statuts necessaires
        const statuts = await this.prisma.statutDemande.findMany({
            where: {
                OR: [
                    { designStatut: "Refusee" },
                    { designStatut: "Approuvee" }
                ]
            }
        });
    
        // Grouper les demandes par statut
        const count = await this.prisma.demandesConges.groupBy({
            by: ['statutId'],
            _count: {
                statutId: true
            },
            where: {
                statutId: {
                    in: statuts.map(statut => statut.idStatut) // Filtrer par les ID des statuts trouvés
                }
            }
        });
    
        // Créer un objet pour stocker les comptes, initialisé à 0
        const totalInit: { [key: string]: number } = {};
        statuts.forEach(statut => {
            totalInit[`count${statut.idStatut}`] = 0;
        });

    
        // Remplir les comptes avec les résultats de groupBy
        count.forEach(curr => {
            totalInit[`count${curr.statutId}`] = curr._count.statutId;
        });
    
        // Stocker les comptes
        const total = totalInit;
    
        const totalCount = Object.values(total).reduce((sum: number, value: number) => sum + value, 0);
        
        // Initialiser les pourcentages à 0
        const refus = total[`count${statuts[0]?.idStatut}`] ? (total[`count${statuts[0]?.idStatut}`] / totalCount) * 100 : 0;
        const accord = total[`count${statuts[1]?.idStatut}`] ? (total[`count${statuts[1]?.idStatut}`] / totalCount) * 100 : 0;
    
        const taux = { 
            "refus": total[`count${statuts[0]?.idStatut}`] || 0, // Utiliser || pour éviter undefined
            "tauxRefus": refus.toFixed(1), 
            "accord": total[`count${statuts[1]?.idStatut}`] || 0, // Utiliser || pour éviter undefined
            "tauxAccord": accord.toFixed(1) 
        };
    
        return taux;
    }

    //Type de conge (Tendance)
    async tendanceDemande(){
        const result = await this.prisma.demandesConges.groupBy({
            by: ['typeId', 'dateEnvoie'],
            _count: {
                idDemande: true,
            },
            where: {
                dateEnvoie: {
                    not: null,
                },
            },
            orderBy: {
                dateEnvoie: 'asc',
            }
        });
    
        const formatDate = (date: Date) => {
            const options = { year: 'numeric', month: 'short' } as const;
            return new Intl.DateTimeFormat('fr-FR', options).format(date);
        };
    
        // Récupère dynamiquement tous les types de congés disponibles
        const allTypes = await this.prisma.typesConges.findMany({
            select: {
                idType: true,
                designType: true,
            }
        });
    
        const typeIdToNameMap = allTypes.reduce((acc, curr) => {
            acc[curr.idType] = curr.designType.toLowerCase(); // Crée dynamiquement la clé pour chaque type
            return acc;
        }, {});
    
        const currentYear = new Date().getFullYear();
        
        // Génère tous les mois avec des propriétés dynamiques pour chaque type de congé
        const generateAllMonths = (year: number, types: string[]) => {
            const months = [];
            for (let month = 0; month < 12; month++) {
                const date = new Date(year, month);
                const formattedDate = formatDate(date).split(' ')[0]; // Mois abrégé
                
                // Initialise un objet pour chaque mois avec les types de congés dynamiques
                const monthObj: any = { name: formattedDate };
                types.forEach(type => {
                    monthObj[type] = 0; // Initialise chaque type avec 0
                });
    
                months.push(monthObj);
            }
            return months;
        };
    
        // Extraire tous les types de congé dynamiques (paye, maladie, etc.)
        const allTypeNames = allTypes.map(type => type.designType.toLowerCase());
        const allMonths = generateAllMonths(currentYear, allTypeNames);
    
        // Transformation pour remplir les données mensuelles
        result.forEach(curr => {
            const date = new Date(curr.dateEnvoie);
            const formattedDate = formatDate(date).split(' ')[0]; // Mois abrégé
    
            const monthData = allMonths.find(m => m.name === formattedDate);
            const typeName = typeIdToNameMap[curr.typeId];
    
            if (monthData && typeName) {
                monthData[typeName] += curr._count.idDemande;
            }
        });
    
        return allMonths;
    }

}

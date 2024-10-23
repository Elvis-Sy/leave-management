/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { AddDemandeDto } from 'src/dto/demandeDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DemandeService {
    constructor(private readonly prisma: PrismaService,){}

    //Ajout demandes
    async addDemande(demandeDto: AddDemandeDto){
        const { employeId, typeId, statutId, ...demande } = demandeDto;

        const dateDebut = demande.dateDebut;
        const dateFin = demande.dateFin;

        const essai = await this.prisma.employes.findFirst({
            where: {
                idEmploye: employeId,
                periodeEssai: true
            }
        })

        if(essai) throw new Error('Vous êtes encore en pérode d\'essai.');

        const existingDemande = await this.prisma.demandesConges.findFirst({
            where: {
                employeId: employeId,
                OR: [
                    { statuts: { designStatut: 'En attente' } },
                ],
            },
        });

        if (existingDemande) {
            throw new Error('Vous avez déjà une demande de congé en cours.');
        }

        const startDate = new Date(dateDebut);
        const endDate = new Date(dateFin);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Ajouter 1 pour inclure le dernier jour

        // Vérifier le solde de congés payés
        const soldeConges = await this.prisma.soldesConges.findFirst({
            where: {
                idEmp: employeId,
                type: {
                    designType: 'Paye',
                },
            },
        });

        if (!soldeConges || soldeConges.soldeTotal.toNumber() < diffDays) {
            throw new Error('Le solde de congés payés est insuffisant pour cette demande.');
        }

        await this.prisma.demandesConges.create({
            data: {
                ...demande,
                employe: { connect: { idEmploye: employeId } },
                type: { connect: { idType: typeId } },
            },
        });
    }

    //Listage des demandes en attente
    async listDemandeAttente(){
        const demande = await this.prisma.demandesConges.findMany({
            select: {
                idDemande: true,
                dateDebut: true,
                dateFin: true,
                dateEnvoie: true,
                employe: {
                  select: {
                    nom: true,
                    prenom: true,
                    photoProfile: true,
                    etablissement: {
                        select: {
                            designEtablissement: true,
                            section: true
                        }
                    }
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

        let nbrJours = 0;

        demande.forEach(dm =>{
            const diffTime = Math.abs(new Date(dm.dateFin).getTime() - new Date(dm.dateDebut).getTime() + 1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            nbrJours = diffDays;
        })

        const dm = demande.map((demande, index) => ({
            id: demande.idDemande,
            dateEnvoi: new Date(demande.dateEnvoie).toLocaleDateString('fr-FR'),
            name: demande.employe.prenom ? `${demande.employe.prenom}`.trim() : `${demande.employe.nom}`.trim(),
            photo: demande.employe.photoProfile || 'avatar.png',
            etablissement: demande.employe.etablissement.section == "Departement" ? `Dpt ${demande.employe.etablissement.designEtablissement}` : demande.employe.etablissement.designEtablissement,
            type: demande.type.designType,
            nbrJrs: nbrJours,  // Nombre de jours
            dateDebut: new Date(demande.dateDebut).toLocaleDateString('fr-FR'),  // Formater la date de début
            dateFin: new Date(demande.dateFin).toLocaleDateString('fr-FR')  // Formater la date de fin
        }));


        return dm;
    }

    //Listage des demandes validées
    async validDemande(){
        const demande = await this.prisma.demandesConges.findMany({
            select: {
                idDemande: true,
                dateDebut: true,
                dateFin: true,
                dateConfirmation: true,
                dateEnvoie: true,
                employe: {
                  select: {
                    nom: true,
                    prenom: true,
                    photoProfile: true,
                    etablissement: {
                        select: {
                            designEtablissement: true,
                            section: true
                        }
                    },
                    manager: {
                        select: {
                            nom: true,
                            prenom: true,
                            photoProfile: true
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

        let nbrJours = 0;

        demande.forEach(dm =>{
            const diffTime = Math.abs(new Date(dm.dateFin).getTime() - new Date(dm.dateDebut).getTime() + 1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            nbrJours = diffDays;

            delete dm.dateDebut;
            delete dm.dateFin;
        })

        const dm = demande.map((demande) => ({
            id: demande.idDemande,
            dateEnvoi: new Date(demande.dateEnvoie).toLocaleDateString('fr-FR'),
            dateConf: new Date(demande.dateConfirmation).toLocaleDateString('fr-FR'),
            name: demande.employe.prenom ? `${demande.employe.prenom}`.trim() : `${demande.employe.nom}`.trim(),
            photo: demande.employe.photoProfile ? demande.employe.photoProfile : 'avatar.png',
            photoManager: demande.employe.manager ? demande.employe.manager.photoProfile ? demande.employe.manager.photoProfile : 'avatar.png' : 'avatar.png',
            etablissement: demande.employe.etablissement.section == "Departement" ? `Dpt ${demande.employe.etablissement.designEtablissement}` : demande.employe.etablissement.designEtablissement,
            manager: demande.employe.manager ? demande.employe.manager.prenom ? `${demande.employe.manager.prenom}` : `${demande.employe.manager.nom}`.trim() : null,
            type: demande.type.designType,
            statut: demande.statuts.designStatut,
            nbrJrs: nbrJours,
        }));

        return dm;

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
        const accord = total[`count${statuts[0]?.idStatut}`] ? (total[`count${statuts[0]?.idStatut}`] / totalCount) * 100 : 0;
        const refus = total[`count${statuts[1]?.idStatut}`] ? (total[`count${statuts[1]?.idStatut}`] / totalCount) * 100 : 0;
    
        const taux = { 
            "refus": total[`count${statuts[1]?.idStatut}`] || 0, // Utiliser || pour éviter undefined
            "tauxRefus": refus.toFixed(1), 
            "accord": total[`count${statuts[0]?.idStatut}`] || 0, // Utiliser || pour éviter undefined
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

    //Recherche
    async searchValid(val: string){
        const demande = await this.prisma.demandesConges.findMany({
            select: {
                idDemande: true,
                dateDebut: true,
                dateFin: true,
                dateConfirmation: true,
                dateEnvoie: true,
                employe: {
                  select: {
                    nom: true,
                    prenom: true,
                    photoProfile: true,
                    etablissement: {
                        select: {
                            designEtablissement: true,
                            section: true
                        }
                    },
                    manager: {
                        select: {
                            nom: true,
                            prenom: true,
                            photoProfile: true
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
                employe: {
                    OR: [
                        { nom: { contains: val } },
                        { prenom: { contains: val } }
                    ]
                },
                statuts: {
                    designStatut: {
                        not: "En attente"
                    }
                }
            }
        })

        

        let nbrJours = 0;

        demande.forEach(dm =>{
            const diffTime = Math.abs(new Date(dm.dateFin).getTime() - new Date(dm.dateDebut).getTime() + 1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            nbrJours = diffDays;

            delete dm.dateDebut;
            delete dm.dateFin;
        })

        const dm = demande.map((demande) => ({
            id: demande.idDemande,
            dateEnvoi: new Date(demande.dateEnvoie).toLocaleDateString('fr-FR'),
            dateConf: new Date(demande.dateConfirmation).toLocaleDateString('fr-FR'),
            name: demande.employe.prenom ? `${demande.employe.prenom}`.trim() : `${demande.employe.nom}`.trim(),
            photo: demande.employe.photoProfile ? demande.employe.photoProfile : 'avatar.png',
            photoManager: demande.employe.manager ? demande.employe.manager.photoProfile ? demande.employe.manager.photoProfile : 'avatar.png' : 'avatar.png',
            etablissement: demande.employe.etablissement.section == "Departement" ? `Dpt ${demande.employe.etablissement.designEtablissement}` : demande.employe.etablissement.designEtablissement,
            manager: demande.employe.manager ? demande.employe.manager.prenom ? `${demande.employe.manager.prenom}` : `${demande.employe.manager.nom}`.trim() : null,
            type: demande.type.designType,
            statut: demande.statuts.designStatut,
            nbrJrs: nbrJours,
        }));

        return dm;
    }

    async searchAttente(val: string){
        const demande = await this.prisma.demandesConges.findMany({
            select: {
                idDemande: true,
                dateDebut: true,
                dateFin: true,
                dateEnvoie: true,
                employe: {
                  select: {
                    nom: true,
                    prenom: true,
                    photoProfile: true,
                    etablissement: {
                        select: {
                            designEtablissement: true,
                            section: true
                        }
                    }
                  }
                },
                type: {
                    select: {
                        designType: true
                    }
                }
            },
            where: {
                employe: {
                    OR: [
                        { nom: { contains: val } },
                        { prenom: { contains: val } }
                    ]
                },
                statuts: {
                    designStatut: 'En attente'  // Filtre les demandes avec le statut "En attente"
                }
            }
        })

        let nbrJours = 0;

        demande.forEach(dm =>{
            const diffTime = Math.abs(new Date(dm.dateFin).getTime() - new Date(dm.dateDebut).getTime() + 1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            nbrJours = diffDays;
        })

        const dm = demande.map((demande, index) => ({
            id: demande.idDemande,
            dateEnvoi: new Date(demande.dateEnvoie).toLocaleDateString('fr-FR'),
            name: demande.employe.prenom ? `${demande.employe.prenom}`.trim() : `${demande.employe.nom}`.trim(),
            photo: demande.employe.photoProfile || 'avatar.png',
            etablissement: demande.employe.etablissement.section == "Departement" ? `Dpt ${demande.employe.etablissement.designEtablissement}` : demande.employe.etablissement.designEtablissement,
            type: demande.type.designType,
            nbrJrs: nbrJours,  // Nombre de jours
            dateDebut: new Date(demande.dateDebut).toLocaleDateString('fr-FR'),  // Formater la date de début
            dateFin: new Date(demande.dateFin).toLocaleDateString('fr-FR')  // Formater la date de fin
        }));


        return dm;
    }

    //Fitrage des donnees
    async filtreValid(type: string | undefined, dateDebut: string | undefined, dateFin: string | undefined){
        try {
          
          const whereClause: any = {};

          whereClause.statuts = {
            designStatut: {
                not: "En attente"
            }
          }
      
          // Filtrer par type
          if (type) {
            whereClause.type = {
              idType : parseInt(type)
            };
          }
      
          // Vérification et inversion si la dateDebut est après la dateFin
          if (dateDebut && dateFin) {
            const startDate = new Date(dateDebut);
            const endDate = new Date(dateFin);
      
            if (startDate > endDate) {
              // Inverser les dates si dateDebut est après dateFin
              whereClause.dateEnvoie = {
                gte: endDate,  
                lte: startDate,
              };
            } else {
              // Dates correctes, pas besoin d'inverser
              whereClause.dateEnvoie = {
                gte: startDate,
                lte: endDate,
              };
            }
          }
      
          // Requête Prisma avec les conditions dynamiques
          const demande = await this.prisma.demandesConges.findMany({
            where: whereClause,
            select: {
                idDemande: true,
                dateDebut: true,
                dateFin: true,
                dateConfirmation: true,
                dateEnvoie: true,
                employe: {
                  select: {
                    nom: true,
                    prenom: true,
                    photoProfile: true,
                    etablissement: {
                        select: {
                            designEtablissement: true,
                            section: true
                        }
                    },
                    manager: {
                        select: {
                            nom: true,
                            prenom: true,
                            photoProfile: true
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
          });
  
          let nbrJours = 0;

          demande.forEach(dm =>{
              const diffTime = Math.abs(new Date(dm.dateFin).getTime() - new Date(dm.dateDebut).getTime() + 1);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              nbrJours = diffDays;
  
              delete dm.dateDebut;
              delete dm.dateFin;
          })
  
          const dm = demande.map((demande) => ({
              id: demande.idDemande,
              dateEnvoi: new Date(demande.dateEnvoie).toLocaleDateString('fr-FR'),
              dateConf: new Date(demande.dateConfirmation).toLocaleDateString('fr-FR'),
              name: demande.employe.prenom ? `${demande.employe.prenom}`.trim() : `${demande.employe.nom}`.trim(),
              photo: demande.employe.photoProfile ? demande.employe.photoProfile : 'avatar.png',
              photoManager: demande.employe.manager ? demande.employe.manager.photoProfile ? demande.employe.manager.photoProfile : 'avatar.png' : 'avatar.png',
              etablissement: demande.employe.etablissement.section == "Departement" ? `Dpt ${demande.employe.etablissement.designEtablissement}` : demande.employe.etablissement.designEtablissement,
              manager: demande.employe.manager ? demande.employe.manager.prenom ? `${demande.employe.manager.prenom}` : `${demande.employe.manager.nom}`.trim() : null,
              type: demande.type.designType,
              statut: demande.statuts.designStatut,
              nbrJrs: nbrJours,
          }));
      
          return dm;
        } catch (error) {
          console.error('Erreur lors de la requête Prisma:', error);
          throw error;
        }
      }

      async filtreAttente(type: string | undefined, dateDebut: string | undefined, dateFin: string | undefined){
        try {
          
          const whereClause: any = {};

          whereClause.statuts = {
            designStatut: 'En attente'
          }
      
          // Filtrer par type
          if (type) {
            whereClause.type = {
              idType : parseInt(type)
            };
          }
      
          // Vérification et inversion si la dateDebut est après la dateFin
          if (dateDebut && dateFin) {
            const startDate = new Date(dateDebut);
            const endDate = new Date(dateFin);
      
            if (startDate > endDate) {
              // Inverser les dates si dateDebut est après dateFin
              whereClause.dateDebut = {
                gte: endDate,  
                lte: startDate,
              };
            } else {
              // Dates correctes, pas besoin d'inverser
              whereClause.dateDebut = {
                gte: startDate,
                lte: endDate,
              };
            }
          }
      
          // Requête Prisma avec les conditions dynamiques
          const demande = await this.prisma.demandesConges.findMany({
            where: whereClause,
            select: {
                idDemande: true,
                dateDebut: true,
                dateFin: true,
                dateEnvoie: true,
                employe: {
                  select: {
                    nom: true,
                    prenom: true,
                    photoProfile: true,
                    etablissement: {
                        select: {
                            designEtablissement: true,
                            section: true
                        }
                    }
                  }
                },
                type: {
                    select: {
                        designType: true
                    }
                }
            },
          });
  
          let nbrJours = 0;

        demande.forEach(dm =>{
            const diffTime = Math.abs(new Date(dm.dateFin).getTime() - new Date(dm.dateDebut).getTime() + 1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            nbrJours = diffDays;
        })

        const dm = demande.map((demande, index) => ({
            id: demande.idDemande,
            dateEnvoi: new Date(demande.dateEnvoie).toLocaleDateString('fr-FR'),
            name: demande.employe.prenom ? `${demande.employe.prenom}`.trim() : `${demande.employe.nom}`.trim(),
            photo: demande.employe.photoProfile || 'avatar.png',
            etablissement: demande.employe.etablissement.section == "Departement" ? `Dpt ${demande.employe.etablissement.designEtablissement}` : demande.employe.etablissement.designEtablissement,
            type: demande.type.designType,
            nbrJrs: nbrJours,  // Nombre de jours
            dateDebut: new Date(demande.dateDebut).toLocaleDateString('fr-FR'),  // Formater la date de début
            dateFin: new Date(demande.dateFin).toLocaleDateString('fr-FR')  // Formater la date de fin
        }));
      
          return dm;
        } catch (error) {
          console.error('Erreur lors de la requête Prisma:', error);
          throw error;
        }
      }

      //Accepter demande
      async acceptDM(idDemande: number, idEmploye?: string){
        await this.prisma.demandesConges.update({
            where: { idDemande },
            data: {
                statutId: 2,
                dateConfirmation: new Date(),
            },
        });

        if(idEmploye != 'null'){   
            await this.prisma.historiquesActions.create({
                data: {
                ancienneValeur: 'En attente',
                nouvelleValeur: 'Approuvée',
                dateAction: new Date(),
                niveau: 'Manager',
                typeAction: 'Approbation', // Assuming "approve" is a valid enum value
                userId: parseInt(idEmploye),
                },
            });
        } else {
            await this.prisma.historiquesActions.create({
                data: {
                ancienneValeur: 'En attente',
                nouvelleValeur: 'Approuvée',
                dateAction: new Date(),
                niveau: 'Admin',
                typeAction: 'Approbation',
                },
            });
        }
      }

      //Refuser demande
      async refusDM(motif: string, idDemande: number, idEmploye?: string){
        if (!motif) {
            throw new Error('Le refus doit avoir une raison');
        }

        await this.prisma.demandesConges.update({
            where: { idDemande },
            data: {
            statutId: 3, 
            dateConfirmation: new Date(),
            motifRefus: motif
            },
        });

        if(idEmploye != 'null'){
            await this.prisma.historiquesActions.create({
                data: {
                    ancienneValeur: 'En attente',
                    nouvelleValeur: `Refusée - ${motif}`,
                    dateAction: new Date(),
                    niveau: 'Manager',
                    typeAction: 'Refus',
                    userId: parseInt(idEmploye),
                },
            });
        } else {
            await this.prisma.historiquesActions.create({
                data: {
                ancienneValeur: 'En attente',
                nouvelleValeur: `Refusée - ${motif}`,
                dateAction: new Date(),
                niveau: 'Admin',
                typeAction: 'Refus',
                },
            });
        }
      }

      //Conge actif
      async CongeEvent(){
        const conges = await this.prisma.demandesConges.findMany({
            where: {
              statuts: {
                designStatut: 'Approuvee', 
              },
              dateFin: {
                gt: new Date(),
              },
            },
            include: {
              employe: {
                select: {
                  nom: true,
                  prenom: true
                },
              },
              type: {
                select: {
                  designType: true,
                },
              },
            },
          });

        
          return conges;
      }

      //Conge actif coté employe
      async CongeEventEmp(idEmploye: number){
        const emp = await this.prisma.employes.findUnique({ where: {idEmploye} });

        if(!emp) throw new NotFoundException("Employe non trouvé !")

        if(emp.idManager){
          return this.CongeEventSub(emp.idManager);
        } else {
          return []
        }

      }

      //Conge actif coté manager
      async CongeEventSub(idManager: number){
        const conges = await this.prisma.demandesConges.findMany({
            where: {
              employe: {
                idManager
              },
              statuts: {
                designStatut: 'Approuvee', 
              },
              dateFin: {
                gt: new Date(),
              },
            },
            include: {
              employe: {
                select: {
                  nom: true,
                  prenom: true
                },
              },
              type: {
                select: {
                  designType: true,
                },
              },
            },
          });

        
          return conges;
      }

      //Filtre conge
      async filtreConge(etablissement: string | undefined){
        try {
          const whereClause: any = {};

          whereClause.statuts = {
            designStatut: 'Approuvee',
          };

          whereClause.dateFin = {
            gt: new Date(),
          };
      
          // Filtrer par établissement si fourni
          if (etablissement) {
            whereClause.employe = {
              etablId : parseInt(etablissement)
            };
          }
      
          // Requête Prisma avec les conditions dynamiques
          const conge = await this.prisma.demandesConges.findMany({
            where: whereClause,
            include: {
                employe: {
                  select: {
                    nom: true,
                    prenom: true
                  },
                },
                type: {
                  select: {
                    designType: true,
                  },
                },
              },
          });
  
      
          return conge;
        } catch (error) {
          console.error('Erreur lors de la requête Prisma:', error);
          throw error;
        }
      }

      //Derniere demande de conge
      async lastDemande(employeId: number){
        const derniereDemande = await this.prisma.demandesConges.findFirst({
          where: {
            employeId
          },
          orderBy: {
            idDemande: 'desc',  // Trie par la clé primaire pour obtenir la demande la plus récente
          },
          include: {
            statuts: {
              select: {
                designStatut: true
              }
            },
            type:{
              select: {
                designType: true
              }
            },   
          },
        });

        let demandeAvecNombreJours = null;
        if (derniereDemande) {
          const dateDebut = new Date(derniereDemande.dateDebut).getTime();
          const dateFin = new Date(derniereDemande.dateFin).getTime();
        
          // Calcul du nombre de jours
          const nombreJours = Math.ceil((dateFin - dateDebut + 76400) / (1000 * 60 * 60 * 24));
        
          // Ajouter l'attribut calculé à l'objet de la demande
          demandeAvecNombreJours = {
            ...derniereDemande,
            nombreJours: nombreJours,
          };

        }

        return demandeAvecNombreJours
      }

      //Les demandes d'un employe
      async employeDM(employeId: number){

        if(!employeId) throw new NotFoundException('Id non trouve')

        const demande = await this.prisma.demandesConges.findMany({
            select: {
                idDemande: true,
                dateDebut: true,
                dateFin: true,
                dateConfirmation: true,
                dateEnvoie: true,
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
              employeId,
            },
            orderBy: {
              idDemande: 'desc',
            },
        })

        const dm = demande.map((demande) => {
          
          const diffTime = Math.abs(new Date(demande.dateFin).getTime() - new Date(demande.dateDebut).getTime() + 1);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return {
            id: demande.idDemande,
            dateEnvoi: new Date(demande.dateEnvoie).toLocaleDateString('fr-FR'),
            dateConf: demande.dateConfirmation ? new Date(demande.dateConfirmation).toLocaleDateString('fr-FR') : null,
            type: demande.type.designType,
            statut: demande.statuts.designStatut,
            nbrJrs: diffDays,
            dateDebut: new Date(demande.dateDebut).toLocaleDateString('fr-FR'),  // Formater la date de début
            dateFin: new Date(demande.dateFin).toLocaleDateString('fr-FR')  // Formater la date de fin
        }});

        return dm;
      
      }

}

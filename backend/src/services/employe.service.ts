/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PasswordService } from 'src/auth/authentication/password.service';
import { AddEmployeDto, ModifEmployeDto } from 'src/dto/employeDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/utils/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as path from 'path';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EmployeService { 
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordService: PasswordService,
        private readonly mailer: MailerService,
        private readonly jwtService: JwtService
    ){}

    //Ajout d'un employe
    async addEmploye(employeDto: AddEmployeDto, p0?: { profile: string; }) {
      const { email, idManager, idposte, idEtablissement, ...employeData } = employeDto;

      const nom = `${employeData.nom} ${employeData.prenom}`
  
      // Verifier si l'employe a un compte ou CIN deja utilise
      const cin = await this.prisma.employes.findUnique({ where: { CIN: employeData.CIN }});
      if (cin) throw new ConflictException('CIN invalide ou deja utilisé');

      const existe = await this.prisma.compte_Utilisateur.findUnique({ where: { email } });
      if (existe) throw new ConflictException('Employe possedant deja un compte');
  
      // Generer le token
      const token = this.jwtService.sign({ email }, { secret: "congeSPAT", expiresIn: '48h' });
  
      // Envoyer le mail
      // await this.mailer.sendSignupConfirmation(email, nom, token); //DE-COMMENTER LORS DU REEL
  
      await this.prisma.employes.create({
        data: {
          ...employeData,
          photoProfile: p0?.profile,
          manager: idManager ? { connect: { idEmploye: idManager } } : undefined,
          poste: { connect: { idPoste: idposte } },
          etablissement: { connect: { idEtablissement: idEtablissement}},
          compte: {
            create: {
              email,
              role: 'Employe',
              derniereConnexion: null,
            },
          },
        },
      });
  
      // Supprimer les infos liees a l'employe si pas encore confirmer
      this.scheduleEmployeeDeletion(email, '48h');
    }

    //Affichage tout les employes
    async allEmploye(){
      const employes = await this.prisma.employes.findMany({
        where: {
          NOT: {
            compte: null, // Filtrer seulement les employés qui ont un compte utilisateur
          },
        },
        include: {
          manager: {
            select: {
              nom: true,
              photoProfile: true
            },
          },
          poste: {
            select: {
              designPoste: true,
            },
          },
          compte: {
            select: {
              email: true
            }
          },
          etablissement: {
            select: {
              designEtablissement: true
            }
          }
        },
      });

      const rows = employes.map((data)=>{
        return {
          id: data.idEmploye,
          employeId: data.CIN,
          name: data.prenom ? `${data.nom} ${data.prenom}` : `${data.nom}`,
          email: data.compte.email,
          manager: data.manager ?  `${data.manager.nom}` : null,
          photo: data.photoProfile ? data.photoProfile : "avatar.png",
          photoManager: data.manager ? data.manager.photoProfile ? data.manager.photoProfile : "avatar.png" : null,
          DateEmb: data.dateEmbauche,
          Etablissement: data.etablissement.designEtablissement,
          poste: data.poste.designPoste,
        }
      })

      return rows;
    }

    //Tout les employes mais seulement le nom
    async Supperieur(){
      const noms = await this.prisma.employes.findMany({
        where: {
          NOT: {
            compte: null, // Filtrer seulement les employés qui ont un compte utilisateur
          },
          compte: {
            password: {
              not: null
            }
          }
        },
        select: {
          nom: true,
          prenom: true,
          idEmploye: true
        }
      })

      const name = noms.map((item)=>{
        return {
          label: item.prenom ? `${item.idEmploye}- ${item.nom} ${item.prenom}` : `${item.idEmploye}- ${item.nom}`,
          value: item.idEmploye
        }
      })

      return name
    }

    //Affichage tout les Manager
    async allManager(){
      const manager = await this.prisma.employes.findMany({
        where:{
          subordonne: {
            some: {}, 
          }
        },
        select: {
          idEmploye: true,
          nom: true,
          prenom: true,
          CIN: true,
          photoProfile: true,
          _count: {
            select: {subordonne: true}
          },
          poste: {
            select: {
              designPoste: true,
            },
          },
          compte: {
            select: {
              email: true
            }
          },
          etablissement: {
            select: {
              designEtablissement: true
            }
          }
        }
      });

      const rows = manager.map((data)=>{
        return {
          id: data.idEmploye,
          managerId: data.CIN,
          name: data.prenom ? `${data.nom} ${data.prenom}` : `${data.nom}`,
          email: data.compte.email,
          photo: data.photoProfile ? data.photoProfile : "avatar.png",
          etablissement: data.etablissement.designEtablissement,
          nbrSub: data._count.subordonne,
          poste: data.poste.designPoste,
        }
      })

      return rows;
    }

    //Suppression d'employe
    async deleteEmploye(idEmploye: number){

      //verifier le profil
      const employe = await this.prisma.employes.findUnique({
        where: { idEmploye },
        select: { photoProfile: true },
      });

      if (employe?.photoProfile) {
          const filePath = path.join(process.cwd(), 'profil', employe.photoProfile);
          fs.unlink(filePath, (err) => {
              if (err) {
                  console.error(`Erreur lors de la suppression de l'image: ${err}`);
              } else {
                  console.log('Image supprimée avec succès');
              }
          });
      }

      //Mettre à jour l'idManager des subordonnés a null
      await this.prisma.employes.updateMany({
          where: { idManager: idEmploye },
          data: { idManager: null },
      });

      //Supprimer l'employé (avec suppression en cascade de ses comptes utilisateurs)
      return await this.prisma.employes.delete({
          where: { idEmploye },
      });
    }

    //Recherche d'employe
    async searchEmploye(value: string){
      const employes = await this.prisma.employes.findMany({
        where: {
          OR: [
            { nom: {contains: value} },
            { prenom: {contains: value} }
          ]
        },
        include: {
          manager: {
            select: {
              nom: true,
              photoProfile: true
            },
          },
          poste: {
            select: {
              designPoste: true,
            },
          },
          compte: {
            select: {
              email: true
            }
          },
          etablissement: {
            select: {
              designEtablissement: true
            }
          }
        },
      });

      const rows = employes.map((data)=>{
        return {
          id: data.idEmploye,
          employeId: data.CIN,
          name: data.prenom ? `${data.nom} ${data.prenom}` : `${data.nom}`,
          email: data.compte.email,
          manager: data.manager ? `${data.manager.nom}` : null,
          photo: data.photoProfile ? data.photoProfile : "avatar.png",
          photoManager: data.manager ? data.manager.photoProfile ? data.manager.photoProfile : "avatar.png" : null,
          DateEmb: data.dateEmbauche,
          Etablissement: data.etablissement.designEtablissement,
          poste: data.poste.designPoste,
        }
      })

      return rows;
    }

    //Fitrage des donnees
    async filtreEmploye(etablissement: string | undefined, dateDebut: string | undefined, dateFin: string | undefined){
      try {
        
        const whereClause: any = {};
    
        // Filtrer par établissement si fourni
        if (etablissement) {
          whereClause.etablissement = {
            idEtablissement : parseInt(etablissement)
          };
        }
    
        // Vérification et inversion si la dateDebut est après la dateFin
        if (dateDebut && dateFin) {
          const startDate = new Date(dateDebut);
          const endDate = new Date(dateFin);
    
          if (startDate > endDate) {
            // Inverser les dates si dateDebut est après dateFin
            whereClause.dateEmbauche = {
              gte: endDate,  
              lte: startDate,
            };
          } else {
            // Dates correctes, pas besoin d'inverser
            whereClause.dateEmbauche = {
              gte: startDate,
              lte: endDate,
            };
          }
        }
    
        // Requête Prisma avec les conditions dynamiques
        const employes = await this.prisma.employes.findMany({
          where: whereClause,
          include: {
            manager: {
              select: {
                nom: true,
                photoProfile: true
              },
            },
            poste: {
              select: {
                designPoste: true,
              },
            },
            compte: {
              select: {
                email: true
              }
            },
            etablissement: {
              select: {
                designEtablissement: true
              }
            }
          },
        });

        const rows = employes.map((data)=>{
          return {
            id: data.idEmploye,
            employeId: data.CIN,
            name: data.prenom ? `${data.nom} ${data.prenom}` : `${data.nom}`,
            email: data.compte.email,
            manager: data.manager ? `${data.manager.nom}` : null,
            photo: data.photoProfile ? data.photoProfile : "avatar.png",
            photoManager: data.manager ? data.manager.photoProfile ? data.manager.photoProfile : "avatar.png" : null,
            DateEmb: data.dateEmbauche,
            Etablissement: data.etablissement.designEtablissement,
            poste: data.poste.designPoste,
          }
        })
    
        return rows;
      } catch (error) {
        console.error('Erreur lors de la requête Prisma:', error);
        throw error;
      }
    }

    async filtreManager(etablissement: string | undefined){
      try {
        const whereClause: any = {};

        whereClause.subordonne = {
          some: {}
        }
    
        // Filtrer par établissement si fourni
        if (etablissement) {
          whereClause.etablissement = {
            idEtablissement : parseInt(etablissement)
          };
        }
    
        // Requête Prisma avec les conditions dynamiques
        const Manager = await this.prisma.employes.findMany({
          where: whereClause,
          select: {
            idEmploye: true,
            nom: true,
            prenom: true,
            CIN: true,
            photoProfile: true,
            _count: {
              select: {subordonne: true}
            },
            poste: {
              select: {
                designPoste: true,
              },
            },
            compte: {
              select: {
                email: true
              }
            },
            etablissement: {
              select: {
                designEtablissement: true
              }
            }
          }
        });

        const rows = Manager.map((data)=>{
          return {
            id: data.idEmploye,
            managerId: data.CIN,
            name: data.prenom ? `${data.nom} ${data.prenom}` : `${data.nom}`,
            email: data.compte.email,
            photo: data.photoProfile ? data.photoProfile : "avatar.png",
            etablissement: data.etablissement.designEtablissement,
            nbrSub: data._count.subordonne,
            poste: data.poste.designPoste,
          }
        })
    
        return rows;
      } catch (error) {
        console.error('Erreur lors de la requête Prisma:', error);
        throw error;
      }
    }

    //Recherche de Manager
    async searchManager(value: string){
      const manager = await this.prisma.employes.findMany({
        where:{
          subordonne: {
            some: {},
          },
          OR: [
            { nom: {contains: value} },
            { prenom: {contains: value} }
          ]
        },
        select: {
          idEmploye: true,
          nom: true,
          prenom: true,
          CIN: true,
          photoProfile: true,
          _count: {
            select: {subordonne: true}
          },
          poste: {
            select: {
              designPoste: true,
            },
          },
          compte: {
            select: {
              email: true
            }
          },
          etablissement: {
            select: {
              designEtablissement: true
            }
          }
        }
      });

      const rows = manager.map((data)=>{
        return {
          id: data.idEmploye,
          managerId: data.CIN,
          name: data.prenom ? `${data.nom} ${data.prenom}` : `${data.nom}`,
          email: data.compte.email,
          photo: data.photoProfile ? data.photoProfile : "avatar.png",
          etablissement: data.etablissement.designEtablissement,
          nbrSub: data._count.subordonne,
          poste: data.poste.designPoste,
        }
      })

      return rows;
    }

    //Modification information employe
    async updateEmploye(idEmploye: number, modifEmployeDto: ModifEmployeDto, p0?: { profile: string; }){
      const { idManager, idposte, idEtablissement, email, ...employeData } = modifEmployeDto;

      const existingEmploye = await this.prisma.employes.findUnique({
        where: { idEmploye },
        select: { photoProfile: true }
      });

      const cin = await this.prisma.employes.findUnique({ 
        where: { 
          CIN: employeData.CIN
        }
      });
      if (cin && cin.idEmploye !== idEmploye) throw new ConflictException('CIN invalide ou deja utilisé');

      const existe = await this.prisma.compte_Utilisateur.findUnique({ 
        where: {
           email
        } 
      });
      if (existe && existe.employeId !== idEmploye) throw new ConflictException('Autre employe possedant deja ce compte');

      
      if (p0?.profile && existingEmploye.photoProfile) {
          
        const oldFilePath = path.join(process.cwd(), 'profil', existingEmploye.photoProfile);
        
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error(`Erreur lors de la suppression de l'image: ${err}`);
            } else {
                console.log('Ancienne image supprimée avec succès');
            }
        });
      }

      await this.prisma.employes.update({
        where:{
          idEmploye
        },
        data: {
          ...employeData,
          compte: {
            update: {
              email: email
            }
          },
          photoProfile: p0?.profile || existingEmploye.photoProfile,
          manager: idManager ? { connect: { idEmploye: idManager } } : { disconnect: true },
          poste: { connect: { idPoste: idposte } },
          etablissement: { connect: { idEtablissement: idEtablissement}}
        },
      });
    }

    //Information personnelle
    async personalInfo(email: string){

      const info = await this.prisma.employes.findFirst({
        where: {
          compte: {
            email
          }
        },
        select: {
          nom: true,
          prenom: true,
          photoProfile: true,
          compte: {
            select: {
              email: true,
              derniereConnexion: true
            }
          },
          poste: {
            select: {
              designPoste: true
            }
          },
        }
      })

      let personnalInfos = {};

      if (!info) {

        const compte = await this.prisma.compte_Utilisateur.findUnique({
          where: {
            email
          }
        })

        personnalInfos =  {
          name: "Utilisateur",
          email: compte.email,
          photo: "avatar.png",
          dernier: compte.derniereConnexion,
          poste: null
        }

      } else {

        personnalInfos =  {
          name: info.prenom ? `${info.nom} ${info.prenom}` : `${info.nom}`,
          email: info.compte.email,
          photo: info.photoProfile ? info.photoProfile : "avatar.png",
          dernier: info.compte.derniereConnexion ? info.compte.derniereConnexion : null,
          poste: info.poste.designPoste,
        }

      }

      return personnalInfos;
    }
  
    //Confirmation du mot de passe
    async setPassword(token: string, newPassword: string) {
      try {
        // verifier le token
        const decoded = this.jwtService.decode(token);
        const { email } = decoded as { email: string };
  
        // verifier l'employe
        const employeeAccount = await this.prisma.compte_Utilisateur.findUnique({ where: { email }, include: { utilisateur: true }, });
        if (!employeeAccount) throw new NotFoundException('Token invalid ou employe non existant');
        if(employeeAccount.password) throw new BadRequestException('Lien déjà utilisé !');
  
        // crypter le mot de passe
        const hashedpwd = await this.passwordService.hashPassword(newPassword);
        await this.prisma.compte_Utilisateur.update({
          where: { email },
          data: { password: hashedpwd },
        });

        //Récupérer tous les types de congés disponibles
        const typesConges = await this.prisma.typesConges.findMany();

        // Créer les soldes de congés pour chaque type de congé
        const soldeCongesPromises = typesConges.map((type) => {
          
          const isMale = employeeAccount.utilisateur.sexe === 'M';
          const isFemale = employeeAccount.utilisateur.sexe === 'F';

          if (type.designType === 'Maternite' && isMale) {
            // Ne pas créer de solde pour Maternité si l'employé est masculin
            return Promise.resolve();
          }

          if (type.designType === 'Paternite' && isFemale) {
            // Ne pas créer de solde pour Paternité si l'employé est féminin
            return Promise.resolve();
          }

          // Créer le solde de congé s'il n'y a pas de restriction
          return this.prisma.soldesConges.create({
            data: {
              soldeTotal: 0,
              soldeUtilise: 0,
              idEmp: employeeAccount.employeId,
              idType: type.idType,
            },
          });
        });

        // Attendre que toutes les promesses de création des soldes se terminent
        await Promise.all(soldeCongesPromises);

      } catch (err) {
        throw new BadRequestException('Token is invalid or expired');
      }
    }
  
    //Supprimer l'employe si pas encore confirmer
    async scheduleEmployeeDeletion(email: string, expirationTime: string) {
      const timeToWait = this.parseExpirationTime(expirationTime);
      setTimeout(async () => {
        const employeeAccount = await this.prisma.compte_Utilisateur.findUnique({ where: { email } });
        if (!employeeAccount || employeeAccount.password === "") {
          //Supprimer l'employe
          await this.prisma.employes.delete({
            where: {
              idEmploye: employeeAccount.employeId
            }
          });

          //Supprimer son compte
          await this.prisma.compte_Utilisateur.delete({
            where: {
              idCompte: employeeAccount.idCompte
            }
          });
        }
      }, timeToWait);
    }
  
    //Conversion en miliseconde
    private parseExpirationTime(expirationTime: string): number {
      const timeInMs = {
        m: 60000,
        h: 3600000,
        d: 86400000,
      };
  
      const timeUnit = expirationTime.slice(-1);
      const timeValue = parseInt(expirationTime.slice(0, -1), 10);
      return timeValue * timeInMs[timeUnit];
    }

    //Informations
    async info(idEmploye: number){
      const info = await this.prisma.employes.findUnique({
        where: {
          idEmploye
        },
        select: {
          nom: true,
          prenom: true,
          photoProfile: true,
          compte: {
            select: {
              email: true
            }
          },
          poste: {
            select: {
              designPoste: true
            }
          },
          etablissement: {
            select: {
              designEtablissement: true,
              section: true
            }
          },
          sexe: true,
          CIN: true,
          dateEmbauche: true,
          periodeEssai: true,
          manager: {
            select: {
              nom: true,
              prenom: true,
              idEmploye: true
            }
          }
        }
      })

      const information = {
        nom: info.nom,
        prenom: info.prenom,
        sexe: info.sexe,
        CIN: info.CIN,
        email: info.compte.email,
        manager: info.manager ? info.manager.prenom ? `${info.manager.idEmploye}- ${info.manager.nom} ${info.manager.prenom}` : `${info.manager.idEmploye}- ${info.manager.nom}` : null,
        dateEmbauche: info.dateEmbauche,
        periodeEssai: info.periodeEssai,
        etablissement: info.etablissement.section == "Direction" ? `Direct. ${info.etablissement.designEtablissement}` : `Dpt ${info.etablissement.designEtablissement}`,
        poste: info.poste.designPoste,
        photo: info.photoProfile || "avatar.png"
      } 

      return information;
    }

    //Supplementaire
    async supplementaire(idManager: number){
      
      const subordinatesCount = await this.prisma.employes.count({
        where: {
          idManager
        },
      });

      // Récupérer le nombre total de demandes de congé en attente des subordonnés
      const pendingRequestsCount = await this.prisma.demandesConges.count({
        where: {
          employe: {
            idManager
          },
          statuts: {
            designStatut: 'En attente',
          },
        },
      });

      return {
        attente: pendingRequestsCount,
        total: subordinatesCount
      }
    }

    //10 Dernieres actions 
    async lastManagerAction(userId: number){
      const managerActions = await this.prisma.historiquesActions.findMany({
        where: {
          userId, // ID du manager dont on récupère les actions
          niveau: 'Manager'
        },
        orderBy: {
          dateAction: 'desc',
        },
        take: 10, // Limiter les résultats aux 10 dernières actions
        select: {
          idHistorique: true,
          dateAction: true,  
          typeAction: true, 
        },
      });

      // Formatage des données pour correspondre à votre structure
      const formattedActions = managerActions.map(action => ({
        id: action.idHistorique,
        Date: action.dateAction.toLocaleDateString('fr-FR'), // Formatage de la date
        action: action.typeAction,  // Type d'action
      }));

      return formattedActions;
    }

    //Calcul des conges accumules
    async ajouterCongesPourTousLesEmployes() {
      // Récupérer tous les employés
      const employes = await this.prisma.employes.findMany();
  
      for (const employe of employes) {
          const { idEmploye, dateEmbauche, periodeEssai } = employe;

          
          if (periodeEssai) {
            continue; // Passer à l'employé suivant si en période d'essai
          }
  
          // Vérifier si le type de congé est "payé"
          const typeConges = await this.prisma.soldesConges.findFirst({
              where: {
                  idEmp: idEmploye,
                  type: {
                      designType: 'Paye',
                  },
              },
          });
  
          // Si le type de congé "payé" est trouvé
          if (typeConges) {
              
              const dateEmbaucheObj = new Date(dateEmbauche);
              const dateActuelle = new Date();
  
              // Calculer la différence en mois
              const moisDiff = (dateActuelle.getFullYear() - dateEmbaucheObj.getFullYear()) * 12 + (dateActuelle.getMonth() - dateEmbaucheObj.getMonth());
  
              const joursAccumules = (moisDiff * 2.5).toFixed(1); // Arrondi à un chiffre après la virgule
  
              // Mettre à jour les soldes de congés dans la base de données
              await this.prisma.soldesConges.update({
                  where: {
                      idEmp_idType: {
                          idEmp: idEmploye,
                          idType: typeConges.idType,
                      },
                  },
                  data: {
                      soldeTotal: parseFloat(joursAccumules), // Convertir en float
                  },
              });
          }
      }
    }

    //Reinitialiser les conges
    async reinitialisation(){
      const dateReinitialisation = new Date(new Date().getFullYear(), 0, 1); // 1er janvier de l'année actuelle

      // Vérifier si la date actuelle est la date de réinitialisation
      const dateActuelle = new Date();
      if (
          dateActuelle.getDate() === dateReinitialisation.getDate() &&
          dateActuelle.getMonth() === dateReinitialisation.getMonth()
      ) {
          // Réinitialiser tous les soldes de congé payé à 0
          await this.prisma.soldesConges.updateMany({
              where: {
                  type: {
                      designType: 'Paye',
                  },
              },
              data: {
                  soldeTotal: 0,
                  soldeUtilise: 0,
              },
          });
      }
    }

    //Recuperation des soldes de conges
    async SoldesConges(employeId: number) {

      const currentDate = new Date();
      
      const leaveData = await this.prisma.typesConges.findMany({
        where: {
          solde: {
            some: {
              idEmp: employeId,
            },
          },
        },
        select: {
          designType: true,
          solde: {
            where: {
              idEmp: employeId, // Filtrer les soldes pour cet employé
            },
            select: {
              soldeTotal: true,
              soldeUtilise: true,
            },
          },
          demandes: {
            where: {
              employeId, // Filtrer par l'ID de l'employé
              dateDebut: {
                lte: currentDate, // Date de début <= jour actuel
              },
              dateFin: {
                gte: currentDate, // Date de fin >= jour actuel
              },
            },
            select: {
              dateDebut: true,
              dateFin: true,
            },
          },
        },
      });
      
      const formattedLeaveData = leaveData.map(leave => {
        // Calculer le nombre total de jours de congé (dateFin - dateDebut)
        const totalDays = leave.demandes.reduce((total, conge) => {
          const dateDebutTime = new Date(conge.dateDebut).getTime();
          const dateFinTime = new Date(conge.dateFin).getTime();
          const daysDiff = Math.ceil((dateFinTime - dateDebutTime + 76400) / (1000 * 60 * 60 * 24)); // Différence en jours
          return total + daysDiff;
        }, 0);
      
        // Calculer le nombre de jours utilisés jusqu'à aujourd'hui
        const usedDays = leave.demandes.reduce((total, conge) => {
          const dateDebutTime = new Date(conge.dateDebut).getTime();
          const currentTime = currentDate.getTime();
          const dateFinTime = new Date(conge.dateFin).getTime();
      
          const daysDiff = Math.ceil((Math.min(currentTime, dateFinTime) - dateDebutTime) / (1000 * 60 * 60 * 24)); // Différence en jours
          return total + Math.max(0, daysDiff); // Éviter les valeurs négatives si congé pas encore commencé
        }, 0);
      
        return {
          type: leave.designType, // Le type de congé (Payés, Maladie, etc.)
          total: totalDays, // Le total de jours pour ce type de congé
          accumulated: leave.solde[0]?.soldeTotal || 0, // Nombre total de jours accumulés
          used: usedDays, // Nombre de jours utilisés
        };
      });

      return formattedLeaveData

    }

    //Deconnexion
    async deconnex(email: string){

      if(!email){
        throw new NotFoundException("Aucun compte email associé !")
      }

      await this.prisma.compte_Utilisateur.update({
        where: {
          email
        },
        data: {
          derniereConnexion: new Date()
        }
      })
      
    }

    //Information coté employé
    async EmployeInfo(idEmploye: number){
      const first = await this.info(idEmploye);
      const seconde = await this.prisma.soldesConges.findUnique({
        where: {
          idEmp_idType: {
            idEmp: idEmploye,
            idType: 1
          },
        },
        select: {
          soldeTotal: true
        }
      })

      let solde = '0';
      if(seconde) {
        solde = `${seconde.soldeTotal}`
      }

      let manager = null;
      if(first.manager){
        const temp = first.manager.split('-');
        manager = temp[1];
      }

      return {
        nom: first.nom,
        prenom: first.prenom,
        CIN: first.CIN,
        email: first.email,
        manager: manager,
        dateEmbauche: first.dateEmbauche,
        etablissement: first.etablissement,
        poste: first.poste,
        solde: solde,
        photo: first.photo
      }
    }

    //Liste des collegue
    async listeCollegue(idEmploye: number){

      const pers = await this.prisma.employes.findUnique({
        where: {
          idEmploye
        }
      })

      if(!pers) throw new NotFoundException("Aucun utilisateur")

      let rows = [];
      if(pers.idManager){
        const employes = await this.prisma.employes.findMany({
          where: {
            NOT: {
              compte: null,
            },
            OR: [
              {idManager: pers.idManager},
              {idManager: {not: null} }
            ],
            idEmploye: {
              not: idEmploye
            }
          },
          include: {
            poste: {
              select: {
                designPoste: true,
              },
            },
            etablissement: {
              select: {
                designEtablissement: true
              }
            }
          },
        });
  
        rows = employes.map((data)=>{
          return {
            id: data.idEmploye,
            name: data.prenom ? `${data.nom} ${data.prenom}` : `${data.nom}`,
            photo: data.photoProfile ? data.photoProfile : "avatar.png",
            Etablissement: data.etablissement.designEtablissement,
            poste: data.poste.designPoste,
          }
        })
      }

      

      return rows;
    }

    //recherche des collegue
    async searchCollegue(idEmploye: number, val: string){

      const pers = await this.prisma.employes.findUnique({
        where: {
          idEmploye
        }
      })

      if(!pers) throw new NotFoundException("Aucun utilisateur")

      const employes = await this.prisma.employes.findMany({
        where: {
          NOT: {
            compte: null,
          },
          idManager: pers.idManager,
          idEmploye: {
            not: idEmploye
          },
          OR: [
            { nom: {contains: val} },
            { prenom: {contains: val} }
          ]
        },
        include: {
          poste: {
            select: {
              designPoste: true,
            },
          },
          etablissement: {
            select: {
              designEtablissement: true
            }
          }
        },
      });

      const rows = employes.map((data)=>{
        return {
          id: data.idEmploye,
          name: data.prenom ? `${data.nom} ${data.prenom}` : `${data.nom}`,
          photo: data.photoProfile ? data.photoProfile : "avatar.png",
          Etablissement: data.etablissement.designEtablissement,
          poste: data.poste.designPoste,
        }
      })

      return rows;
    }

    @Cron("0 0 1 * *") // Exécute le 1er jour de chaque mois
    handleCron() {
      this.ajouterCongesPourTousLesEmployes()
        .then(() => console.log('Soldes de congé mis à jour'))
        .catch((error) => console.error('Erreur lors de la mise à jour des soldes :', error));
    }

    @Cron('0 0 1 1 *') // Exécute le 1er janvier à minuit
    handleReset() {
      this.reinitialisation()
        .then(() => console.log('Soldes de congé payé réinitialisés'))
        .catch((error) => console.error('Erreur lors de la réinitialisation des soldes :', error));
    }

 }


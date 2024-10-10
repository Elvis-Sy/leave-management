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

        console.log(etablissement)
    
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
    async personalInfo(idEmploye: number){
      const info = await this.prisma.employes.findFirst({
        where: {
          idEmploye
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

      if (!info) {
        throw new Error("Employé non trouvé"); // Ajoutez cette ligne
    }

      const personnalInfos =  {
        name: info.prenom ? `${info.nom} ${info.prenom}` : `${info.nom}`,
        email: info.compte.email,
        photo: info.photoProfile ? info.photoProfile : "avatar.png",
        dernier: info.compte.derniereConnexion ? info.compte.derniereConnexion : null,
        poste: info.poste.designPoste,
      }

      return personnalInfos;
    }
  
    //Confirmation du mot de passe
    async setPassword(token: string, newPassword: string) {
      try {
        // verifier le token
        const decoded = this.jwtService.decode(token); // using verify method from JwtService
        const { email } = decoded as { email: string };
  
        // verifier l'employe
        const employeeAccount = await this.prisma.compte_Utilisateur.findUnique({ where: { email } });
        if (!employeeAccount) throw new NotFoundException('Token invalid ou employe non existant');
        if(employeeAccount.password) throw new BadRequestException('Lien déjà utilisé !');
  
        // crypter le mot de passe
        const hashedpwd = await this.passwordService.hashPassword(newPassword);
        await this.prisma.compte_Utilisateur.update({
          where: { email },
          data: { password: hashedpwd },
        });
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
    

 }


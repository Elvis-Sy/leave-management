/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PasswordService } from 'src/auth/authentication/password.service';
import { AddEmployeDto, ModifEmployeDto } from 'src/dto/employeDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/utils/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EmployeService { 
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordService: PasswordService,
        private readonly mailer: MailerService,
        private readonly jwtService: JwtService
    ){}

    //Ajout des employes
    // async addEmploye(employeDto: AddEmployeDto, p0?: { profile: string; }){
    //   const { email, password, idManager, idposte, ...employeData } = employeDto;

    //   //Verifier si il possede deja un compte
    //   const existe = await this.prisma.compte_Utilisateur.findUnique({where: {email}});
    //   if(existe) throw new ConflictException('Employe possedant deja un compte');

    //   //Send confirmation email
    //   await this.mailer.sendSignupConfirmation(email);

    //   //Hasher le mot de passe
    //   const hashedpwd = await this.passwordService.hashPassword(password);

    //   await this.prisma.employes.create({
    //     data: {
    //         ...employeData,

    //         photoProfile: p0.profile,

    //         manager: idManager ? { connect: { idEmploye: idManager } } : undefined,

    //         poste: { connect: { idPoste: idposte } },

    //         compte: {
    //             create: {
    //                 email,
    //                 password: hashedpwd,
    //                 role: 'Employe',
    //                 derniereConnexion: new Date(),
    //             },
    //         },
    //     },
    //   });
       
    // }

    //Affichage tout les employes
    async allEmploye(){
      const employes = await this.prisma.employes.findMany({
        include: {
          manager: {
            select: {
              nom: true,
              prenom: true,
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
          }
        },
      });

      const rows = employes.map((data)=>{
        return {
          id: data.idEmploye,
          employeId: data.CIN,
          name: `${data.nom} ${data.prenom}`,
          email: data.compte.email,
          manager: data.manager ? `${data.manager.nom} ${data.manager.prenom}` : null,
          photo: '/illustration2.png',
          DateEmb: data.dateEmbauche,
          Etablissement: "Direction informatique",
          poste: data.poste.designPoste,
        }
      })

      return rows;
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
          }
            
        }
      });

      const rows = manager.map((data)=>{
        return {
          id: data.idEmploye,
          managerId: data.CIN,
          name: `${data.nom} ${data.prenom}`,
          email: data.compte.email,
          photo: data.photoProfile,
          etablissement: "Direction informatique",
          nbrSub: data._count.subordonne,
          poste: data.poste.designPoste,
        }
      })

      return rows;
    }

    //Suppression d'employe
    async deleteEmploye(idEmploye: number){

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
              prenom: true,
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
          }
        },
      });

      return employes;
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
          }
        }
      });

      return manager;
    }

    //Modification information employe
    async updateEmploye(idEmploye: number, modifEmployeDto: ModifEmployeDto){
      const { idManager, idposte, ...employeData } = modifEmployeDto;

      await this.prisma.employes.update({
        where:{
          idEmploye
        },
        data: {
          ...employeData,

          manager: idManager ? { connect: { idEmploye: idManager } } : undefined,
          poste: { connect: { idPoste: idposte } },
        },
      });
    }

    //Information personnelle
    async personalInfo(id: number){
      const info = await this.prisma.employes.findFirst({
        where: {
          idEmploye: id
        },
        select: {
          nom: true,
          prenom: true,
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

      return info;
    }







    async addEmploye(employeDto: AddEmployeDto, p0?: { profile: string; }) {
      const { email, idManager, idposte, password, ...employeData } = employeDto;
  
      // Check if the employee already has an account
      const existe = await this.prisma.compte_Utilisateur.findUnique({ where: { email } });
      if (existe) throw new ConflictException('Employe possedant deja un compte');
  
      // Generate a JWT token that expires in 24 hours
      const token = this.jwtService.sign({ email }, { secret: "congeSPAT", expiresIn: '24h' });
  
      // Send the email with the token
      await this.mailer.sendSignupConfirmation(email, token);
  
      // Create the employee record
      await this.prisma.employes.create({
        data: {
          ...employeData,
          photoProfile: p0.profile,
          manager: idManager ? { connect: { idEmploye: idManager } } : undefined,
          poste: { connect: { idPoste: idposte } },
          compte: {
            create: {
              email,
              password: "",
              role: 'Employe',
              derniereConnexion: null,
            },
          },
        },
      });
  
      // Schedule deletion if the employee doesn't set their password within 24 hours
      this.scheduleEmployeeDeletion(email, '1m');
    }
  
    //Confirmation du mot de passe
    async setPassword(token: string, newPassword: string) {
      try {
        // verifier le token
        const decoded = this.jwtService.decode(token); // using verify method from JwtService
        const { email } = decoded as { email: string };
  
        // verifier l'employe
        const employeeAccount = await this.prisma.compte_Utilisateur.findUnique({ where: { email } });
        if (!employeeAccount) throw new BadRequestException('Invalid token or employee does not exist');
  
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
      console.log(timeToWait)
      setTimeout(async () => {
        const employeeAccount = await this.prisma.compte_Utilisateur.findUnique({ where: { email } });
        if (!employeeAccount || employeeAccount.password === "") {
          await this.prisma.employes.delete({
            where: {
              idEmploye: employeeAccount.employeId
            }
          });
        }
        console.log("Time out")
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
    

 }

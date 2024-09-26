/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable } from '@nestjs/common';
import { PasswordService } from 'src/auth/authentication/password.service';
import { AddEmployeDto, ModifEmployeDto } from 'src/dto/employeDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeService { 
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordService: PasswordService
    ){}

    //Ajout des employes
    async addEmploye(employeDto: AddEmployeDto){
      const { email, password, idManager, idposte, ...employeData } = employeDto;

      //Verifier si il possede deja un compte
      const existe = await this.prisma.compte_Utilisateur.findUnique({where: {email}});
      if(existe) throw new ConflictException('Employe possedant deja un compte');

      //Hasher le mot de passe
      const hashedpwd = await this.passwordService.hashPassword(password);

      await this.prisma.employes.create({
        data: {
            ...employeData,

            manager: idManager ? { connect: { idEmploye: idManager } } : undefined,

            poste: { connect: { idPoste: idposte } },

            compte: {
                create: {
                    email,
                    password: hashedpwd,
                    role: 'Employe',
                    derniereConnexion: null,
                },
            },
        },
      });
       
    }

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
        },
      });

      return employes;
    }

    //Affichage tout les Manager
    async allManager(){
      const manager = await this.prisma.employes.findMany({
        where:{
          idManager: {
            equals: null
          }
        },
        select: {
          nom: true,
          prenom: true,
          CIN: true,
          subordonne: true,
          _count: {
            select: {subordonne: true}
          },
          poste: {
            select: {
              designPoste: true,
            },
          }
            
        }
      });

      return manager;
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
        },
      });

      return employes;
    }

    //Recherche de Manager
    async searchManager(value: string){
      const manager = await this.prisma.employes.findMany({
        where:{
          idManager: {
            equals: null
          },
          OR: [
            { nom: {contains: value} },
            { prenom: {contains: value} }
          ]
        },
        select: {
          nom: true,
          prenom: true,
          CIN: true,
          subordonne: true,
          _count: {
            select: {subordonne: true}
          },
          poste: {
            select: {
              designPoste: true,
            },
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

 }

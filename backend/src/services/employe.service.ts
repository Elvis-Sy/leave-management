/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable } from '@nestjs/common';
import { PasswordService } from 'src/auth/authentication/password.service';
import { EmployeDto } from 'src/dto/employeDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeService { 
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordService: PasswordService
    ){}

    //Ajouter des employes
    async addEmploye(employeDto: EmployeDto){
        const { email, password, ...employeData } = employeDto;

        //Verifier si il possede deja un compte
        const existe = await this.prisma.compte_Utilisateur.findUnique({where: {email}});
        if(existe) throw new ConflictException('Employe possedant deja un compte');

        //Hasher le mot de passe
        const hashedpwd = await this.passwordService.hashPassword(password);

        // Création de l'employé
        await this.prisma.employes.create({
            data: {
                ...employeData,
                compte: {
                    create: {
                        email,
                        password: hashedpwd,
                        role: 'Employe',
                        derniereConnexion: null
                    },
                },
            },
        });
       
    }

    //Afficher tout les employes
    async allEmploye(){
        const employes = await this.prisma.employes.findMany({
            include: {
              manager: {
                select: {
                  nom: true,
                  prenom: true,
                },
              },
            },
          });

        return employes;
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
 }

/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, } from '@nestjs/common';
import { EmployeService } from 'src/services/employe.service';
import { Request, Response } from 'express';
import { AddEmployeDto, ModifEmployeDto } from 'src/dto/employeDto';
import { JwtAuthGuard } from 'src/auth/authorization/auth.guard';
import { RolesGuard } from 'src/auth/authorization/authorization.guard';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { Role } from 'src/auth/authorization/roleEmploye.enum';
import { ConfigService } from '@nestjs/config';

@Controller('employes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeController { 
    constructor(private readonly employeService: EmployeService, private readonly configService: ConfigService){}

    @Post('ajout')
    @Roles(Role.EMPLOYE) //Admin
    async ajoutEmploye(@Body() employeDto: AddEmployeDto){
        try {
            await this.employeService.addEmploye(employeDto);
            return {
                message: 'Employé créé avec succès.',
            };
        } catch (error) {
            console.error("Erreur lors de l'ajout':", error);
            return{
                message: "Erreur lors de la creation"
            }
        }
    }

    @Get('all')
    @Roles(Role.EMPLOYE) //Admin
    async listEmploye(){
        try {
            const Employes = await this.employeService.allEmploye();
            return{
                message: 'Employés listés avec succès.',
                employe: Employes,
                secret: this.configService.get<string>('JWT_SECRET')
            }
        } catch (error) {
            console.error('Erreur lors du listage:', error);
            return{
                message: "erreur lors du listage des employes"
            }
        }
    }

    @Delete(':id')
    @Roles(Role.EMPLOYE) //Admin
    async suppEmploye(@Param('id') id: string){
        try {
            const parsedId = parseInt(id, 10);
            await this.employeService.deleteEmploye(parsedId);
            return {
                message: 'Employé supprimé avec succès.'
            };
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            return {
                message: "erreur lors de la suppression"
            };
        }
    }

    @Get('manager')
    @Roles(Role.EMPLOYE) //Admin
    async listManager(){
        try {
            const Managers = await this.employeService.allManager();
            return{
                message: 'Managers listés avec succès.',
                employe: Managers,
            }
        } catch (error) {
            console.error('Erreur lors du listage:', error);
            return{
                message: "erreur lors du listage des managers"
            }
        }
    }

    @Get('search/:value')
    @Roles(Role.EMPLOYE) //Admin
    async searchEmploye(@Param('value') val: string){
        try {
            const Employe = await this.employeService.searchEmploye(val);
            return{
                message: 'Employes listés avec succès, contenant: '+val+'.',
                employe: Employe,
            }
        } catch (error) {
            console.error('Erreur lors du listage:', error);
            return{
                message: "erreur lors de la recherche des employes"
            }
        }
    }

    @Get('manager/search/:value')
    @Roles(Role.EMPLOYE) //Admin
    async searchManager(@Param('value') val: string){
        try {
            const Manager = await this.employeService.searchManager(val);
            return{
                message: 'Managers listés avec succès, contenant: '+val+'.',
                employe: Manager,
            }
        } catch (error) {
            console.error('Erreur lors du listage:', error);
            return{
                message: "erreur lors de la recherche des managers"
            }
        }
    }

    @Patch(':id')
    @Roles(Role.EMPLOYE) //Admin
    async updateEmploye(@Param('id') id: string, @Body() modifEmploye: ModifEmployeDto){
        try {
            await this.employeService.updateEmploye(parseInt(id), modifEmploye);
            return{
                message: 'Employé modifié avec succès',
            }
        } catch (error) {
            console.error('Erreur lors du listage:', error);
            return{
                message: "erreur lors de la modification de l'employe"
            }
        }
    }
    
 }

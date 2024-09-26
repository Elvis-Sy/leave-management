/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Patch, Post, } from '@nestjs/common';
import { EmployeService } from 'src/services/employe.service';
import { Request, Response } from 'express';
import { AddEmployeDto, ModifEmployeDto } from 'src/dto/employeDto';

@Controller('employes')
export class EmployeController { 
    constructor(private readonly employeService: EmployeService){}

    @Post('ajout')
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
    async listEmploye(){
        try {
            const Employes = await this.employeService.allEmploye();
            return{
                message: 'Employés listés avec succès.',
                employe: Employes,
            }
        } catch (error) {
            console.error('Erreur lors du listage:', error);
            return{
                message: "erreur lors du listage des employes"
            }
        }
    }

    @Delete(':id')
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

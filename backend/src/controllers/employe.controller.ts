/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Post, } from '@nestjs/common';
import { EmployeService } from 'src/services/employe.service';
import { Request, Response } from 'express';
import { EmployeDto } from 'src/dto/employeDto';

@Controller('employes')
export class EmployeController { 
    constructor(private readonly employeService: EmployeService){}

    @Post('ajout')
    async ajoutEmploye(@Body() employeDto: EmployeDto){
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
            const nouvelEmploye = await this.employeService.allEmploye();
            return{
                message: 'Employés listés avec succès.',
                employe: nouvelEmploye,
            }
        } catch (error) {
            console.error('Erreur lors du listage:', error);
            return{
                message: "erreur lors du listage"
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
    
 }

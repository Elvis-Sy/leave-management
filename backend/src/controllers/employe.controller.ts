/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { EmployeService } from 'src/services/employe.service';
import { AddEmployeDto, ModifEmployeDto } from 'src/dto/employeDto';
import { JwtAuthGuard } from 'src/auth/authorization/auth.guard';
import { RolesGuard } from 'src/auth/authorization/authorization.guard';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { Role } from 'src/auth/authorization/roleEmploye.enum';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { NoAuthGuard } from 'src/auth/authorization/noauth.guard';

//Storage setting
const storage = {
    storage: diskStorage({
        destination: './profil',
        filename: (req, file, callback) => {
            // Générer un nom de fichier valide en remplaçant les caractères spéciaux
            const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
            const ext = file.originalname.split('.').pop();
            const filename: string = `${file.fieldname}_${timestamp}.${ext}`;
            
            callback(null, filename);
        },
    })
}

@Controller('employes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeController { 
    constructor(private readonly employeService: EmployeService, private readonly configService: ConfigService){}

    @Post('ajout')
    @UseInterceptors(FileInterceptor('file', storage))
    @Roles(Role.ADMIN) //Admin
    async ajoutEmploye(@Body() employeDto: AddEmployeDto, @UploadedFile() file: Express.Multer.File){
        try {
            const filename = file ? file.filename : ""
            await this.employeService.addEmploye(employeDto, {profile: filename});
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
    @Roles(Role.ADMIN) //Admin
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
    @Roles(Role.ADMIN) //Admin
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
    @Roles(Role.ADMIN) //Admin
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
    @Roles(Role.ADMIN) //Admin
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
    @Roles(Role.ADMIN) //Admin
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
    @Roles(Role.ADMIN) //Admin
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

    @Get(':id')
    @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYE) //Admin
    async infoPerso(@Param('id') id: string){
        try {
            const info = await this.employeService.personalInfo(parseInt(id));
            return{
                message: 'Votre information',
                info: info
            }
        } catch (error) {
            console.error('Erreur d\'information:', error);
            return{
                message: "erreur lors du listage de vos infos"
            }
        }
    }

    @Post('set-password/:token')
    @UseGuards(NoAuthGuard)
    async setPassword(@Param('token') token: string, @Body('newPassword') newPassword: string) {
        return await this.employeService.setPassword(token, newPassword);
    }
    
 }

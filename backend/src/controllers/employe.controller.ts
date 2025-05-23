/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { EmployeService } from 'src/services/employe.service';
import { AddEmployeDto, ModifEmployeDto } from 'src/dto/employeDto';
import { JwtAuthGuard } from 'src/auth/authorization/auth.guard';
import { RolesGuard } from 'src/auth/authorization/authorization.guard';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { Role } from 'src/auth/authorization/roleEmploye.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'

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
export class EmployeController { 
    constructor(private readonly employeService: EmployeService){}

    @Post('ajout')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('photoProfile', storage))
    @Roles(Role.ADMIN) //Admin
    async ajoutEmploye(@UploadedFile() photoProfile: Express.Multer.File, @Request() req){
        try {
            const employeDto = req.body;
            employeDto.CIN = employeDto.CIN
            employeDto.idposte = Number(employeDto.idposte)
            employeDto.idEtablissement = Number(employeDto.idEtablissement)
            employeDto.periodeEssai = employeDto.periodeEssai == '1' ? true : false;
            if(employeDto.dateEmbauche){
                employeDto.dateEmbauche = new Date(employeDto.dateEmbauche)
            }
            if(employeDto.idManager){
                employeDto.idManager = Number(employeDto.idManager)
            }
            const filename = photoProfile ? photoProfile.filename : null
            await this.employeService.addEmploye(employeDto, {profile: filename});
            return {
                message: "Demande de confirmation envoyée avec succes. ",
            };
        } catch (error) {
            console.error("Erreur lors de l'ajout':", error);
            return{
                message: "Erreur lors de la creation",
                cause: error.message
            }
        }
    }

    @Get('all')
    @UseGuards(JwtAuthGuard, RolesGuard)
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

    @Get('all/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER) //Admin
    async listEmployeSpecified(@Param('id') id: string){
        try {
            const Employes = await this.employeService.allEmployeSpecified(parseInt(id));
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

    @Patch('delete/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN) //Admin
    async suppEmploye(@Param('id') id: string){
        try {
            const parsedId = parseInt(id, 10);
            await this.employeService.deleteEmploye(parsedId);
            return {
                message: 'Employé archivé.'
            };
        } catch (error) {
            console.error('Erreur lors de l\'archive:', error);
            return {
                message: "Erreur lors de l'archive"
            };
        }
    }

    @Get('manager')
    @UseGuards(JwtAuthGuard, RolesGuard)
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

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('photoProfile', storage))
    @Roles(Role.ADMIN) //Admin
    async updateEmploye(@Param('id') id: string, @Request() req, @UploadedFile() photoProfile: Express.Multer.File){
        try {
            const employeDto = req.body;
            employeDto.CIN = employeDto.CIN
            employeDto.idposte = Number(employeDto.idposte)
            employeDto.idEtablissement = Number(employeDto.idEtablissement)
            employeDto.periodeEssai = employeDto.periodeEssai == '1' ? true : false;
            if(employeDto.dateEmbauche){
                employeDto.dateEmbauche = new Date(employeDto.dateEmbauche)
            } else {
                employeDto.dateEmbauche = null
            }
            if(employeDto.idManager){
                employeDto.idManager = Number(employeDto.idManager)
            } else {
                employeDto.idManager = null
            }
            const filename = photoProfile ? photoProfile.filename : ""
            await this.employeService.updateEmploye(parseInt(id), employeDto, {profile: filename});
            return{
                message: 'Employé modifié avec succès',
            }
        } catch (error) {
            console.error('Erreur lors du listage:', error);
            return{
                message: "erreur lors de la modification de l'employe",
                cause: error.message
            }
        }
    }

    @Get('info/:email')
    @UseGuards(JwtAuthGuard)
    async infoPerso(@Param('email') email: string){
        try {
            const info = await this.employeService.personalInfo(email);
            return{
                message: 'Votre information',
                info: info
            }
        } catch (error) {
            console.error('Erreur d\'information:', error);
            return{
                message: error.message
            }
        }
    }

    @Post('set-password/:token')
    async setPassword(@Param('token') token: string, @Body('password') newPassword: string) {
        try {
            await this.employeService.setPassword(token, newPassword);
            return "Confirmation réalisée avec succès"
        } catch (error) {
            return {
                statut: "Lien expiré ou déjà utilisé"
            }
            
        }
        
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN) //Admin
    @Get('filtre')
    async filtreEmp(
        @Query('etablissement') etablissement?: string,
        @Query('dateDebut') dateDebut?: string,
        @Query('dateFin') dateFin?: string,
    ) {
        try {
            const employe = await this.employeService.filtreEmploye(etablissement, dateDebut, dateFin);
            return {
                message: "Employe filtre",
                employe: employe
            }
        } catch (error) {
            console.error('Erreur de filtre:', error);
            return{
                message: error.message
            }
            
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN) //Admin
    @Get('managerFiltre')
    async filtreMg(
        @Query('etablissement') etablissement?: string,
    ) {
        try {
            const manager = await this.employeService.filtreManager(etablissement);
            return {
                message: "Manager filter",
                employe: manager
            }
        } catch (error) {
            console.error('Erreur de filtre:', error);
            return{
                message: error.message
            }
            
        }
    }

    @Get('supperieur')
    async getSupperieur(){
        try {
            const supperieur = await this.employeService.Supperieur()
            return {
                message: "Supperieur liste avec succes",
                supp: supperieur
            }
        } catch (error) {
            return {
                message: "Erreur lors du listage des supperieur",
                cause: error
            }
        }
    }

    @Get('modif/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGER) //Admin
    async modifInfo(@Param('id') id: string){
        try {
            const modif = await this.employeService.info(parseInt(id))
            return {
                message: "Information pour la modification",
                info: modif
            }
        } catch (error) {
            return {
                message: "Erreur lors du listage des infos",
                cause: error
            }
        }
    }

    @Get('supplementaire/:id')
    @UseGuards(JwtAuthGuard)
    async infoSupp(@Param('id') id: string){
        try {
            const supp = await this.employeService.supplementaire(parseInt(id))
            return {
                message: "Info supplementaire liste avec succes",
                info: supp
            }
        } catch (error) {
            return {
                message: "Erreur lors du listage des infos",
                cause: error
            }
        }
    }

    @Get('recents/:id')
    @UseGuards(JwtAuthGuard)
    async recentAction(@Param('id') id: string){
        try {
            const recent = await this.employeService.lastManagerAction(parseInt(id))
            return {
                message: "Derniere actions liste avec succes",
                recent: recent
            }
        } catch (error) {
            return {
                message: "Erreur lors du listage des actions",
                cause: error
            }
        }
    }

    @Get(':id/soldes')
    @UseGuards(JwtAuthGuard)
    async getSoldes(@Param('id') id: string) {
        try {
            const solde = await this.employeService.SoldesConges(parseInt(id))
            return {
                message: "Solde conge liste avec succes",
                solde: solde
            }
        } catch (error) {
            return {
                message: "Erreur lors du listage des soldes",
                cause: error
            }
        }
    }

    @Post('deconnex')
    @UseGuards(JwtAuthGuard)
    async deconnexion(@Body() email){
        try {
            const mail = email.email;
            await this.employeService.deconnex(mail)
            return {
                message: "Deconnexion de l'utilisateur",
            }
        } catch (error) {
            return {
                message: "Erreur lors de la deconnexion",
                cause: error
            }
        }
    }

    @Get('employe/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYE, Role.MANAGER) //Employe
    async personal(@Param('id') id: string){
        try {
            const info = await this.employeService.EmployeInfo(parseInt(id))
            return {
                message: "Information pour les employes",
                info: info
            }
        } catch (error) {
            return {
                message: "Erreur lors du listage des infos",
                cause: error
            }
        }
    }

    @Post('employeSearch/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYE, Role.MANAGER) //Employe
    async searchPersonal(@Param('id') id: string, @Body() val){
        try {
            const info = await this.employeService.EmployeInfo(parseInt(id))
            return {
                message: "Information pour les employes",
                info: info
            }
        } catch (error) {
            return {
                message: "Erreur lors du listage des infos",
                cause: error
            }
        }
    }

    @Get('collegue/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYE) //Employe
    async Collegue(@Param('id') id: string){
        try {
            const memb = await this.employeService.listeCollegue(parseInt(id))
            return {
                message: "Membre liste avec succes",
                employe: memb
            }
        } catch (error) {
            return {
                message: "Erreur lors du listage",
                cause: error
            }
        }
    }
    
 }

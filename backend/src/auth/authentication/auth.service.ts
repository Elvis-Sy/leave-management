/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/loginDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs'
import { NotificationService } from 'src/utils/notifications/notification.service';

@Injectable()
export class AuthService { 
    constructor(
        private readonly prisma: PrismaService, 
        private readonly jwtService: JwtService, 
        private readonly notification: NotificationService){}

    async login(loginDto: LoginDto){
        const {email, password} = loginDto;
        const existe = await this.prisma.compte_Utilisateur.findUnique({where: {email}});

        if(!existe) throw new NotFoundException("L'email fourni est introuvable...");

        const validatePassword = await bcrypt.compare(password, existe.password)

        if(!validatePassword){
            throw new BadRequestException("Mot de passe incorrecte");
        }

        const { role, employeId } = existe;

        if(role == 'Admin'){
            await this.notification.demandeNotifAdmin();
        } else if(role == 'Manager'){
            await this.notification.demandeNotifManager(employeId)
        }

        return {
            token: this.jwtService.sign({email, role, employeId}, { secret: 'congeSPAT' })
        }
    }

 }

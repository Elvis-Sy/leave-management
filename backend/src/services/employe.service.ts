/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Employes } from 'src/models/employe.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeService { 
    constructor(private prisma: PrismaService){}

    //Tout les employes
    async getAllEmploye():Promise<Employes[]>{
        return this.prisma.employes.findMany();
    }
 }

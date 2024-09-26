/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { AddDemandeDto } from 'src/dto/demandeDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DemandeService {
    constructor(private readonly prisma: PrismaService,){}

    //Ajout demandes
    async addDemande(demandeDto: AddDemandeDto){
        const { employeId, typeId, statutId, ...demande } = demandeDto;

        await this.prisma.demandesConges.create({
            data: {
                ...demande,
                employe: { connect: { idEmploye: employeId } },
                type: { connect: { idType: typeId } },
                statuts: { connect: { idStatut: statutId } }
            },
          });
    }

}

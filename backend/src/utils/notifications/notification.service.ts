/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService { 
    constructor(private readonly prisma: PrismaService, private readonly notificationGateway: NotificationGateway){}

    //Notification
    async demandeNotifAdmin() {
        const newRequest = await this.prisma.demandesConges.count({
          where: {
            OR: [
                {
                    statuts: {
                        designStatut: 'En revision' // Filtre les demandes avec le statut "En révision"
                    }
                },
                {
                    employe: {
                        idManager: null, // Inclure les employés sans manager
                    },
                    statuts: {
                        designStatut: 'En attente' // Filtre les demandes avec le statut "En attente"
                    }
                }
            ]
          }
        });
    
        this.notificationGateway.sendNotificationAdmin(newRequest);
    }

    //Notification Manager
    async demandeNotifManager(idManager: number){
        const newRequest = await this.prisma.demandesConges.count({
          where: {
            statuts: {
                designStatut: 'En attente'
            },
            employe: {
              idManager
            }
          }
        })

        this.notificationGateway.sendNotificationManager(newRequest);
    }

 }

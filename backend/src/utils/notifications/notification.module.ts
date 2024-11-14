import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [],
    providers: [
        NotificationService, NotificationGateway],
})
export class NotificationModule { }

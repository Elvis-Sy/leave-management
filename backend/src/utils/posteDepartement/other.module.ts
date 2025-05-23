import { OtherService } from './other.service';
import { OtherController } from './other.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/authorization/auth.guard';
import { RolesGuard } from 'src/auth/authorization/authorization.guard';

@Module({
    imports: [],
    controllers: [
        OtherController, ],
    providers: [
        OtherService, JwtAuthGuard, RolesGuard],
})
export class OtherModule {}

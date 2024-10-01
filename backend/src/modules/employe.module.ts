import { PasswordService } from 'src/auth/authentication/password.service';
import { EmployeController } from './../controllers/employe.controller';
import { EmployeService } from './../services/employe.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/authorization/auth.guard';
import { RolesGuard } from 'src/auth/authorization/authorization.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [],
    controllers: [
        EmployeController,],
    providers: [
        EmployeService, PasswordService, JwtAuthGuard, RolesGuard, JwtService],
})
export class EmployeModule { }

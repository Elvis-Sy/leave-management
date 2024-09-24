import { EmployeController } from './../controllers/employe.controller';
import { EmployeService } from './../services/employe.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        EmployeController,],
    providers: [
        EmployeService,],
})
export class EmployeModule { }

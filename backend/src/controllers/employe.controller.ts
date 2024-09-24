/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Req, Res } from '@nestjs/common';
import { EmployeService } from 'src/services/employe.service';
import { Request, Response } from 'express';

@Controller('employes')
export class EmployeController { 
    constructor(private readonly employeService: EmployeService){}

    @Get()
    async getAllEmploye(@Req() request: Request, @Res() response: Response):Promise<any>{
        try{
            const result = await this.employeService.getAllEmploye();
            return response.status(200).json({
                status: 'ok!',
                message: 'Successfully fetch data',
                result: result
            })
        }catch(err){
            return response.status(500).json({
                status: 'ok!',
                message: 'Internal server',
            })
        }
    }
 }

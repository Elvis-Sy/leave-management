/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/loginDto';

@Controller("auth")
export class AuthController { 
    constructor(private readonly authService: AuthService){}

    @Post("login") 
    async login(@Body() loginDto: LoginDto){
        try {
            const result = await this.authService.login(loginDto)
            return {
                state: "ok",
                message: "successfuly login !",
                result: result
            }
        } catch (error) {
            console.error("Erreur lors du login:", error);
            return{
                state: "error",
                message: error.message,
            }
        }
    }
 }

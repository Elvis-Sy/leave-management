import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";


export class LoginDto {

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;
}
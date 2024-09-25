import { IsNotEmpty, IsString, IsOptional, IsInt, IsEmail, IsBoolean, Length } from 'class-validator';

export class EmployeDto {
    @IsNotEmpty()
    @IsString()
    readonly nom: string;

    @IsOptional()
    @IsString()
    readonly prenom?: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 1)
    readonly sexe: string;

    @IsNotEmpty()
    @IsInt()
    readonly CIN: number;

    @IsNotEmpty()
    readonly dateEmbauche: Date;

    @IsNotEmpty()
    @IsBoolean()
    readonly periodeEssai: boolean;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsOptional()
    @IsInt()
    readonly idManager?: number;
}
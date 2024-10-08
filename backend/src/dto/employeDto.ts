import { IsNotEmpty, IsString, IsOptional, IsInt, IsEmail, IsBoolean, Length, IsDate } from 'class-validator';

//Pour l'ajout
export class AddEmployeDto {
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
    @IsString()
    readonly CIN: string;

    @IsNotEmpty()
    readonly dateEmbauche?: Date;

    @IsNotEmpty()
    readonly periodeEssai: boolean;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsOptional()
    readonly idManager?: number;

    @IsNotEmpty()
    readonly idposte: number

    @IsNotEmpty()
    readonly idEtablissement: number

}

//Pour la modification
export class ModifEmployeDto {
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
    @IsString()
    readonly CIN: string;

    @IsNotEmpty()
    readonly dateEmbauche?: Date;

    @IsOptional()
    @IsInt()
    readonly idManager?: number;

    @IsNotEmpty()
    @IsInt()
    readonly idposte: number

    @IsNotEmpty()
    @IsInt()
    readonly idEtablissement: number
}
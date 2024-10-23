import { IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class AddDemandeDto {

    @IsNotEmpty()
    readonly dateDebut: Date;

    @IsNotEmpty()
    readonly dateFin: Date;

    @IsOptional()
    readonly dateEnvoie: Date;

    @IsNotEmpty()
    @IsInt()
    readonly employeId: number;

    @IsNotEmpty()
    @IsInt()
    readonly typeId: number;

    @IsOptional()
    @IsInt()
    readonly statutId: number;

}
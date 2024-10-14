import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class FerrierDto {

    dateFeriee: Date;

    @IsString()
    @IsNotEmpty()
    label: string;

    @IsString()
    @IsOptional()
    description: string;
}
import { Prisma } from "@prisma/client";

export class Employes implements Prisma.EmployesCreateInput{
    nom: string;
    prenom?: string | null;
    sexe: string;
    CIN: number;
    dateEmbauche: Date | string;
    periodeEssai: boolean;
    manager?: Prisma.EmployesCreateNestedOneWithoutSubordonneInput;
    subordonne?: Prisma.EmployesCreateNestedManyWithoutManagerInput;
    compte?: Prisma.Compte_UtilisateurCreateNestedManyWithoutUtilisateurInput;
}
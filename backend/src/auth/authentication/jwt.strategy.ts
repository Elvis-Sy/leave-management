import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prismaService: PrismaService, private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_SECRET"),
        });
    }

    async validate(payload: { email: string }) {
        const user = await this.prismaService.compte_Utilisateur.findUnique({
            where: {
                email: payload.email,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Email invalide ! Veuillez vérifier...');
        }

        const employe = await this.prismaService.employes.findFirst({
            where: {
                compte: {
                    email: user.email,
                },
            },
        });

        return { ...employe, roles: [user.role] }; // Assurez-vous que l'employé est retourné avec les informations nécessaires.
    }
}
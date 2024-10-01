import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { EmployeService } from 'src/services/employe.service';
import { EmployeModule } from 'src/modules/employe.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordService } from './password.service';

@Module({
    imports: [
        ConfigModule,
        EmployeModule, 
        PassportModule, 
        JwtModule.registerAsync({
            imports: [ConfigModule], // Ajoutez ConfigModule ici
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'congeSPAT',
                signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE_IN') },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, JwtStrategy, EmployeService, PasswordService],
})
export class AuthModule {}
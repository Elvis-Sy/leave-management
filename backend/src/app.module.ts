import { MailerModule } from './utils/mailer/mailer.module';
import { DemandeModule } from './modules/demande.module';
import { EmployeModule } from './modules/employe.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/authentication/auth.module';

@Module({
  imports: [
    MailerModule,
    DemandeModule,
    EmployeModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule
  ],
})
export class AppModule { }

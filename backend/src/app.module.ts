import { FerrierModule } from './modules/ferrier.module';
import { OtherModule } from './utils/posteDepartement/other.module';
import { MailerModule } from './utils/mailer/mailer.module';
import { DemandeModule } from './modules/demande.module';
import { EmployeModule } from './modules/employe.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/authentication/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    FerrierModule,
    OtherModule,
    MailerModule,
    DemandeModule,
    EmployeModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'profil')
    })
  ],
})
export class AppModule { }

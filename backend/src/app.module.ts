
import { EmployeModule } from './modules/employe.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    EmployeModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true })
  ],
})
export class AppModule { }

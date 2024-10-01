import { MailerService } from './mailer.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
    imports: [],
    providers: [
        MailerService, ],
    exports: [MailerService]
})
export class MailerModule {}

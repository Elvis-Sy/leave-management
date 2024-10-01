/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailerService {
    private async transporter() {

        //local pour les tests
        // const testAccount = await nodemailer.createTestAccount()
        // const transport = nodemailer.createTransport({
        //     host: "localhost", // Par exemple, MailHog tourne souvent sur localhost
        //     port: 1025,        // Le port de MailHog ou smtp4dev
        //     ignoreTLS: false,
        //     auth: {
        //         user: testAccount.user, // Si nécessaire, sinon vous pouvez le laisser vide
        //         pass: testAccount.pass  // Si nécessaire, sinon vous pouvez le laisser vide
        //     },
        // });

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'andriamanantena48@gmail.com',  // Remplacez par votre email
                pass: 'rdxvyqlvttexlzov',   // Remplacez par votre mot de passe ou un mot de passe d'application
            },
        });



        return transport;
    }

    async sendSignupConfirmation(employeEmail: string) {
        const transporter = this.transporter();
        await (await transporter).sendMail({
            from: "spatDRH@gmail.com",
            to: employeEmail,
            subject: "Inscription",
            html: "<a href='http://localhost:5555/'>Confirmation link...</a>"
        })
    }
}

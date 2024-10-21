/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailerService {
    private async transporter() {

        // local pour les tests
        // const testAccount = await nodemailer.createTestAccount()
        // const transport = nodemailer.createTransport({
        //     host: "localhost", // Par exemple, MailHog tourne souvent sur localhost
        //     port: 1025,        // Le port de MailHog ou smtp4dev
        //     ignoreTLS: false,
        //     auth: null
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

    async sendSignupConfirmation(employeEmail: string, nom: string, token: string) {
        const transporter = this.transporter();
        await (await transporter).sendMail({
            from: "spatDRH@gmail.com",
            to: employeEmail,
            subject: "Inscription",
            html: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Lien de confirmation</title>
                    </head>
                    <body style="padding: 10px;">
                        <h1 style="color: #1d71b8; font-family: sans-serif;">Gestion de congés</h1>
                        <p style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 400;">
                            Bonjour Monsieur/Madame <span style="font-weight: 500;">${nom}</span>, <br/>
                            Vous avez été enregistré dans notre système dans le but de faciliter les demandes de congés. <br/>
                            Pour finaliser votre enregistrement, veuillez suivre le lien de confirmation suivant et configurer votre mot de passe:
                        </p>
                        <a href='http://localhost:3000/register/${token}' style="color: #1d72b8ad; font-size: larger; margin-left: 10px;">Lien de confirmation...</a> <br>
                        <p style="color: gray; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size:medium; "><span style="font-weight: 500;">NB:</span> Le lien ne sera plus valide après les prochaines 48h.</p>
                    </body>
                    </html>`
        })
    }
}

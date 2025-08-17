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
            from: employeEmail,
            to: 'elvissy04@gmail.com',
            subject: "Bienvenue dans le système de gestion des congés - SPAT",
            html: `<!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmation d'inscription</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f7f9fc;
                            color: #333;
                            line-height: 1.6;
                            margin: 0;
                            padding: 0;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 20px auto;
                            padding: 20px;
                            background: #ffffff;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #1d71b8;
                            color: #fff;
                            padding: 10px;
                            text-align: center;
                            border-radius: 8px 8px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                        }
                        .content p {
                            margin: 15px 0;
                        }
                        .content a {
                            display: inline-block;
                            background-color: #1d71b8;
                            color: #fff;
                            text-decoration: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            font-size: 16px;
                            margin-top: 10px;
                        }
                        .content a:hover {
                            background-color: #155a8e;
                        }
                        .footer {
                            text-align: center;
                            color: #777;
                            font-size: 12px;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <h1>Bienvenue chez SPAT</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour <strong>${nom}</strong>,</p>
                            <p>
                                Nous sommes ravis de vous accueillir dans notre système de gestion des congés.
                                Cet outil vous permettra de gérer facilement vos demandes de congés et bien plus encore.
                            </p>
                            <p>
                                Pour finaliser votre inscription et configurer votre mot de passe, veuillez cliquer sur le bouton ci-dessous :
                            </p>
                            <a href="http://localhost:3000/register/${token}" target="_blank">
                                Finaliser mon inscription
                            </a>
                            <p>
                                <strong>Note :</strong> Ce lien est valable uniquement pour les prochaines <strong>48 heures</strong>. Passé ce délai, il expirera automatiquement.
                            </p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} SPAT - Tous droits réservés.</p>
                            <p>Ceci est un email automatique. Merci de ne pas y répondre.</p>
                        </div>
                    </div>
                </body>
                </html>`
        })
    }

    async sendLeaveRequestResponse(employeEmail: string, nom: string, status: "Approuvée" | "Refusée", motifRefus?: string) {
        const transporter = this.transporter();
        const isApproved = status === "Approuvée";
    
        await (await transporter).sendMail({
            from: employeEmail,
            to: 'youremail@gmail.com',
            subject: `Réponse à votre demande de congé - ${status}`,
            html: `<!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Réponse à votre demande de congé</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f7f9fc;
                            color: #333;
                            line-height: 1.6;
                            margin: 0;
                            padding: 0;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 20px auto;
                            padding: 20px;
                            background: #ffffff;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: ${isApproved ? "#28a745" : "#dc3545"};
                            color: #fff;
                            padding: 10px;
                            text-align: center;
                            border-radius: 8px 8px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                        }
                        .content p {
                            margin: 15px 0;
                        }
                        .footer {
                            text-align: center;
                            color: #777;
                            font-size: 12px;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <h1>${isApproved ? "Demande Approuvée" : "Demande Refusée"}</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour <strong>${nom}</strong>,</p>
                            <p>
                                Votre demande de congé a été <strong>${status}</strong>.
                            </p>
                            ${
                                isApproved
                                    ? `<p>Nous vous souhaitons un excellent congé et restons disponibles en cas de besoin.</p>`
                                    : `<p>
                                        Malheureusement, votre demande a été refusée pour la raison suivante :
                                        <blockquote style="color: #dc3545; font-style: italic; border-left: 4px solid #dc3545; padding-left: 10px;">
                                            ${motifRefus || "Motif non précisé."}
                                        </blockquote>
                                    </p>`
                            }
                            <p>
                                Si vous avez des questions, n'hésitez pas à contacter votre responsable.
                            </p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} SPAT - Tous droits réservés.</p>
                            <p>Ceci est un email automatique. Merci de ne pas y répondre.</p>
                        </div>
                    </div>
                </body>
                </html>`
        });
    }
}

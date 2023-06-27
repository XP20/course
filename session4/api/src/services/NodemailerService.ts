import nodemailer from "nodemailer";

export class NodemailerService {
    constructor() {
        this.email_source = 'source@gmail.com'
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: this.email_source,
                pass: 'passphrase'
            }
        });
    }

    public transporter;
    public email_source;

    public async sendEmail(html: string, subject: string, target: string): Promise<void> {
        let result = await this.transporter.sendMail({
            from: this.email_source,
            to: target,
            subject: subject,
            html: html,
        });
    }
}
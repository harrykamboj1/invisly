import { WELCOME_EMAIL_TEMPLATE } from "./template";
import nodemailer from 'nodemailer';

type WelcomeEmailData = {
    email: string;
    name: string;
    intro: string;
};

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    }
})

export const sendWelcomeEmail = async({email,name,intro}:   WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace('{{name}}', name).replace('{{intro}}', intro);

    const mailOptions = {
        from: `"Invisly" <invisly@gmail.com>`,
        to: email,
        subject: `Welcome to Invisly.ai - your stock market toolkit is ready!`,
        text: 'Thanks for joining Invisly',
        html: htmlTemplate,
    }
    await transporter.sendMail(mailOptions);

}
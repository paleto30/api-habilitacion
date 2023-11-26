"use strict"

import nodemailer from 'nodemailer';

// creacion del nodemailer
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    tls:{
        rejectUnauthorized: false
    },
    auth: {
        user: "afgalvispereira@uts.edu.co",
        pass: "4fgp.1007438904"
    }
});




export const sendEmail = async (emailUser, subject, template) =>{
    try {
        const info = await transporter.sendMail({
            from: "afgalvispereira@uts.edu.co", // de 
            to: emailUser,
            subject: subject,
            html: template
        });

        return info;
    } catch (error) {
        throw error;
    }
}
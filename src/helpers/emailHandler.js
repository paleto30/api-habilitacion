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
        user: "601a918a1d5e83",
        pass: "3b9e1b4065929b"
    }
});




export const sendEmail = async (emailUser, subject, template) =>{
    try {
        const info = await transporter.sendMail({
            from: "601a918a1d5e83", // de 
            to: emailUser,
            subject: subject,
            html: template
        });

        return info;
    } catch (error) {
        throw error;
    }
}
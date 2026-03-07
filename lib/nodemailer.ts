import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
<<<<<<< HEAD
    host: "smtp.gmail.com",
    port: 465,
=======
    host: process.env.SMTP_HOST,
    port:  Number(process.env.SMTP_PORT),
>>>>>>> prod
    secure: true,
    auth:{
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_APP_PASSWORD
    }
})

export default transporter

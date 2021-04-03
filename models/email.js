const nodemailer = require('nodemailer');
const nodemailerCramMd5 = require('nodemailer-cram-md5');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'custom',
        method: 'CRAM-MD5',
        user: 'manojkumarbagewadi4617@gmail.com',
        pass: 'Manoj 5051'
    },
    customAuth: {
        'CRAM-MD5': nodemailerCramMd5
    }
});

transporter.sendMail({
    from: 'manojsainikwod4617@gmail.com',
    to: 'synslyare@gmail.com',
    subject: 'hello world!',
    text: 'hello!'
}, console.log)
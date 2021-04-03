const nodemailer  = require('nodemailer');
const path = require('path')
const mailIt = (main,f)=>{
    // console.log(main)
    let mailTransporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
          user: main.emailID,
          pass: main.pass
        }
      })
      if(f){
         var mailOptions = {
            from: main.emailID,
            to: main.toSend,
            subject: main.subject,
            text: main.mailBody,
            attachments: [
              {
                filename: f.filename,
                path: path.join(__dirname,'..','public/file-storage',f.filename)
              }
            ]
          };
        }
        else{
          var mailOptions = {
            from: main.emailID,
            to: main.toSend,
            subject: main.subject,
            text: main.mailBody
          };
        }
      mailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      });
}

module.exports = mailIt;
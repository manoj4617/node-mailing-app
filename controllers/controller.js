const jwt = require('jsonwebtoken');
const nodemailer  = require('nodemailer');
const User = require('../models/user');
var sortJsonArray = require('sort-json-array');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'Incorrect Email Id') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'Incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'my_little_secret', {
    expiresIn: maxAge
  });
};


module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.main = (req, res) => {
  res.render('main');
}
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.create({ email, password});
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id });
    }
    catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
   
  }

  module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    // var u = User.findOne({email}).sort({"emailSent.dateTime":-1});
    // console.log("sorted emails",u);
    try {
      var user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
      res.render('main',{user:user});
    }
    catch (err) {
      console.log(err)
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  }

  module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  }

  module.exports.send_mail =async (req, res) => {
    console.log(req.body);
    let mailTransporter = nodemailer.createTransport({
      service:'gmail',
      auth:{
        user: 'manojkumarbagewadi4617@gmail.com',
        pass: 'Manoj 5051'
      }
    })

    let message = {
      from: User.email,
      to: req.body.toSend,
      subject: req.body.subject,
      text: req.body.mailBody
    };

    // mailTransporter.sendMail(message, (err,info)=>{
    //   if(err){
    //     console.log('error occured' , err.message);
    //     return process.exit(1);
    //   }

    //   console.log(`Message sent ${info.messageId}`);
    //   console.log(`Preview URL ${nodemailer.getTestMessageUrl(info)}`);
      var d = new Date;
      d = d.toUTCString()
      d = d.slice(0,22)
      // var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
      //     d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
     var u = await User.findOneAndUpdate(
          { _id : req.body.userInfo },
          { $push:{"emailSent": [{
              "to":req.body.toSend,
              "subject": req.body.subject,
              "mailBody":req.body.mailBody,
              "files":req.body.fileSend,
              "dateTime":d,
              "schedule":req.body.schedule
            }]
          },
            function (error, success) {
              if (error) {
                  console.log("error in inserting document",error);
              } else {
                  console.log("document was inserted" , success);
              }
          }
        }
      )
      u = await User.find({_id : req.body.userInfo},"emailSent")
      console.log(typeof(u),u)
      res.status(200).json({ user: u});
    // });
  }
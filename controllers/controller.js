const  User  = require("../models/user");
const jwt = require('jsonwebtoken');
const nodemailer  = require('nodemailer');
const user = require('../models/user')

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
    
    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
      res.render('main');
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

  module.exports.send_mail = (req, res) => {
    console.log(req.body);
    
    nodemailer.createTestAccount((err, account)=>{
      if(err){
        console.log('Failed to create test account');
        return process.exit(1);
      }
    });

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'keon41@ethereal.email',
            pass: '9uc88nzPGu78rmAu59'
        }
    });

    let message = {
      from: user.email,
      to: req.body.toSend,
      subject: req.body.subject,
      text: req.body.mailBody
    };

    transporter.sendMail(message, (err,info)=>{
      if(err){
        console.log('error occured' , err.message);
        return process.exit(1);
      }

      console.log(`Message sent ${info.messageId}`);
      console.log(`Preview URL ${nodemailer.getTestMessageUrl(info)}`);
    })
  }
const jwt = require('jsonwebtoken');
const nodemailer  = require('nodemailer');
const User = require('../models/user');
const app = require('../index')
const fs = require('fs');
const path = require('path');
const mailIt = require('./mail_IT')

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

  const timeDifference = (hrs,min)=>{
    let time = new Date();
    let h = Math.abs(hrs - time.getHours()) * 3600 * 1000;
    let m = Math.abs(min - time.getMinutes()) * 60 * 1000;
    return (h + m);
  }
  module.exports.send_mail = async (req, res) => {
    // console.log(req.body)
    if(req.body.scheduleDate != 'NO'){
      var today = new Date();
      var x = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`
      today = new Date(x)
      var s = new Date(req.body.scheduleDate)
      var timeDiff = (s.getTime() - today.getTime());
      if(req.body.scheduleTime== ''){
        var ti = today.toLocaleTimeString();
        ti = ti.slice(0,5);
      }
      var time = new Date();
      console.log(req.body.scheduleTime , time)
      var hrs = parseInt(req.body.scheduleTime.slice(0,2));
      var mins = parseInt(req.body.scheduleTime.slice(3,5));
      var t = timeDifference(hrs,mins);
      if(timeDiff == 0){
        setTimeout(()=>{mailIt(req.body,req.file)},t);
      }
      else{
        let finalTimeDifference = timeDiff + t;
        setTimeout(()=>{mailIt(req.body,req.file)},finalTimeDifference)
      }
    }
    else{
      setTimeout(()=>{mailIt(req.body,req.file)},0);
    }
    if(req.file){
      var f = {
        data:fs.readFileSync(path.join(__dirname,'..','public/file-storage',req.file.filename)),
        contentType:req.file.mimetype,
        filename : req.file.filename
      }
    }
    else{
      f = null;
    }

    //   var d = new Date;
    //   d = d.toLocaleString()
    //  var u = await User.findOneAndUpdate(
    //       { _id : req.body.userinfo },
    //       { $push:{"emailSent": [{
    //           "to":req.body.toSend,
    //           "subject": req.body.subject,
    //           "mailBody":req.body.mailBody,
    //           "files":f,
    //           "dateTime":d,
    //           "schedule":req.body.schedule
    //         }]
    //       },
    //         function (error, success) {
    //           if (error) {
    //               console.log("error in inserting document",error);
    //           } else {
    //               console.log("document was inserted" , success);
    //           }
    //       }
    //     }
    //   )
    //   u = await User.find({_id : req.body.userinfo},"emailSent")
    //   res.status(200).json({ user: u});
  }
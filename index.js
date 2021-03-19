const express = require('express');
const app = express();
const authRouter = require('./routes/routes');
const mongoose = require('mongoose');
const server = require("http").Server(app);
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/middle');

const dburi = 'mongodb+srv://manoj4617:Manoj4617@cluster0.kktfa.mongodb.net/mailer';
mongoose.connect(dburi, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result)=>{
        server.listen(process.env.PORT || 4000);
        console.log("connected to database")
    })
    .catch((error)=> console.error(error));

app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());

app.get('*', checkUser);
app.get('/', (req, res) =>{
    res.render("home");
})
app.get('/mainpage', requireAuth, (req,res)=> res.render("main"));
app.use(authRouter);



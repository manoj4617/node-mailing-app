const express = require('express');
const app = express();
const authRouter = require('./routes/routes');
const mongoose = require('mongoose');
const server = require("http").Server(app);
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/middle');

const dburi = 'mongodb+srv://manoj4617:Manoj4617@cluster0.kktfa.mongodb.net/nodemail';
mongoose.connect(dburi, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result)=>{
        console.log("connected to database");
        server.listen(process.env.PORT || 4000);
    })
    .catch((error)=> console.error(error));


mongoose.set('useFindAndModify', false);
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
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

module.exports = app;



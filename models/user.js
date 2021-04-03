const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
// const emailSchema = require('./email')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, 'Please enter your Email ID'],
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true, 'Please enter an Password'],
        minlength:[6, 'Minimum password length is 6 characters']
    },
    emailSent:[
        {
            to:{
                type:String,
                required:true
            }
            ,
            subject:{
                type:String,
                required:false,
            },
            mailBody:{
                type:String,
                required:false,
            },
            files:{
                required:false,
                data:Buffer,
                contentType: String,
                filename:String
            },
            dateTime:{
                type:String,
                required:true
            },
            schedule:{
                type:String,
                required:false
            }
        }
    ]
});


// userSchema.pre('save', async function(next){
//     //hashing password
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password,salt);
//     next();
// });

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    console.log(user)
    if(user){
        const auth = await bcrypt.compare(password , user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect Email Id');
}

const User = mongoose.model('user', userSchema);
module.exports = User;
const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    subject:{
        type:String,
        required:false,
    },
    mailBody:{
        type:String,
        required:false,
    },
    files:{
        desc:String,
        data:Buffer,
        contentType: String
    }
});

module.exports = emailSchema;
const multer = require('multer');

const multerConfig = {
    storage: multer.diskStorage({
        destination: (req,file,next)=>{
            next(null,'./public/file-storage');
        },
        filename: (req,file,next)=>{
            console.log(file);
            console.log(req.body)
            var ext = file.mimetype.split('/')[1];
            if(file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
                ext = 'docx';
            }
            if(file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
                ext = 'xls';
            }
            if(file.mimetype == "application/vnd.openxmlformats-officedocument.presentationml.presentation"){
                ext = 'pptx';
            }
            next(null, file.fieldname + '-' + Date.now() + '.'+ext);
        }
    }),
    fileFilter : (req,file,next)=>{
        if(!file){
            next()
        }
        if(
            file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype == 'application/ppt' ||
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'application/pdf'||
            file.mimetype == "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ){
            console.log('file uploaded');
            next(null, true);
        } else{
            console.log('file format not supported');
            return next();
        }
    }
};

module.exports = multerConfig;
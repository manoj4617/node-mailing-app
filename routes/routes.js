const { Router } = require('express');
const controller = require('../controllers/controller');
const file = require('../controllers/fileStorage');
const multer = require('multer');

router = Router();
router.get('/signup', controller.signup_get);
router.post('/signup', controller.signup_post);
router.post('/login', controller.login_post);
router.get('/logout', controller.logout_get);
router.get('/mainpage', controller.main);
router.post('/sendMail' , multer(file).single('fileSend'), controller.send_mail);

module.exports = router;
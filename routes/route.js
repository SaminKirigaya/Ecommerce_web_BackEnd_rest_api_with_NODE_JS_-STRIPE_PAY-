require('dotenv').config();
const express = require('express');
const router = express.Router();
const upload = require('../config/Multer');
const Authentication = require('../middleware/Authentication');


const loginEmp = require('../RoutFunction/loginEmp');
const AmILogged = require('../RoutFunction/AmILogged');
const RegUser = require('../RoutFunction/RegUser');
const VerifyUser = require('../RoutFunction/VerifyUser');
const RegSeller = require('../RoutFunction/RegSeller');
const LoginUser = require('../RoutFunction/LoginUser');
const NavProfileData = require('../RoutFunction/NavProfileData')

//Employee login
router.post('/loginEmp',
loginEmp
)

//amI logged checking
router.get('/amilogged/:token',
AmILogged
)

//user registration when they send data to verify database 
router.post('/regUser',
upload.single('image'),
RegUser
)

//verify users
router.post('/verifyUser',
VerifyUser
)

//reg for employee verification of seller first step
router.post('/regSeller',
upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'nidImage', maxCount: 1 }
  ]),
RegSeller
)

//Login User 
router.post('/loginUser',
LoginUser
)

//navbar profile image and login data 
router.get('/navprofile/:token',
NavProfileData
)



module.exports = router;

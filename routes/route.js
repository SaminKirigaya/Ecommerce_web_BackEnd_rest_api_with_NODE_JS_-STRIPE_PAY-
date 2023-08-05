require('dotenv').config();
const express = require('express');
const router = express.Router();
const upload = require('../config/Multer');
const Authentication = require('../middleware/Authentication');
const AuthenEmp = require('../middleware/AuthenEmp');
const AuthenSeller = require('../middleware/AuthenSeller');


const loginEmp = require('../RoutFunction/loginEmp');
const AmILogged = require('../RoutFunction/AmILogged');
const RegUser = require('../RoutFunction/RegUser');
const VerifyUser = require('../RoutFunction/VerifyUser');
const RegSeller = require('../RoutFunction/RegSeller');
const LoginUser = require('../RoutFunction/LoginUser');
const NavProfileData = require('../RoutFunction/NavProfileData');
const GenPass = require('../RoutFunction/GenPass');
const AddEmp = require('../RoutFunction/AddEmp');
const EmpData = require('../RoutFunction/EmpData');
const DelEmp = require('../RoutFunction/DelEmp');
const GetEmpSpec = require('../RoutFunction/GetEmpSpec');
const EditEmpData = require('../RoutFunction/EditEmpData');
const AddProduct = require('../RoutFunction/AddProduct');
const SeeProdType = require ('../RoutFunction/SeeProdType');
const DelProdType = require('../RoutFunction/DelProdType');
const AddBrand = require('../RoutFunction/AddBrand');
const SeeProdBrand = require('../RoutFunction/SeeProdBrand');
const DelProdBrand = require('../RoutFunction/DelProdBrand');
const VerfSellerData = require('../RoutFunction/VerfSellerData');
const GetSpecificSeller = require('../RoutFunction/GetSpecificSeller');
const VerifyThisOne = require('../RoutFunction/VerifyThisOne');
const RejSeller = require('../RoutFunction/RejSeller');

const LoginSeller = require('../RoutFunction/LoginSeller');






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

//Gen random pass
router.get('/genPass',
GenPass
)

//Add Employee
router.post('/regEmployee/:usersl',
AuthenEmp,
upload.single('image'),
AddEmp
)

//get employee data to edit or delete
router.get('/empData/:usersl',
AuthenEmp,
EmpData
)

//Del Employee
router.get('/delEmp/:usersl/:empSl',
AuthenEmp,
DelEmp
)

// get editing employee specific data
router.get('/parseEmp/:usersl/:empSl',
AuthenEmp,
GetEmpSpec
)

// Edit employee data
router.post('/editEmployee/:usersl/:empSl',
 AuthenEmp,
  EditEmpData)

// product type add
router.post('/appProductType/:usersl', 
AuthenEmp,
AddProduct 
)

//See product types in deleting them page 
router.get('/seeProductTypes/:usersl',
AuthenEmp,
SeeProdType 
)

//Del Product Type
router.get('/delProdType/:usersl/:Prdsln',
AuthenEmp,
DelProdType
)


// product brand add
router.post('/appProductBrand/:usersl', 
AuthenEmp,
AddBrand 
)


//See product types in deleting them page 
router.get('/seeProductBrands/:usersl',
AuthenEmp,
SeeProdBrand 
)

//Del Product Type
router.get('/delProdBrand/:usersl/:Prdsln',
AuthenEmp,
DelProdBrand
)

//seller need verf data
router.get('/verfSellerData/:usersl',
AuthenEmp,
VerfSellerData
)

// data for speecific seller verifying
router.get('/verfSpecificSeller/:usersl/:sellerSln',
AuthenEmp,
GetSpecificSeller
)

//verify this seller 
router.get('/verfThisSeller/:usersl/:sellerSln', 
AuthenEmp, 
VerifyThisOne
)

//Reject seller 
router.get('/rejThisSeller/:usersl/:sellerSln',
AuthenEmp,
RejSeller 
)


//Login Seller
router.post('/loginSeller',
LoginSeller 
)

module.exports = router;

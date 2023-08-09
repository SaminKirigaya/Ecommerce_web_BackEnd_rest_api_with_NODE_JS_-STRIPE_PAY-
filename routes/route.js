require('dotenv').config();
const express = require('express');
const router = express.Router();
const upload = require('../config/Multer');
const Authentication = require('../middleware/Authentication');
const AuthenEmp = require('../middleware/AuthenEmp');
const AuthenSeller = require('../middleware/AuthenSeller');
const AuthenUser = require('../middleware/AuthenUser');


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
const AddEvent = require('../RoutFunction/AddEvent');
const AllEvents = require('../RoutFunction/AllEvents');
const DelEvent = require('../RoutFunction/DelEvent');

const LoginSeller = require('../RoutFunction/LoginSeller');
const PrdType = require('../RoutFunction/PrdType');
const PrdBrand = require('../RoutFunction/PrdBrand')
const AddProductSeller = require('../RoutFunction/AddProductSeller');
const AddEventProductSeller = require ('../RoutFunction/AddEventProductSeller');
const GetMyProducts = require('../RoutFunction/GetMyProducts');
const GetMyEventProducts  = require('../RoutFunction/GetMyEventProducts');
const DelThisProduct = require('../RoutFunction/DelThisProduct');
const EditableProd  = require('../RoutFunction/EditableProd');
const EditMyProduct = require('../RoutFunction/EditMyProduct');
const EditMyEventProduct = require('../RoutFunction/EditMyEventProduct');
const EditableEventProduct = require('../RoutFunction/EditableEventProduct');
const GetMySellingData = require('../RoutFunction/GetMySellingData');


const LogOut = require('../RoutFunction/LogOut');
const EditSeller = require('../RoutFunction/EditSeller');
const getallDataMine = require('../RoutFunction/getallDataMine');
const EditMe = require('../RoutFunction/EditMe');


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
upload.single('image'),
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
upload.single('image'),
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

// Reg a event
router.post('/regEvent/:usersl', 
AuthenEmp, 
upload.single('image'), 
AddEvent
)

// See all event 
router.get('/eventData/:usersl', 
AllEvents ) 

// Del specific Events
router.get('/delEvent/:usersl/:prodSl', 
AuthenEmp, 
DelEvent)

//Login Seller
router.post('/loginSeller',
LoginSeller 
)

//get Prd type
router.get('/getPrdTyp', 
PrdType 
)

//get prd brand 
router.get('/getPrdBrnd',
PrdBrand 
)


//Add Products
router.post('/addProduct/:usersl',
AuthenSeller,
upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 }
  ]),
AddProductSeller
)

// AddEventProductSeller
router.post('/addEventProduct/:usersl',
AuthenSeller,
upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 }
  ]),
AddEventProductSeller
)

// See Seller personal products (grabbing data)
router.get('/productsData/:usersl', 
AuthenSeller, 
GetMyProducts )



// See seller Event products Data
router.get('/eventProductsData/:usersl', 
AuthenSeller, 
GetMyEventProducts 
)

// delete specific product
router.get('/delProduct/:usersl/:prodSl', 
AuthenSeller, 
DelThisProduct)

// data of specific product to change
router.get('/getMyOwnProduct/:usersl/:productSln',
AuthenSeller, 
EditableProd 
)

//edit this one 
router.post('/editMyProduct/:usersl/:productSln', 
AuthenSeller, 
EditMyProduct
)

//editable specific post data for my event product
router.get('/getMyOwnEventProduct/:usersl/:productSln', 
AuthenSeller, 
EditableEventProduct 
)


// sdit specific event product
router.post('/editMyEventProduct/:usersl/:productSln', 
AuthenSeller, 
EditMyEventProduct
)

// logme out
router.get('/logmeout', 
LogOut
)

// get data for specific seller who wanna change data 
router.get('/needsellerData/:usersl', 
AuthenSeller,
GetMySellingData
)

// confirm edit seller 
router.post('/editSeller/:usersl',
AuthenSeller,
EditSeller
)

// get specific user data who want to change it
router.get('/getmyalldata/:usersl',
AuthenUser,
getallDataMine
)

// edit specific user provided dataa to database
router.post('/EditUser/:usersl', 
AuthenUser, 
EditMe
)











module.exports = router;

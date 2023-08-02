require('dotenv').config();
const express = require('express');
const router = express.Router();


const loginEmp = require('../RoutFunction/loginEmp');
const AmILogged = require('../RoutFunction/AmILogged');

//Employee login
router.post('/loginEmp',
loginEmp
)

//amI logged checking
router.get('/amilogged/:token',
AmILogged
)




module.exports = router;

require('dotenv').config();
const express = require('express');
const router = express.Router();


const loginEmp = require('../RoutFunction/loginEmp');


router.post('/loginEmp',
loginEmp
)




module.exports = router;

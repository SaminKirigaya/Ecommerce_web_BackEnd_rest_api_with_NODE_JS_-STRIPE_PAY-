const dotenv = require('dotenv');

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const uuid = uuidv4();
const Joi = require('joi');
const dbConnection = require('../config/Db')

dotenv.config();

const schema = Joi.object({
    
    email: Joi.string().email().required(),
    password: Joi.required(),
  });
  

async function loginEmp(req, res){
    const { error, value } = schema.validate(req.body);
    if (error) {
        // If there are validation errors, send a response with the error details
        return res.status(400).json({ error: error.details[0].message });
      }
  
    const mail = req.body.email;
    const pass = req.body.password;

    const saltRounds = 10;
    const pass2 = await bcrypt.hash(pass, saltRounds);

    return res.status(200).json({
        pass : pass2
    })

}


module.exports = loginEmp;
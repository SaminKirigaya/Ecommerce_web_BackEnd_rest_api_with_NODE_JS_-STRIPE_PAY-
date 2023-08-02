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

    try{
      const [tokenz] = await dbConnection.query('SELECT * FROM tokendb WHERE email = ?', [mail]);
      if (tokenz && tokenz.length > 0) {
        await dbConnection.query('DELETE FROM tokendb WHERE email = ?', [mail]);
      }

      const [mail_exist] = await dbConnection.query('SELECT * FROM employee WHERE email = ?', [mail]);
      if (mail_exist.length > 0) {
      
      const [Db_pass] = await dbConnection.query('SELECT pass FROM employee WHERE email = ?', [mail]);

      const dbMatch = await bcrypt.compare(pass, Db_pass[0].pass);
      

      if (dbMatch) {
        const token = uuidv4();
        await dbConnection.query('INSERT INTO tokendb (email, token, user_type) VALUES (?, ?, ?)', [mail, token, 'Employee']);
        const [userdet] = await dbConnection.query('SELECT * FROM employee WHERE email = ?', [mail]);
        const emp = userdet.length >0 ? userdet[0] : null;

        

        return res.status(200).json({
          message: 'Login Successful',
          usersl: emp.slno,
          token: token,
          image: emp.image,
          role : 'Employee'
        });
      } else {

        return res.status(200).json({
          message: 'Sorry Password Does Not Match ... Make Sure To Insert Valid Password',
        });
      }
    } else {
      

      return res.status(200).json({
        message: 'Sorry Email Does Not Exist ... Make Sure To Insert Valid User Email.',
      });
    }
    }catch(error){
      return res.status(500).json({
        message : error
      })
    }

}


module.exports = loginEmp;
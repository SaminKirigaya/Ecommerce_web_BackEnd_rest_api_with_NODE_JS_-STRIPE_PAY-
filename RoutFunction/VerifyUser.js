require('dotenv').config();
const dbConnection = require('../config/Db');
const Joi = require('joi');

const registrationSchema = Joi.object({
    email: Joi.string().email().required(),
    code : Joi.string().required() 

});

async function VerifyUser(req, res){
    const {error} = registrationSchema.validate(req.body);
    if(error){
        const errorMessages = error.details.map((err) => err.message);
        return res.status(200).json({ message : errorMessages});
      }


    try{
        const mail = req.body.email;
        const code = req.body.code;
        const [emailExistCode] = await dbConnection.query('SELECT * FROM user_verify_code WHERE email = ?',[mail]);
        const [emailExist] = await dbConnection.query('SELECT * FROM user_verify WHERE email = ?',[mail]);

        if(emailExist.length>0 && emailExistCode.length>0){
            if(emailExistCode[0].otp == code){
                const name = emailExist[0].name;
                const email = emailExist[0].email;
                const date_of_birth = emailExist[0].date_of_birth;
                const country = emailExist[0].country;
                const gender = emailExist[0].gender;
                const mobile = emailExist[0].mobile;
                const image = emailExist[0].image;
                const address = emailExist[0].address;
                const delivery_address = emailExist[0].delivery_address;
                const pass = emailExist[0].pass;
                const age = emailExist[0].age;


                const [success] = await dbConnection.query('INSERT INTO user (name, email, date_of_birth, country, gender, mobile, image, address, delivery_address, pass, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[name, email, date_of_birth, country, gender, mobile, image, address, delivery_address, pass, age]);
                const [setOtp] = await dbConnection.query('INSERT INTO forgot_pass (email, otp) VALUES (?, ?)',[email, pass])
                
                if(success && setOtp){
                    await dbConnection.query('DELETE FROM user_verify WHERE email = ?',[mail]);
                    await dbConnection.query('DELETE FROM user_verify_code WHERE email = ?',[mail]);

                    return res.status(200).json({
                        message : 'Successfully Verified...Now You Can Do Log In Login Page.'
                    })
                }else{
                    return res.status(200).json({
                        message : 'Verification Unsuccessful...'
                    })
                }
            
            }
        }

    }catch(error){
        return res.status(200).json({
            message : "Some Error Occured."
        })
    }
}

module.exports = VerifyUser;
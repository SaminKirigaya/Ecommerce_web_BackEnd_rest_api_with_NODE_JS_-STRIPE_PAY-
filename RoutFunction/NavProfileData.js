require('dotenv').config();
const dbConnection = require('../config/Db');

async function NavProfileData(req, res,next){
    const {token} = req.params;
    const [tokenExist] = await dbConnection.query('SELECT * FROM tokendb WHERE token = ?',[token]);
    if(tokenExist.length > 0){
        if(tokenExist[0].user_type == 'Employee'){
            try{
                const [userData] = await dbConnection.query('SELECT * FROM employee WHERE email = ?',[tokenExist[0].email]);
                return res.status(200).json({
                    message : 'Logged In.',
                    email : userData[0].email,
                    image : userData[0].image,
                    role : 'Employee'
                })
            }catch(error){
                next(error);
            }
            

        }else if (tokenExist[0].user_type == 'User'){
            try{
                const [userData] = await dbConnection.query('SELECT * FROM user WHERE email = ?',[tokenExist[0].email]);
                return res.status(200).json({
                    message : 'Logged In.',
                    email : userData[0].email,
                    image : userData[0].image,
                    role : 'User'
                })
            }catch(error){
                next(error)
            }
            

        }else if (tokenExist[0].user_type == 'Seller'){
            try{
                const [userData] = await dbConnection.query('SELECT * FROM seller WHERE email = ?',[tokenExist[0].email]);
                return res.status(200).json({
                    message : 'Logged In.',
                    email : userData[0].email,
                    image : userData[0].image,
                    role : 'Seller'
                })
            }catch(error){
                next(error)
            }
            
        }
        
    }else{
        return res.status(200).json({
            message : 'Not Logged In.'
        })
    }
}

module.exports = NavProfileData;
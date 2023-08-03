require('dotenv').config();
const dbConnection = require('../config/Db');

async function NavProfileData(req, res){
    const {token} = req.params;
    const [tokenExist] = await dbConnection.query('SELECT * FROM tokendb WHERE token = ?',[token]);
    if(tokenExist.length > 0){
        if(tokenExist[0].user_type == 'Employee'){
            const [userData] = await dbConnection.query('SELECT * FROM employee WHERE email = ?',[tokenExist[0].email]);
            return res.status(200).json({
                message : 'Logged In.',
                email : userData[0].email,
                image : userData[0].image,
                role : 'Employee'
            })

        }else if (tokenExist[0].user_type == 'User'){
            const [userData] = await dbConnection.query('SELECT * FROM user WHERE email = ?',[tokenExist[0].email]);
            return res.status(200).json({
                message : 'Logged In.',
                email : userData[0].email,
                image : userData[0].image,
                role : 'User'
            })

        }else if (tokenExist[0].user_type == 'Seller'){
            const [userData] = await dbConnection.query('SELECT * FROM seller WHERE email = ?',[tokenExist[0].email]);
            return res.status(200).json({
                message : 'Logged In.',
                email : userData[0].email,
                image : userData[0].image,
                role : 'Seller'
            })
        }
        
    }else{
        return res.status(200).json({
            message : 'Not Logged In.'
        })
    }
}

module.exports = NavProfileData;
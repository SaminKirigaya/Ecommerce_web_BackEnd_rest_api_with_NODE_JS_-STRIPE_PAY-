require('dotenv').config();
const dbConnection = require('../config/Db');

async function PrdType(req, res, next){
    try{
        const [allTypes] = await dbConnection.query('SELECT * FROM product_type');
        if(allTypes){
            return   res.status(200).json({
                message : 'Successful',
                allType : allTypes
            });
        }
    }catch(error){
        next(error)
    }
}

module.exports = PrdType;

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
        }else{
            return   res.status(200).json({
                message : 'Failed.'
                
            });
        }
    }catch(error){
        next(error)
    }
}

module.exports = PrdType;

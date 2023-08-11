require('dotenv').config();
const dbConnection = require('../config/Db');

async function PrdBrand(req, res, next){
    try{
        const [allBrands] = await dbConnection.query('SELECT * FROM brand_type');
        if(allBrands){
            return   res.status(200).json({
                message : 'Successful',
                allBrand : allBrands
            });
        }
    }catch(error){
        next(error)
    }
}

module.exports = PrdBrand;

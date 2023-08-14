const dbConnection = require('../config/Db')

async function VerfSellerData(req, res, next){
    try{

        const [sellerDataz] = await dbConnection.query('SELECT slno,image,email,gender,date_of_birth,address,country,mobile,name FROM seller_verify');
        if(sellerDataz){
            return res.status(200).json({
                message : 'Successful',
                verfSeller : sellerDataz
            });
        }else{
            return res.status(200).json({
                message : 'Failed.'
                
            });
        }
        

    }catch(error){
        next(error)
    }
    
}

module.exports = VerfSellerData;
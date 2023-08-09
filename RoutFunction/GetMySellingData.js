const dbConnection = require('../config/Db');

async function GetMySellingData(req, res, next) {
    const {usersl} = req.params;
    try{
        const [sellerData] = await dbConnection.query('SELECT name,country,age,gender,mobile,address,date_of_birth FROM seller WHERE slno = ?',[usersl]);
        if(sellerData.length>0){
            return  res.status(200).json({
                message : 'Success',
                sellerData : sellerData
            })
        }
    }catch(error){
        next(error);
    }

}

module.exports = GetMySellingData;
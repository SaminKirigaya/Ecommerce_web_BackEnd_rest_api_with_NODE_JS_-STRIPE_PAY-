const dbConnection = require('../config/Db');

async function AllPrdData(req, res, next){
    try{
        const {sln} = req.params;
        const [prdData] = await dbConnection.query('SELECT * FROM product WHERE slno = ?',[sln]);
        if(prdData.length>0){
        const [sellerName] = await dbConnection.query('SELECT name FROM seller WHERE slno = ?',[prdData[0].seller_slno]);
        prdData[0].sellerName = sellerName[0].name;

            return  res.status(200).json({
                message : 'Success',
                prdData : prdData
            })    
        }else{
            return  res.status(200).json({
                message : 'Failed'
                
            })    
        }
    }catch(err){
        next(err)
    }
    

}

module.exports = AllPrdData;
const dbConnection = require('../config/Db')

async function DelProdBrand(req, res, next){
    try{
        const {Prdsln} = req.params;
        const [prodTypExist] = await dbConnection.query('SELECT * FROM brand_type WHERE slno = ?',[Prdsln]);
        if(prodTypExist.length>0){
            const [delType] = await dbConnection.query('DELETE FROM brand_type WHERE slno = ?',[Prdsln]);
            if(delType){
                return res.status(200).json({
                    message : 'Success'
                })
            }else{
                return res.status(200).json({
                    message : 'Failed'
                })
            }
        }
    }catch(error){
        next(error)
    }
    

}

module.exports = DelProdBrand;
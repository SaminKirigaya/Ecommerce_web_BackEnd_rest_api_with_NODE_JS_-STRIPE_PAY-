const dbConnection = require('../config/Db')
const path = require('path');
const fs = require('fs');

async function DelProdBrand(req, res, next){
    try{
        const {Prdsln} = req.params;
        const [prodTypExist] = await dbConnection.query('SELECT * FROM brand_type WHERE slno = ?',[Prdsln]);
        if(prodTypExist.length>0){
            const [delType] = await dbConnection.query('DELETE FROM brand_type WHERE slno = ?',[Prdsln]);
            if(delType){

                const img = prodTypExist[0].image;
                const url1 = img;
                const parts1 = url1.split('/'); 
                const filename1 = parts1[parts1.length - 1];
                const imagePath1 = path.join('public/images', filename1);
                fs.unlinkSync(imagePath1);

                return res.status(200).json({
                    message : 'Success'
                })
            }else{
                return res.status(200).json({
                    message : 'Failed'
                })
            }
        }else{
            return res.status(200).json({
                message : 'Failed'
            })
        }
    }catch(error){
        next(error)
    }
    

}

module.exports = DelProdBrand;
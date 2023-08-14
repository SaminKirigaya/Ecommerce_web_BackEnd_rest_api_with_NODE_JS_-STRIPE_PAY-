const dbConnection = require('../config/Db')
const path = require('path');
const fs = require('fs');

async function DelThisProduct(req, res, next){
    const {usersl, prodSl} = req.params;

    try{
        const [selectProduct] = await dbConnection.query('SELECT * FROM product WHERE slno = ?',[prodSl]);
        if(selectProduct.length>0){
            if(selectProduct[0].seller_slno == usersl){
                const [isDeleted] = await dbConnection.query('DELETE FROM product WHERE slno = ?',[prodSl]);
                if(isDeleted){
                    const img1 = selectProduct[0].image1;
                    const img2 = selectProduct[0].image2;
                    const img3 = selectProduct[0].image3;

                    const url1 = img1;
                    const parts1 = url1.split('/'); 
                    const filename1 = parts1[parts1.length - 1];
                    const imagePath1 = path.join('public/images', filename1);
                    fs.unlinkSync(imagePath1);

                    const url2 = img2;
                    const parts2 = url2.split('/'); 
                    const filename2 = parts2[parts2.length - 1];
                    const imagePath2 = path.join('public/images', filename2);
                    fs.unlinkSync(imagePath2);

                    const url3 = img3;
                    const parts3 = url3.split('/'); 
                    const filename3 = parts3[parts3.length - 1];
                    const imagePath3 = path.join('public/images', filename3);
                    fs.unlinkSync(imagePath3);

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
        }else{
            return res.status(200).json({
                message : 'Failed'
            })
        }

    }catch(error){
        next(error)
    }
    
}

module.exports = DelThisProduct;
const dbConnection = require('../config/Db');

async function ShowBrandProd(req, res, next){

    const {sln} = req.params;
    try{
        const [evName] = await dbConnection.query('SELECT type FROM brand_type WHERE slno = ?',[sln]);
        const [allPrd] = await dbConnection.query('SELECT * FROM product WHERE brand = ? ORDER BY slno DESC',[evName[0].type]);
        if(allPrd.length>0){
            await Promise.all(
                allPrd.map(async (perpost) => {
                    var [author] = await dbConnection.query('SELECT name FROM seller WHERE slno = ?', [perpost.seller_slno]);
        
                    if (author && author.length > 0) {
                        perpost.seller = author[0].name;
                        
                    } else {
                        // Handle the case when author data is not found.
                        perpost.seller = 'Unknown or Banned !!!'; // Or set a default value.
                        
                    }
                })

            );

            return res.status(200).json({
                message : 'Success',
                allPrd : allPrd
            })
        }
    }catch(error){
        next(error)
    }

    
}

module.exports = ShowBrandProd;
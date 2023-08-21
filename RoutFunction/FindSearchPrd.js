const dbConnection = require('../config/Db');

async function FindSearchPrd(req, res, next){
    try{
        const   {sln} = req.params;
        const values = [`%${sln}%`, `%${sln}%`, `%${sln}%`, `%${sln}%`];
        
        const [prdData] = await dbConnection.query('SELECT * FROM product WHERE name LIKE ? OR type LIKE ? OR brand LIKE ? OR description LIKE ? ORDER BY slno DESC',values);
        if(prdData.length>0){
            await Promise.all(
                prdData.map(async (perpost) => {
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
                allPrd : prdData
            })



        }else{
            return  res.status(200).json({
                message : 'Failed.'
            })
        }

    }catch(err){
        next(err)
    }
}   

module.exports = FindSearchPrd;
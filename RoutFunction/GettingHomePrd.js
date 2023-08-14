const dbConnection = require('../config/Db');

async function GettingHomePrd(req, res, next){
    const [allPrd] = await dbConnection.query('SELECT * FROM product ORDER BY slno DESC');
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
            message : 'Successful',
            allPrd : allPrd
        })
    }else{
        return res.status(200).json({
            message : 'Failed',
            
        })
    }
}

module.exports = GettingHomePrd;
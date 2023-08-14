const dbConnection = require('../config/Db');

async function ShowEventProd(req, res, next){
    const {sln} = req.params;
    try{
        const [evName] = await dbConnection.query('SELECT event FROM events WHERE slno = ?',[sln]);
        const [allPrd] = await dbConnection.query('SELECT * FROM event_products WHERE event_name = ? ORDER BY slno DESC',[evName[0].event]);
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
        }else{
            return res.status(200).json({
                message : 'Failed',
                
            })
        }
    }catch(error){
        next(error)
    }

    
}

module.exports = ShowEventProd;
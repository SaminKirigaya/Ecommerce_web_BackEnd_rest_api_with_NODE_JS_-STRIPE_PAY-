const dbConnection = require('../config/Db');

async function userwhocommentedevent(req, res, next){
    try{
        const {sln} = req.params;
        const [prdComs] = await dbConnection.query('SELECT * FROM event_product_comment WHERE product_slno = ?',[sln]);
        if(prdComs.length>0){
            await Promise.all(
                prdComs.map(async(perComs)=>{
                    var [userimg] = await dbConnection.query('SELECT image,email FROM user WHERE slno = ?',[perComs.user_slno]);
                    if(userimg.length>0){
                        perComs.userimg = userimg[0].image;
                        perComs.email = userimg[0].email;
                    }else{
                        perComs.userimg = "Banned Or Deleted ...";
                        perComs.email = "Banned Or Deleted ...";
                    }
                    
                })
            )

            return  res.status(200).json({
                message : 'Success',
                usercom : prdComs
            })
        }else{
            return  res.status(200).json({
                message : 'Failed'
                
            })
        }
        
    }catch(err){
        next(err);
    }
}

module.exports = userwhocommentedevent;
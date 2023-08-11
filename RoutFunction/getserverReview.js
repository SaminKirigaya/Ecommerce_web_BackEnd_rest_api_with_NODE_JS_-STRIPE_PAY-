const dbConnection = require('../config/Db');

async function getserverReview(req, res, next){
    try{
        const [review] = await dbConnection.query('SELECT * FROM website_review ORDER BY slno DESC LIMIT 6');
        if(review.length>0){

            await Promise.all(
                review.map(async(perone)=>{
                    var [user] = await dbConnection.query('SELECT email,image FROM user WHERE slno = ?',[perone.user_slno]);
                    if (user && user.length > 0) {
                        perone.usermail = user[0].email;
                        perone.image = user[0].image;
                        
                    } else {
                        // Handle the case when author data is not found.
                        perone.usermail = 'Unknown or Banned !!!'; // Or set a default value.
                        perone.image = "...";
                    }
                })
            )
            return  res.status(200).json({
                message : 'Successful',
                allReview : review
            });
        }
    }catch(error){
        next(error);
    }
}

module.exports = getserverReview;
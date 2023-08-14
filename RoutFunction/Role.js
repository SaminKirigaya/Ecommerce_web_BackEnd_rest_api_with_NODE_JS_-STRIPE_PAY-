const dbConnection = require('../config/Db')

async function Role(req, res, next){

    try{

        const {usersl} = req.params;
        const [tokenData] = await dbConnection.query('SELECT * FROM tokendb WHERE token = ?',[usersl]);
        if(tokenData.length>0){
            return res.status(200).json({
                message : 'Success',
                role : tokenData[0].user_type
            });
        }else{
            return res.status(200).json({
                message : 'Failed'
                
            });
        }

    }catch(err){
        next(err)
    }
}

module.exports = Role;
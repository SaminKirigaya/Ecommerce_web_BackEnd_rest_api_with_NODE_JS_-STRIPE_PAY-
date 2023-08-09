const dbConnection = require('../config/Db');

async function LogOut(req, res, next){

    try{
        const authorizationHeader = req.headers['authorization'];
        const token = authorizationHeader.split(' ')[1];
        const [tokenExist] = await dbConnection.query('SELECT * FROM tokendb WHERE token = ?',[token]);
        if(tokenExist.length>0){
            const [deleted] = await dbConnection.query('DELETE FROM tokendb WHERE token = ?',[token]);
            if(deleted){
                return  res.status(200).json({
                    message : 'Successfully Logged Out ...'
                })
            }
        }

    }catch(error){
        next(error)
    }
    
}   

module.exports = LogOut;
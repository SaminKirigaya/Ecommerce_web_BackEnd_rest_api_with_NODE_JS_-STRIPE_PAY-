const dbConnection = require('../config/Db')

async function getallDataMine(req, res, next){
    try{
        const {usersl} = req.params;
        const [userData] = await dbConnection.query('SELECT name,date_of_birth,country,gender,age,mobile,address,delivery_address FROM user WHERE slno = ?',[usersl]);
        if(userData.length>0){
            return  res.status(200).json({
                message : 'Success',
                userData : userData
            })
        }
    }catch(error){
        next(error)
    }
    
}

module.exports = getallDataMine;
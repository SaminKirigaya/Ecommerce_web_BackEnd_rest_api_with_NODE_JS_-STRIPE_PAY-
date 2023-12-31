const dbConnection = require('../config/Db')

async function EmpData(req, res, next){
    try{
        const [empDataz] = await dbConnection.query('SELECT slno,image,email,gender,joined,designation,sallery,address,mobile,name FROM employee');
        return res.status(200).json({
            message : 'Successful',
            empData : empDataz
        });
        
    }catch(error){
        next(error);
    }
    
}

module.exports = EmpData;
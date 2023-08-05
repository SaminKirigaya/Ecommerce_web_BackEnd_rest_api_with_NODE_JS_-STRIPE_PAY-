const dbConnection = require('../config/Db')

async function GetEmpSpec (req, res){
    const {usersl, empSl} = req.params;
    const [empExist] = await dbConnection.query('SELECT * FROM employee WHERE slno = ?',[empSl]);
    if(empExist.length > 0){
        return  res.status(200).json({
            message : 'Successful',
            name : empExist[0].name,
            email : empExist[0].email,
            gender : empExist[0].gender,
            country : empExist[0].country,
            sallery : empExist[0].sallery,
            designation : empExist[0].designation,
            nid : empExist[0].nid,
            dateofBirth : empExist[0].date_of_birth,
            mobile : empExist[0].mobile,
            address : empExist[0].address
        })
    }
}

module.exports = GetEmpSpec;
const dbConnection = require('../config/Db')

async   function    DelReport(req, res, next){
    try{
        const   {usersl, serial} = req.params;
        const [del] = await dbConnection.query('DELETE FROM report WHERE slno = ?',[serial]);
        if(del){
            return  res.status(200).json({
                message : 'Success'
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

module.exports= DelReport; 
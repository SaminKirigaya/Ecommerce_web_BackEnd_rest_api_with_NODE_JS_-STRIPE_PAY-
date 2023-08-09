const dbConnection = require('../config/Db')
const path = require('path');
const fs = require('fs');

async function DelEmp(req, res){
    const {usersl, empSl} = req.params;
    const [empExist] = await dbConnection.query('SELECT * FROM employee WHERE slno = ?',[empSl]);
    if(empExist.length>0){
        const [success] = await dbConnection.query('DELETE FROM employee WHERE slno = ?',[empSl]);
        if(success){
            const img = empExist[0].image;
            const url = img;
            const parts = url.split('/'); 
            const filename = parts[parts.length - 1];
            const imagePath = path.join('public/images', filename);
            fs.unlinkSync(imagePath);

            const [isLogged] = await dbConnection.query('SELECT * FROM tokendb WHERE email = ?',[empExist[0].email]);
            
            if(isLogged.length>0){
                await dbConnection.query('DELETE FROM tokendb WHERE email = ?',[empExist[0].email]);
            }

            return res.status(200).json({
                message : 'Success'

            })
        }else{
            return res.status(200).json({
                message : 'Failed'

            })
        }
    }else{
        return res.status(200).json({
            message : 'No Such Employee...'

        })
    }
}

module.exports = DelEmp;
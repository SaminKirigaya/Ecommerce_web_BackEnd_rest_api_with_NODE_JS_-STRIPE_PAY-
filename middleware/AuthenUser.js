
const dbConnection = require('../config/Db')

async function AuthenUser(req, res, next){
    const authorizationHeader = req.headers['authorization'];
    const {usersl} = req.params;
    const token = authorizationHeader.split(' ')[1];
    const [user] = await dbConnection.query('SELECT * FROM user WHERE slno = ?',[usersl]);
    if(user.length > 0){
        const [tokenz] = await dbConnection.query('SELECT * FROM tokendb WHERE token = ?',[token]);
        if(tokenz.length>0){

            const [user_role] = await dbConnection.query('SELECT user_type FROM tokendb WHERE token = ?',[token]);
            if(user_role[0].user_type == 'User'){

                const [user_mail] = await dbConnection.query('SELECT email FROM user WHERE slno = ?',[usersl]);
                const [token_mail] = await dbConnection.query('SELECT email FROM tokendb WHERE token = ?',[token]);

                if(user_mail[0].email == token_mail[0].email){
                    next();
                }

            }else{
                return res.status(401).json({ error: 'Unauthorized' });
            }
            

        }
    }else {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = AuthenUser;
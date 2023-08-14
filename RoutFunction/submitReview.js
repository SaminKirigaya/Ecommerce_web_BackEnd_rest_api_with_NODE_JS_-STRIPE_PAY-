const dbConnection = require('../config/Db');
const Joi = require('joi');

const registrationSchema = Joi.object({
    review: Joi.string().pattern(/^([a-zA-Z,%$'"\-_:;!?. ]+)$/).required(),
    rating: Joi.number().integer().required()

  });

async function submitReview(req, res, next){
    const {error} = registrationSchema.validate(req.body);
    if(error){
        return  res.status(200).json({
            message : error.details[0].message
        })
    }
    try{
        const authorizationHeader = req.headers['authorization'];
        const token = authorizationHeader.split(' ')[1];

        const [mail] = await dbConnection.query('SELECT email From tokendb WHERE token = ?',[token]);
        if(mail.length>0){
            const [usersl] = await dbConnection.query('SELECT slno FROM user WHERE email = ?',[mail[0].email]);
            const [inReview] = await dbConnection.query('SELECT * FROM website_review WHERE user_slno = ?',[usersl[0].slno]);
            if(inReview.length>0){
                await dbConnection.query('DELETE FROM website_review WHERE user_slno = ?',[usersl[0].slno]);
            }
            const desc = req.body.review;
            const rating = req.body.rating;

            const [insertDats] = await dbConnection.query('INSERT INTO website_review (user_slno, comment, rating) VALUES (?,?,?)',[usersl[0].slno, desc, rating]);
            if(insertDats){
                return  res.status(200).json({
                    message : 'Successfully Review Added ...'
        
                })
            }
        }else{
            return  res.status(200).json({
                message : 'Failed.'
    
            })
        }
    }catch(error){
        next(error)
    }
}

module.exports = submitReview;
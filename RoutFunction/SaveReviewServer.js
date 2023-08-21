const dbConnection = require('../config/Db')


const Joi = require('joi');


async function SaveReviewServer(req, res, next){
    try{
        

        const   {usersl} = req.params;
        const {review, like, dislike, rating, delivNo} = req.body;


        var coms = review;
        const charactersToReplace = ['<', '>', '/', ';'];
        const replacementCharacters = ['&lt;', '&gt;', '&#47;', '&#59;'];
      
        for (let i = 0; i < charactersToReplace.length; i++) {
            const regex = new RegExp(charactersToReplace[i], 'g');
            review = coms.replace(regex, replacementCharacters[i]);
            
        }

        const [order] = await   dbConnection.query('SELECT * FROM delivery_order WHERE slno = ? AND user_slno = ?',[delivNo, usersl]);
        if(order.length>0){
            if(order[0].event_or_not == 'not event'){
                if(like == true){
                    const   [likeamnt] = await dbConnection.query('SELECT like_amount FROM product WHERE slno = ?',[order[0].product_slno]);
                    var likes = likeamnt[0].like_amount;
                    likes = likes+1;
                    await dbConnection.query('UPDATE product SET like_amount = ? WHERE slno = ?',[likes, order[0].product_slno]);

                }else if(dislike == true){
                    const   [likeamnt] = await dbConnection.query('SELECT dislike_amount FROM product WHERE slno = ?',[order[0].product_slno]);
                    var dislikes = likeamnt[0].dislike_amount;
                    dislikes = dislikes+1;
                    await dbConnection.query('UPDATE product SET dislike_amount = ? WHERE slno = ?',[dislikes, order[0].product_slno]);
                
                }

                await dbConnection.query('INSERT INTO product_comment (product_slno, seller_slno, user_slno, comment) VALUES (?,?,?,?)',[order[0].product_slno, order[0].seller_slno, usersl, review])
                await dbConnection.query('INSERT INTO product_rating (user_slno, product_slno, rating) VALUES (?,?,?)',[usersl, order[0].product_slno, rating]);
                const [allrating] = await dbConnection.query('SELECT rating FROM product_rating WHERE product_slno = ?',[order[0].product_slno]);
                if(allrating.length>0){
                    var totalrate = allrating.map((each)=>{
                        var totalr = 0;
                        totalr += each.rating;
                        return totalr;
                    });
                    
                    var valrate = totalrate/allrating.length;

                    await dbConnection.query('UPDATE product SET rating = ? WHERE slno = ?',[valrate, order[0].product_slno]);
                    
                }
            
                await dbConnection.query('UPDATE delivery_order SET reviewdone = ? WHERE slno = ?',['Done', delivNo]);
                return res.status(200).json({
                    message : 'Success'
                })
            
            }else{
                if(like == true){
                    const   [likeamnt] = await dbConnection.query('SELECT like_amount FROM event_products WHERE slno = ?',[order[0].product_slno]);
                    var likes = likeamnt[0].like_amount;
                    likes = likes+1;
                    await dbConnection.query('UPDATE event_products SET like_amount = ? WHERE slno = ?',[likes, order[0].product_slno]);

                }else if(dislike == true){
                    const   [likeamnt] = await dbConnection.query('SELECT dislike_amount FROM event_products WHERE slno = ?',[order[0].product_slno]);
                    var dislikes = likeamnt[0].dislike_amount;
                    dislikes = dislikes+1;
                    await dbConnection.query('UPDATE event_products SET dislike_amount = ? WHERE slno = ?',[dislikes, order[0].product_slno]);
                
                }

                await dbConnection.query('INSERT INTO event_product_comment (product_slno, seller_slno, user_slno, comment) VALUES (?,?,?,?)',[order[0].product_slno, order[0].seller_slno, usersl, review])
                await dbConnection.query('INSERT INTO event_product_rating (user_slno, product_slno, rating) VALUES (?,?,?)',[usersl, order[0].product_slno, rating]);
                    
                const [allrating] = await dbConnection.query('SELECT rating FROM event_product_rating WHERE product_slno = ?',[order[0].product_slno]);
                if(allrating.length>0){
                    var totalrate = allrating.map((each)=>{
                        var totalr = 0;
                        totalr += each.rating;
                        return totalr;
                    });
                    
                    var valrate = totalrate/allrating.length;

                    await dbConnection.query('UPDATE event_products SET rating = ? WHERE slno = ?',[valrate, order[0].product_slno]);
                    
                }

                await dbConnection.query('UPDATE delivery_order SET reviewdone = ? WHERE slno = ?',['Done', delivNo]);
                return res.status(200).json({
                    message : 'Success'
                })
            
            }
        }else{
            return  res.status(200).json({
                message : Failed
            })
        }
    }catch(err){
        next(err)
    }
}

module.exports = SaveReviewServer;
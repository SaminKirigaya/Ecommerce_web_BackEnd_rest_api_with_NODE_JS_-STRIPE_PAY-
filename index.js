require('dotenv').config();
const cors = require('cors');

const express = require('express');
const app = express();
const errorMw = require('./middleware/error');
const morgan = require('morgan');

app.use(morgan('tiny'));
app.use(cors);

app.use('/public/images', express.static(__dirname + '/public/images'));


function routeHandle (req, res, next){
    try{
        let router = require('./routes/route');
        app.use(router);

        next();

    }catch(err){
        console.log(err);
        next(err);
    }
}

app.use(routeHandle);



app.use(errorMw)

app.listen(process.env.PORT, ()=>{
    console.log("server running...");
})
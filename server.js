const {createServer } = require('http')
const next = require('next')
require('dotenv').config();
const app = next({
    dev: process.env.NODE_ENV !== 'production'
});

const routes = require('./routes');

const handler = routes.getRequestHandler(app);

app.prepare().then(()=>{
    createServer(handler).listen(process.env.PORT,(err) =>{
        if(err) throw err;
        console.log(`Ready on localhost:${process.env.PORT}`);
        
    });
});
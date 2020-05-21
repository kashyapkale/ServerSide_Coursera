const express = require('express');
const http = require('http');

const hostname = 'localhost';
const port = 3000;

const morgan = require('morgan');
const app = express();

const bodyParser = require('body-parser');

app.use(morgan('dev'));

//app.use(express.static(__dirname + '/public'));

const dishRouter = require('./routes/dishRouter');
const promotionRouter = require('./routes/promotionRouter');
const leaderRouter = require('./routes/leaderRouter');

app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);

app.use(bodyParser.json());

app.use((req,res,next)=>{
    console.log(req.headers);
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>Server is Running</h1></body></html>');
});


const server  = http.createServer(app);

server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}`);
});
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');


// I don't think I'm going to need a database for my personal site
//const connection = require('../Database/mongodb/index');

// I also don't know if I'm going to need a router yet
const router = require('./router');

const server = express();
const port = process.env.PORT || 3000;

server.use(bodyparser.json());
server.use(bodyparser.urlencoded({ extended: true}));
server.use(express.static(path.join(__dirname, '../Client/dist')));

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "chrome-extension://jnnkcfjlinnlfomiabjpemlohdndoojo");
    res.header("Access-Control-Allow-Origin", "chrome-extension://pcgamnalhckalpdpahgnheafnifcjnpf");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

server.use('/api', router);

server.listen(port, () => console.log('server is connected'));
const express = require('express');
const helmet = require('helmet');

const router = require('./zoos/router');

const server = express();

server.use(express.json());
server.use(helmet());
server.use('/api/zoos', router);


server.get('/', (req, res) => {
    res.send('<h2>Root reached</h2>')
})

module.exports = server;
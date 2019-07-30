const url = require('url');
const path = require('path');
const stringify = require('json-stringify');
const serveStatic = require('serve-static');
const express = require('express');
const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const logicprincipalbussines = require('./backend/LogicPrincipalTables');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var scData = null;

app.use(express.static('client'));

server.listen(4567, function () {
    console.log('Servidor Node corriendo en el Puerto: 4567 \n');
});

io.on('connection', (socket) => {
    console.log('***************Nuevo Cliente Conectado***********************');
    console.log('IP: ' + socket.handshake.address);
    console.log('FECHA: ' + socket.handshake.time + '\n\n');

    logicprincipalbussines.ProcesosGenerales(socket);

});
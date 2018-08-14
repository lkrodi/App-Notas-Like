const url = require('url');
const path = require('path');
const stringify = require('json-stringify');
const serveStatic = require('serve-static');
const express = require('express');
const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const configMongo = require('../backend/configDB');

var db = {};
var collection = {};

const errores = {
	AggregateDocuments: 'Error al ejecutar el aggregate pipeline',
	FindDocuments: 'Error al traer datos',
	InsertDocuments: 'Error al insertar datos',
	UpdateDocuments: 'Error al actualizar los datos',
	RemoveDocuments: 'Error al remover los datos',

	UpdateMasiveDocuments: 'Error al actualizar los datos multiples',
	InsertMasivedocuments: 'Error al insertar los datos multiples',
	RemoveMasiveDocuments: 'Error al remover los datos multiples',

	MongoError: "Algo salio mal, error"
};

const operacionesmongodb = {
	
	aggregateDocuments: (pipeline, callback) => {
		collection.aggregate(pipeline).toArray((err, result) => {
			if (err) {
				console.log(err);
				callback(stringify({Error: errores.AggregateDocuments}));
				return;
			}
			else {
				callback(stringify({data: result}));
			}
		});
	},

	
	findDocuments: (filtros, callback) => {
		collection.find(filtros).toArray((err, docs) => {
			if (err) {
				console.log(err);
				callback(stringify({Error: errores.FindDocuments}));
				return;
			}
			else {
				callback(stringify({data: docs}));
			}
		});
	},


	insertDocument: (data, callback) => {
		collection.insertOne(data, (err, result) => {
			if (err) {
				console.log(err);
				callback(stringify({Error: errores.InsertDocuments}));
				return;
			}
			else {
				callback(stringify({data: {}}));
			}
		});
	},


	insertMasiveDocuments: (data, callback) => {
		collection.insertMany(data, (err, result) => {
			if (err) {
				console.log(err);
				callback(stringify({Error: errores.InsertMasivedocuments}));
				return;
			}
			else {
				collection.find({}).toArray((error, docs) => {
					if (error) {
						console.log(error);
						callback(stringify({Error: errores.FindDocuments}));
						return;
					}
					else {
						callback(stringify({data: docs}));
					}
				});
			}
		});
	},


	updateDocument: (data, callback) => {
		collection.updateOne(data.filters, { $set: data.setUpdate}, (err, result) => {
			if (err) {
				console.log(err);
				callback(stringify({Error: 'Error al actualizar los datos'}));
				return;
			}
			else {
				collection.find(data.filters).toArray((error, docs) => {
					if (error) {
						console.log(error);
						callback(stringify({Error: 'Error al traer datos'}));
						return;
					}
					else {
						callback(stringify({data: docs}));
					}
				});
			}
		});
	},


	updateMasiveDocuments: (data, callback) => {
		collection.updateMany(data.filters, {$set: data.setUpdate}, (err, result) => {
			if (err) {
				console.log(err);
				callback(stringify({Error: 'Error al actualizar los datos multiples'}));
				return;
			}
			else {
				collection.find({}).toArray((error, docs) => {
					if (error) {
						console.log(error);
						callback(stringify({Error: 'Error al traer datos'}));
						return;
					}
					else {
						callback(stringify({data: docs}));
					}
				});
			}
		});
	},


	removeDocument: (data, callback) => {
		collection.deleteOne(data.filters, (err, result) => {
			if (err) {
				console.log(err);
				callback(stringify({Error: 'Error al remover los datos'}));
				return;
			}
			callback(stringify({data:data.IdNota}));
		});
	},

	
	removeMasiveDocuments: (data, callback) => {
		collection.deleteMany(data.filters, (err, result) => {
			if (err) {
				console.log(err);
				callback(stringify({Error: 'Error al remover los datos'}));
				return;
			}
			collection.find({}).toArray((error, docs) => {
				if (error) {
					console.log(error);
					callback(stringify({Error: 'Error al traer datos'}));
					return;
				}
				else {
					callback(stringify({data: docs}));
				}
			});
		});
	}

};

function EjecutarProcesoMongoDB (proceso, nombreColeccion, datos, callbackFinnaly) {
	const urlMongo = configMongo.MongoLocalCasa.Server;
	const optionsMongo = {useNewUrlParser: true};

	mongo.connect(urlMongo, optionsMongo, (error, client) => {
		if (error) {
			console.log(errores.MongoError, error);
			callbackFinnaly(stringify({Error: error.message}));
			return;
		}

		db = client.db(configMongo.MongoLocalCasa.Database);
		collection = db.collection(nombreColeccion);

    if (proceso == 1)
      operacionesmongodb.insertDocument(datos, (respuesta) => {
        respuesta = JSON.parse(respuesta);
        if (respuesta.hasOwnProperty('Error')) {
          callbackFinnaly(stringify(respuesta.Error));
          client.close();
          return;
        }
        else {
          callbackFinnaly(stringify(respuesta));
          client.close();
        }
      });


    else if (proceso == 2)
      operacionesmongodb.updateDocument(datos, (respuesta) => {
        respuesta = JSON.parse(respuesta);
        if (respuesta.hasOwnProperty('Error')) {
          callbackFinnaly(stringify(respuesta.Error));
          client.close();
          return;
        }
        else {
          callbackFinnaly(stringify(respuesta));
          client.close();
        }
      });    


    else if (proceso == 3)
      operacionesmongodb.findDocuments(datos, (respuesta) => {
        respuesta = JSON.parse(respuesta);
        if (respuesta.hasOwnProperty('Error')) {
          callbackFinnaly(stringify(respuesta.Error));
          client.close();
          return;
        }
        else {
          callbackFinnaly(stringify(respuesta));
          client.close();
        }
      });


    else if (proceso == 4)
      operacionesmongodb.removeDocument(datos, (respuesta) => {
        respuesta = JSON.parse(respuesta);
        if (respuesta.hasOwnProperty('Error')) {
          callbackFinnaly(stringify(respuesta.Error));
          client.close();
          return;
        }
        else {
          callbackFinnaly(stringify(respuesta));
          client.close();
        }
      });


    else if (proceso == 5)
      operacionesmongodb.aggregateDocuments(datos, (respuesta) => {
        respuesta = JSON.parse(respuesta);
        if (respuesta.hasOwnProperty('Error')) {
          callbackFinnaly(stringify(respuesta.Error));
          client.close();
          return;
        }
        else {
          callbackFinnaly(stringify(respuesta));
          client.close();
        }
			});
			
		else if (proceso == 11)
			operacionesmongodb.insertMasiveDocuments(datos, (respuesta) => {
        respuesta = JSON.parse(respuesta);
        if (respuesta.hasOwnProperty('Error')) {
          callbackFinnaly(stringify(respuesta.Error));
          client.close();
          return;
        }
        else {
          callbackFinnaly(stringify(respuesta));
          client.close();
        }
			});

		else if (proceso == 22)
			operacionesmongodb.updateMasiveDocuments(datos, (respuesta) => {
        respuesta = JSON.parse(respuesta);
        if (respuesta.hasOwnProperty('Error')) {
          callbackFinnaly(stringify(respuesta.Error));
          client.close();
          return;
        }
        else {
          callbackFinnaly(stringify(respuesta));
          client.close();
        }
			});
		
		else if (proceso == 44)
			operacionesmongodb.removeMasiveDocuments(datos, (respuesta) => {
        respuesta = JSON.parse(respuesta);
        if (respuesta.hasOwnProperty('Error')) {
          callbackFinnaly(stringify(respuesta.Error));
          client.close();
          return;
        }
        else {
          callbackFinnaly(stringify(respuesta));
          client.close();
        }
			});

	});
}

module.exports = {
	EjecutarProcesoMongoDB
};

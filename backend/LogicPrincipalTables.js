//#region modulos npm y variables
const url = require('url');
const path = require('path');
const stringify = require('json-stringify');
const serveStatic = require('serve-static');
const express = require('express');
const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Capadatos = require('../backend/accesoData');
//#endregion modulos npm y variables


//#region Procesos Generales

function ProcesosGenerales(socket) {
    SeleccionarNotas(socket);
    InsertarNota(socket);
    EliminarNota(socket);
    
    SeleccionarCategorias(socket);
    InsertarCategoria(socket);
}

//#endregion Procesos Generales


//#region Operaciones Notas

function SeleccionarNotas(socket) {
    socket.on('selectNotas', (data, callback) => {
        Capadatos.EjecutarProcesoMongoDB(3, 'Notas', data, (resp) => {
            var respuesta = JSON.parse(resp);
            if (respuesta.hasOwnProperty('Error')) {
                callback(stringify({Error: respuesta.Error}));
                return;
            } else {
                callback(stringify(respuesta.data));
            }
        });
    });
}

function InsertarNota(socket) {
    socket.on('insertNota', (data, callback) => {
        var proceso = parseInt(data.Proceso);
        if (proceso == 0) { //insert
            var pipeline = [
                {
                    $sort: {
                        IdNota: -1
                    }
                },
                {
                    $limit: 1
                }
            ];

            Capadatos.EjecutarProcesoMongoDB(5, 'Notas', pipeline, (resp) => {
                var respuesta = JSON.parse(resp);
                if (respuesta.hasOwnProperty('Error')) {
                    callback(stringify({Error: respuesta.Error}));
                    return;
                } else {
                    var IdNotaNueva = 0;
                    var resptaFiltros = respuesta.data;
                    if (resptaFiltros.length > 0) {
                        IdNotaNueva = parseInt(resptaFiltros[0].IdNota + 1);
                        var nota = {
                            IdNota : IdNotaNueva,
                            Titulo : data.Titulo,
                            Descripcion : data.Descripcion,
                            Categoria : data.Categoria,
                            FechaRegistro : data.FechaRegistro,
                            Favorito : data.Favorito,
                            Estado : data.Estado
                        };
                        
                       Capadatos.EjecutarProcesoMongoDB(1, 'Notas', nota, (resp2) => {
                            var respuesta2 = JSON.parse(resp2);
                            if (respuesta2.hasOwnProperty('Error')) {
                                callback(stringify({Error: respuesta2.Error}));
                                return;
                            } else {

                                Capadatos.EjecutarProcesoMongoDB(3, 'Notas', {IdNota:nota.IdNota}, (resp3) => {
                                    var respuesta3 = JSON.parse(resp3);
                                    if (respuesta3.hasOwnProperty('Error')) {
                                        callback(stringify({Error: respuesta3.Error}));
                                        return;
                                    } else {
                                        var notaWatchEmit = {
                                            accion: '-Nota insertada Watch-',
                                            data: respuesta3.data[0]
                                        };
                                        socket.emit('notaInsertada', stringify(notaWatchEmit));
                                        socket.broadcast.emit('notaInsertada', stringify(notaWatchEmit));
                                        callback(stringify(respuesta3.data[0]));
                                    }
                                });
                            }
                        });
                    }
                }
            });

        }
        else if (proceso == 1) { //update
            var dataUpdate = {
                IdNota: parseInt(data.IdNota),
                filters: {
                    IdNota: parseInt(data.IdNota)
                },
                setUpdate: {
                    Titulo: data.Titulo,
                    Descripcion: data.Descripcion,
                    Categoria: data.Categoria,
                    Favorito: data.Favorito,
                }
            }

            Capadatos.EjecutarProcesoMongoDB(2, 'Notas', dataUpdate, (resp) => {
                var respuesta = JSON.parse(resp);
                if (respuesta.hasOwnProperty('Error')) {
                    callback(stringify({Error: respuesta.Error}))
                    return;
                } else {
                    var notaWatchEmit = {
                        accion: '-Nota actualizada Watch-',
                        data: respuesta.data[0]
                    };
                    socket.emit('notaActualizada', stringify(notaWatchEmit));
                    socket.broadcast.emit('notaActualizada', stringify(notaWatchEmit));
                    callback(stringify(respuesta.data[0]));
                }
            });
        }        
    });
}

function EliminarNota(socket) {
    socket.on('eliminarNota', (data, callback) => {
        var proceso = parseInt(data.Proceso);
        if (proceso == 4) {
            var dataDelete = {
                IdNota: data.IdNota,
                filters: {
                    IdNota: parseInt(data.IdNota)
                }
            }

            Capadatos.EjecutarProcesoMongoDB(4, 'Notas', dataDelete, (resp) => {
                var respuesta = JSON.parse(resp);
                if (respuesta.hasOwnProperty('Error')) {
                    callback(stringify({Error: respuesta.Error}));
                    return;
                } else {
                    var notaWatchEmit = {
                        accion: '-Nota eliminada Watch-',
                        data: {
                            IdNota: parseInt(respuesta.data)
                        }
                    };
                    socket.emit('notaEliminada', stringify(notaWatchEmit));
                    socket.broadcast.emit('notaEliminada', stringify(notaWatchEmit));
                    callback(stringify({IdNota: parseInt(respuesta.data)}))
                }
            });
        }
    });
}

//#endregion Operaciones Notas


//#region Operaciones Categorias

function SeleccionarCategorias(socket) {
    socket.on('selectCategorias', (data, callback) => {
        Capadatos.EjecutarProcesoMongoDB(3, 'Categorias', data, (resp) => {
            var respuesta = JSON.parse(resp);
            if (respuesta.hasOwnProperty('Error')) {
                callback(stringify({Error: respuesta.Error}));
                return;
            } else {
                callback(stringify(respuesta.data));
            }
        });
    });
}

function InsertarCategoria(socket) {
    socket.on('insertCategoria', (data, callback) => {
        var filtro = [{
            $sort: {
                'IdCategoria': -1
            },
            $limit: {
                'IdCategoria': 1
            }
        }];

        Capadatos.EjecutarProcesoMongoDB(5, 'Categoria', filtro, (resp) => {
            var respuesta = JSON.parse(resp);
            if (respuesta.hasOwnProperty('Error')) {
                callback(stringify({Error: respuesta.Error}));
                return;
            } else {
                var IdCategoriaNueva = 0;
                var resptaFiltros = respuesta.data;
                if (resptaFiltros.length > 0) {
                    IdCategoriaNueva = parseInt(resptaFiltros[0].IdCategoria + 1);
                    var categoria = {
                        IdCategoria : IdCategoriaNueva,
                        Categoria : data.Categoria,
                        FechaRegistro : data.FechaRegistro,
                        Estado : data.Estado
                    };
                    
                    Capadatos.EjecutarProcesoMongoDB(1, 'Categoria', categoria, (resp2) => {
                        var respuesta2 = JSON.parse(resp2);
                        if (respuesta2.hasOwnProperty('Error')) {
                            callback(stringify({Error: respuesta2.Error}));
                            return;
                        } else {
                            callback(stringify(respuesta2));
                        }
                    });
                }
            }
        });
    });
}

//#endregion Operaciones Categorias


//#region module exports
module.exports = {
    ProcesosGenerales
};
//#endregion module exports
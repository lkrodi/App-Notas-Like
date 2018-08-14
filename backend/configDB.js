var MongoLocalCasa = {
    Server: 'mongodb://localhost:27017',
    Database: 'dbnotas'
};

var MongoLocalTrabajo = {
    Server: 'mongodb://10.10.10.10:27017',
    Database: 'dbnotas'
};

var MongoServer = {
    Server: 'mongodb://...',
    Database: 'dbnotas'
};

var Colecciones = {
    Notas: 'Notas',
    Categorias: 'Categorias',
    Opciones: 'Opciones'
};

module.exports = {
    MongoLocalCasa,
    MongoLocalTrabajo,
    MongoServer,
    Colecciones
};
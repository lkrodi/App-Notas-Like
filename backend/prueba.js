const prueba = require('../Backend/accesoData');

var idnotanueva = 16;
var data = [
    {
        IdNota : 17,
        Titulo : "numero 17 jejeje",
        Descripcion : "Spotify premium esuchar ppauririhhoashdoihasoi dasdsaDD",
        Categoria : {
            "IdCategoria" : 1,
            "Categoria" : "Personal"
        },
        FechaRegistro : "02/06/2018",
        Favorito : true,
        Estado : 1
    },
    {
        IdNota : 18,
        Titulo : "numero 18 jejejej",
        Descripcion : "Spotify premium esuchar ppauririhhoashdoihasoi dasdsaDD",
        Categoria : {
            "IdCategoria" : 1,
            "Categoria" : "Personal"
        },
        FechaRegistro : "02/06/2018",
        Favorito : true,
        Estado : 1
    },
    {
        IdNota : 19,
        Titulo : "numero 19 jejej",
        Descripcion : "Spotify premium esuchar ppauririhhoashdoihasoi dasdsaDD",
        Categoria : {
            "IdCategoria" : 1,
            "Categoria" : "Personal"
        },
        FechaRegistro : "02/06/2018",
        Favorito : true,
        Estado : 1
    }
];

var dataUpdate = {
    IdNota: 19,
    filters: {
        Descripcion : "Spotify premium esuchar ppauririhhoashdoihasoi dasdsaDD"
    },
    setUpdate: {
        Titulo: "cambiados todos",
        Descripcion: "todos cambiado XD",
        Categoria: {
            IdCategoria: 4,
            Categoria: "Deporte"
        },
        Favorito: false,
    }
}

var dataDelete = {
    filters: {
        FechaRegistro : "02/06/2018"
    }
};


prueba.EjecutarProcesoMongoDB(44, 'Notas', dataDelete, (resp) => {
    resp = JSON.parse(resp);
    console.log(resp);
});

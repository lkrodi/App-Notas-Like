var arrayNotas = []
var arrayCategorias = []
var server = 'http://10.0.2.15:4567'
var optionsSocket = {'forceNew': true}
var socketPrincipal = io.connect(server, optionsSocket)

/********************EVENTOS DEL DOM*****************************************/
$(document).ready(function() { 
    setTimeout(() => {
        $('#page-loader').fadeOut(800)
    }, 2000)

    CargarInformacionGeneral()
    CargarWatch()
});    

$('#btnCrearNota').on('click', function () {
    LimpiarNotaNueva()

    let eventoNota = parseInt($('#spEventoNota').html())
    switch (eventoNota) {
        case 1:
            $('#btnCrearNota').removeClass('btn-primary')
            $('#btnCrearNota').addClass('btn-danger')
            $('#btnCrearNota').html('<i class="fa fa-close" aria-hidden="true"></i> Cancelar')

            $('#NuevaNotaContainer').slideDown(500, () => $('#tituloNota').focus())
            $('#ListaNotasContainer').slideUp()
            $('#spEventoNota').html(2)
            $('#filtroInicio').prop('disabled', true)
            break;
        case 2:
            $('#btnCrearNota').removeClass('btn-danger')
            $('#btnCrearNota').addClass('btn-primary')
            $('#btnCrearNota').html('<i class="fa fa-plus-circle" aria-hidden="true"></i> CREAR NOTA')

            $('#NuevaNotaContainer').slideUp()
            $('#ListaNotasContainer').slideDown()
            $('#spEventoNota').html(1)
            $('#filtroInicio').prop('disabled', false)
            break;
        case 3:
            $('#NuevaNotaContainer').slideUp()
            $('#ListaNotasContainer').slideDown()
            $('#spEventoNota').html(1)
            $('#filtroInicio').prop('disabled', false)
        default:
            break;
    }
});

$('#btnGuardarNota').on('click', function () {
    try {
        let idNota = $('#spIdNotaPrincipal').html(),
        tituloNota = $("#tituloNota").val().trim(),
        descripcionNota = $("#descripcionNota").val().trim(),
        favoritoNota = false,
        categoriaNota = {};
    
        $('#categoria :selected').each(function (i, selected) {
            categoriaNota = {
                IdCategoria: parseInt($(selected).val()),
                Categoria: $(selected).text().trim()
            }
        })
    
        if (tituloNota.length == 0) {
            MostrarAlertUsuario('Error', 'Debes ingresar el titulo', 'error')
            return
        }
        if (descripcionNota.length == 0) {
            MostrarAlertUsuario('Error', 'Debes ingresar la descripcion', 'error')
            return
        }
        if (Object.keys(categoriaNota).length == 0) {
            MostrarAlertUsuario('Error', 'Debes seleccionar una categoria', 'error')
            return
        }
        if ($('#iFavorito').attr('class') == 'fa fa-heart white-text') {
            favoritoNota = false
        }
        if ($('#iFavorito').attr('class') == 'fa fa-heart red-text') {
            favoritoNota = true
        }
        if (idNota.length == 0) {
            idNota = 0
        }

        var FechaRegistro = obtenerFechaActual();

        let data = {
            IdNota: parseInt(idNota),
            Titulo: tituloNota,
            Descripcion: descripcionNota,
            Categoria: categoriaNota,
            Favorito: favoritoNota,
            FechaRegistro: FechaRegistro,
            Estado: 1,
            Proceso: 0
        }
    
        if (idNota !== 0) { //update
            data.Proceso = 1
            InsertarNota(data)
            $('#NuevaNotaContainer').slideUp()
            $('#ListaNotasContainer').slideDown()
        }
        else { //insert
            InsertarNota(data)
            $('#NuevaNotaContainer').slideUp()
            $('#ListaNotasContainer').slideDown()
        }

        $('#btnCrearNota').removeClass('btn-danger')
        $('#btnCrearNota').addClass('btn-primary')
        $('#btnCrearNota').html('<i class="fa fa-plus-circle" aria-hidden="true"></i> CREAR NOTA')

        $('#spEventoNota').html(1)
        $('#filtroInicio').prop('disabled', false)

    } catch (error) {
        console.log(error)
    }
});

$('#btnEliminarNota').on('click', function () {
    try {
        let idNota = parseInt($('#spIdNotaPrincipal').html())
        if (idNota.length == 0) {
            MostrarAlertUsuario('Error', 'No hay un registro seleccionado para eliminar', 'error')
            return
        }

        let nota = arrayNotas.filter(x => x.IdNota == idNota)[0]
        let data = {
            IdNota: parseInt(nota.IdNota),
            Titulo: nota.Titulo,
            Descripcion: nota.Descripcion,
            Categoria: nota.Categoria,
            Favorito: nota.Favorito,
            FechaRegistro: nota.FechaRegistro,
            Estado: 10,
            Proceso: 4
        }

        EliminarNota(data)

        $('#btnCrearNota').removeClass('btn-danger')
        $('#btnCrearNota').addClass('btn-primary')
        $('#btnCrearNota').html('<i class="fa fa-plus-circle" aria-hidden="true"></i> CREAR NOTA')

        $('#spEventoNota').html(1)
        $('#filtroInicio').prop('disabled', false)

        $('#NuevaNotaContainer').slideUp()
        $('#ListaNotasContainer').slideDown()

    } catch (error) {
        console.log(error)
    }
    
});

$('#filtroInicio').on('change', function () {
    try {
        let filtradoElementos = [],
            IdFiltro = parseInt($(this).val()),
            temporal = [],
            IdCategoria = 0,
            confirmacion = false,
            hijosDivListCompletas = $('#MainPrincipalContainer .container #ListaNotasContainer .container #ListasCompletas').children();
        
        if (IdFiltro == 0) {
            for (let i=0; i<hijosDivListCompletas.length; i++) {
                $(hijosDivListCompletas[i]).show(400)
            }
            return
        }

        for (let i=0; i<hijosDivListCompletas.length; i++) {
            IdCategoria = parseInt($(hijosDivListCompletas[i]).attr('class'))
            if (IdCategoria == IdFiltro) {
                temporal.push(IdCategoria)
            }
        }

        if (temporal.length == 0) {
            MostrarAlertUsuario('Advertencia', 'No existen notas para la categoria seleccionada', 'warning')
            return
        }

        for (let i=0; i<hijosDivListCompletas.length; i++) {
            IdCategoria = parseInt($(hijosDivListCompletas[i]).attr('class'))
            if (IdCategoria !== IdFiltro) {
                $(hijosDivListCompletas[i]).hide(400)
            } 
            else {
                $(hijosDivListCompletas[i]).show(400)
            }
        }

    } catch (error) {
        console.log(error)
    }

})

$('#iFavorito').on('click', function () {
    if ($('#iFavorito').attr('class') == 'fa fa-heart white-text') {
        $('#iFavorito').removeClass('white-text')
        $('#iFavorito').addClass('red-text')
        $('#iFavorito').css({'transition': '0.5s'})
        $('#iFavorito').attr('title', 'Desmarcar de Favoritos')
    }
    else {
        $('#iFavorito').removeClass('red-text')
        $('#iFavorito').addClass('white-text')
        $('#iFavorito').attr('title', 'Marcar como Favorito')
    }
});


/********************FUNCIONES PRINCIPALES************************************/
function CargarInformacionGeneral() {
    SelectNotas((a) => {
        SelectCategorias((b) => {
            LimpiarNotaNueva()
            initialData()
        })
    })

}

function CargarWatch() {

    socketPrincipal.on('notaInsertada', (data) => {
        data = JSON.parse(data)
        arrayNotas.push(data.data)
        recargarListCompletas()
        /*$('#mensajeNotify').removeClass('alert-warning')
        $('#mensajeNotify').removeClass('alert-primary')
        $('#mensajeNotify').removeClass('alert-danger')
        $('#mensajeNotify').addClass('alert-info')
        $('#mensajeNotify').html('<strong><b>Excelente!</b></strong>. Se acaba de agregar una nueva nota')
        $('#mensajeNotify').slideDown(400)
        /*setTimeout(() => {
            $('#mensajeNotify').slideUp()
        }, 3000)*/
    })

    socketPrincipal.on('notaActualizada', (data) => {
        data = JSON.parse(data)
        let p = arrayNotas.map(x => x.IdNota.toString()).indexOf(data.data.IdNota.toString())
        if (p != -1) {
            arrayNotas.splice(p, 1, data.data)
            recargarListCompletas()
            /*$('#mensajeNotify').removeClass('alert-info')
            $('#mensajeNotify').removeClass('alert-primary')
            $('#mensajeNotify').removeClass('alert-danger')
            $('#mensajeNotify').addClass('alert-warning')
            $('#mensajeNotify').html('<strong><b>Excelente!</b></strong>. Se acaba de actualizar una nota')
            $('#mensajeNotify').slideDown(400)
            /*setTimeout(() => {
                $('#mensajeNotify').slideUp()
            }, 3000)*/
        }
    })

    socketPrincipal.on('notaEliminada', (data) => {
        data = JSON.parse(data)
        let p = arrayNotas.map(x => x.IdNota.toString()).indexOf(data.data.IdNota.toString())
        if (p != -1) {
            arrayNotas.splice(p, 1)
            recargarListCompletas()
            /*$('#mensajeNotify').removeClass('alert-info')
            $('#mensajeNotify').removeClass('alert-primary')
            $('#mensajeNotify').removeClass('alert-warning')
            $('#mensajeNotify').addClass('alert-danger')
            $('#mensajeNotify').html('<strong><b>Excelente!</b></strong>.Se acaba de eliminar una nota')
            $('#mensajeNotify').slideDown(400)
            /*setTimeout(() => {
                $('#mensajeNotify').slideUp()
            }, 3000)*/
        }
    })
}

function SelectNotas(callback) {
    let parametros = {}

    socketPrincipal.emit('selectNotas', parametros, function (data) {
        data = JSON.parse(data)
        if (data.hasOwnProperty('Error')) {
            MostrarAlertUsuario('Error', data.Error, 'error')
            return
        }
        else {
            arrayNotas = data
            arrayNotas.sort((a,b) => { 
                return b.Favorito - a.Favorito
            })
            callback(0)
        }
    })
}

function SelectCategorias(callback) {
    let parametros = {}

    socketPrincipal.emit('selectCategorias', parametros, function (data) {
        data = JSON.parse(data)
        if (data.hasOwnProperty('Error')) {
            MostrarAlertUsuario('Error', data.Error, 'error')
            return
        }
        else {
            arrayCategorias = data
            callback(0)
        }
    })
}

function InsertarNota(nota) {
    let parametros = nota

    socketPrincipal.emit('insertNota', parametros, function (data) {
        data = JSON.parse(data)
        if (data.hasOwnProperty('Error')) {
            MostrarAlertUsuario('Error', data.Error, 'error')
            return
        }
    })
}

function EliminarNota(nota) {
    let parametros = nota

    socketPrincipal.emit('eliminarNota', parametros, function (data) {
        data = JSON.parse(data)
        if (data.hasOwnProperty('Error')) {
            MostrarAlertUsuario('Error', data.Error, 'error')
            return
        }
    })
}

function EjecutaEditar(idNota) {
    let data = arrayNotas.filter(x => x.IdNota == parseInt(idNota))[0]
    if (data == undefined) {
        MostrarAlertUsuario('Error', 'La nota ha sido eliminada. No puede ver', 'error')
        return
    }

    $('#spIdNotaPrincipal').html(data.IdNota)
    $('#tituloNota').val(data.Titulo)
    $('#descripcionNota').val(data.Descripcion)

    if (data.Favorito == true) {
        $('#iFavorito').attr('title', 'Marcado como favorito')
        $('#iFavorito').removeClass('white-text')
        $('#iFavorito').addClass('red-text')
    }
    else {
        $('#iFavorito').attr('title', 'Marcar como favorito')
        $('#iFavorito').removeClass('red-text')
        $('#iFavorito').addClass('white-text')
    }

    $('#btnGuardarNota').html('<i class="fa fa-edit" aria-hidden="true"></i> Actualizar')
    $('#btnGuardarNota').removeClass('btn-info')
    $('#btnGuardarNota').addClass('btn-primary')

    $('#btnCrearNota').removeClass('btn-primary')
    $('#btnCrearNota').addClass('btn-danger')
    $('#btnCrearNota').html('<i class="fa fa-close" aria-hidden="true"></i> Cerrar')

    $('#NuevaNotaContainer').slideDown()
    $('#ListaNotasContainer').slideUp()
    $('#filtroInicio').prop('disabled', true)
    $('#btnEliminarNota').slideDown()

    $('#spEventoNota').html(3)

    let htmlValores = '<option value=0 disabled>Selecciona una categoria</option>'
    arrayCategorias.map((a) => {
        htmlValores = htmlValores + '<option value='+ a.IdCategoria +'>'+ a.Categoria +'</option>'
    })
    $('#categoria').html(htmlValores)
    $('#categoria').val(data.Categoria.IdCategoria)
}

function EjecutaFavorito(idnota) {
    let nota = arrayNotas.filter(x => x.IdNota == parseInt(idnota))[0]
    if (nota == undefined) {
        MostrarAlertUsuario('Error', 'La nota ha sido eliminada. No puede modificar', 'error')
        return
    }    
    if (nota.Favorito) {
        nota.Favorito = false
    }
    else {
        nota.Favorito = true
    }
    
    nota.Proceso = 1
    InsertarNota(nota)
}


/********************FUNCIONES REUTILIZABLES************************************/
function initialData() {
    let divHTML
    arrayNotas.map(function (a) {
        divHTML =  crearHTMLContenido(a)
        $("#ListasCompletas").append(divHTML)
    })
}

function recargarListCompletas() {
    let hijosDivListCompletas = $('#MainPrincipalContainer .container #ListaNotasContainer .container #ListasCompletas').children();
    for (let i=0; i<hijosDivListCompletas.length; i++) {
        $(hijosDivListCompletas[i]).empty()
    }
    initialData()
}

function crearHTMLContenido(data) {
    let categoria = data.Categoria
    let colorCategoria = ''

    let colorFavorito = ''
    let textoFavorito = ''
    
    let descripcionNota = data.Descripcion

    switch (categoria.IdCategoria) {
        case 1:
            colorCategoria = 'blue' 
            break;
        case 2:
            colorCategoria = 'red'
            break;
        case 3:
            colorCategoria = 'orange'
            break;
        case 4:
            colorCategoria = 'violet'
            break;
        case 5:
            colorCategoria = 'yellow'
            break;
        case 6: 
            colorCategoria = 'black'
            break;
        case 7: 
            colorCategoria = 'pink'
            break;
        case 8:
            colorCategoria = 'green'
            break;
        default:
            break;
    }

    if (data.Descripcion.length > 70) {
        descripcionNota = data.Descripcion.substr(0, 70).toString()
    }

    if (data.Favorito === true) {
        colorFavorito = 'red-text'
        textoFavorito = 'Marcado como Favorito'
    } 
    else {
        colorFavorito = 'white-text'
        textoFavorito = 'Marcar como Favorito'
    }

    let stringHTML = ''
    stringHTML += '<div class="'+ data.Categoria.IdCategoria +'">'
        stringHTML += '<div class="col-sm-12">'
            stringHTML += '<br><div class="card w-75 cursorPointer">'
                stringHTML += '<div class="card-body">'
                    stringHTML += '<span id="spIdNota" hidden="hidden">'+ data.IdNota +'</span>'
                    stringHTML += '<i class="fa fa-heart '+ colorFavorito +'" aria-hidden="true" id="iFavorito" title="'+ textoFavorito +'" onclick="EjecutaFavorito('+ data.IdNota +');"></i>'    
                    stringHTML += '<h3 class="card-title" onclick="EjecutaEditar('+ data.IdNota +');" style="display:inline">'
                        stringHTML += ' ' + data.Titulo
                        stringHTML += '<span style="font-size: 17px; color: '+ colorCategoria +';" class="pull-right negrita">'+ categoria.Categoria +'</span>'
                    stringHTML += '</h3>'
                    stringHTML += '<div class="separaSeccion"></div>'
                    stringHTML += '<p class="card-text parrafo">'+ descripcionNota +'...<br>'
                        stringHTML += '<strong style="font-size: 11px;">'+ data.FechaRegistro +'</strong>'
                    stringHTML += '</p>'
                stringHTML += '</div>'
            stringHTML += '</div>'
        stringHTML += '</div>'
    stringHTML += '</div>'

    return $(stringHTML)
}

function renderizarHTML(stringHTML) {
    $("#ListasCompletas").append(stringHTML)
}

function obtenerFechaActual(fecha) {
    if (typeof fecha == 'undefined')
        fecha = new Date();

    return ('0' + (fecha.getDate())).slice(-2) + //DIA
        '/' +
        ('0' + (fecha.getMonth() + 1)).slice(-2) + //MES
        '/' +
        fecha.getFullYear();//AÑO
}

function LimpiarNotaNueva() {
    $("#spIdNotaPrincipal").html('')

    $('#tituloNota').val('')
    $('#descripcionNota').val('')
    $('#categoria').val(0)

    $('#iFavorito').removeClass('red-text')
    $('#iFavorito').addClass('white-text')
    $('#iFavorito').attr('title', 'Marcar como Favorito')
    
    $('#btnCrearNota').removeClass('btn-danger')
    $('#btnCrearNota').addClass('btn-primary')
    $('#btnCrearNota').html('<i class="fa fa-plus-circle" aria-hidden="true"></i> CREAR NOTA')

    $('#btnGuardarNota').html('<i class="fa fa-save" aria-hidden="true"></i> Guardar')
    $('#btnGuardarNota').removeClass('btn-primary')
    $('#btnGuardarNota').addClass('btn-info')

    let comboFiltro = '<option value=0 disabled>Selecciona un filtro</option>'
    let comboCategoria = '<option value=0 disabled>Selecciona una categoria</option>'

    arrayCategorias.map((a) => {
        comboFiltro = comboFiltro + '<option value='+ a.IdCategoria +'>'+ a.Categoria +'</option>'
    })
    arrayCategorias.map((a) => {
        comboCategoria = comboCategoria + '<option value='+ a.IdCategoria +'>'+ a.Categoria +'</option>'
    })

    $('#filtroInicio').html(comboFiltro)
    $('#categoria').html(comboCategoria)
    $('#filtroInicio').val(0)
    $('#categoria').val(0)
    
    $('#btnEliminarNota').slideUp()
}

function MostrarAlertUsuario(titulo, mensaje, icono) {
    swal({
        title: titulo.toString(),
        text: mensaje.toString(),
        icon: icono.toString(),
    });
}
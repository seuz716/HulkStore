const modelProductos = require("./model");

/* El servicio contiene la logica de la api recibe los datos del controlador 
y los manipula enviando y recibiendo los datos desde el model y dando respuesta al controlador*/

/* Obtiene todos los elementos */
async function obtenerProductos() {
  let Productos = await modelProductos.findAll();
  return Productos;
};

/* Obtiene un elemento por el _id de mongo */
async function obtenerProducto(id) {
  let Producto = await modelProductos.findOne(id);
  return Producto;
};




/* Obtiene elementos por nombre o parte de el*/
async function obtenerProductoPorNombre(nombre) {
  let producto = await modelProductos.obtenerPorNombre(nombre);
  return producto;
};


/*Crea un nuevo elemento*/
async function crearProducto(datos) {
  let resultado = {};
  if (datos && Object.keys(datos).length > 0) {
    let resConsulta = await modelProductos.crearUno(datos);
    if (resConsulta && resConsulta.acknowledged) {
      (resultado.mensaje = "Registro Producto correcto"),
        (resultado.datos = resConsulta.insertedId),
        (resultado.datos = datos);
    } else {
      (resultado.mensaje = "Registro Producto incorrecto"),
        (resultado.datos = datos);
    }
  } else {
    resultado.mensaje = "No se puede crear Producto";
    resultado.datos = "No hay datos";
  }
  return resultado;
};

async function actualizarInventario(id, datos) {
  let resultado = {};
  if (id && id.length == 24) {
    if (datos && Object.keys(datos).length > 0) {
      if (datos.nombre && datos.nombre !== "") {
        let resConsulta = await modelProductos.actualizarUna(id, datos);
        if (resConsulta && resConsulta.acknowledged) {
          resultado.mensaje = "Producto Actualizada correctamente";
          resultado.datos = resConsulta;
        } else {
          resultado.mensaje = "Error al actualizar";
          resultado.datos = resConsulta;
        }
      } else {
        resultado.mensaje = "Titulo vacio";
        resultado.datos = datos.nombre ? datos.nombre : "";
      }
    } else {
      resultado.mensaje = "No hay datos";
      resultado.datos = datos;
    }
  } else {
    resultado.mensaje = "ID invalido";
    resultado.datos = id;
  }
  return resultado;
};

async function actualizarProducto(id, datos) {
  let resultado = {};
  if (id && id.length == 24) {
    if (datos && Object.keys(datos).length > 0) {
      if (datos.nombre && datos.nombre !== "") {
        let resConsulta = await modelProductos.actualizarUna(id, datos);
        if (resConsulta && resConsulta.acknowledged) {
          resultado.mensaje = "Producto Actualizada correctamente";
          resultado.datos = resConsulta;
        } else {
          resultado.mensaje = "Error al actualizar";
          resultado.datos = resConsulta;
        }
      } else {
        resultado.mensaje = "Titulo vacio";
        resultado.datos = datos.nombre ? datos.nombre : "";
      }
    } else {
      resultado.mensaje = "No hay datos";
      resultado.datos = datos;
    }
  } else {
    resultado.mensaje = "ID invalido";
    resultado.datos = id;
  }
  return resultado;
};

async function eliminarProducto(id) {
  let resultado = {};
  if (id && id.length == 24 && /^[0-9A-F]+$/i.test(id)) {
    let resultadoEliminar = await modelProductos.eliminarUna(id);
    if (resultadoEliminar && resultadoEliminar.acknowledged) {
      resultado.mensaje = "Producto eliminada correctamente";
      resultado.datos = resultadoEliminar;
    } else {
      resultado.mensaje = "Error al eliminar";
      resultado.datos = id;
    }
  } else {
    resultado.mensaje = "ID invalido";
    resultado.datos = id;
  }
  return resultado;
};

module.exports.obtenerProductos = obtenerProductos;
module.exports.obtenerProducto = obtenerProducto;
module.exports.obtenerProductoPorNombre = obtenerProductoPorNombre;
module.exports.crearProducto = crearProducto;
module.exports.actualizarProducto = actualizarProducto;
module.exports.eliminarProducto = eliminarProducto;
module.exports.actualizarInventario = actualizarInventario;

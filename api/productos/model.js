const basedatos = require("../../database/connection");
const objectId = require("mongodb").ObjectId;

function findAll() {
  const db = basedatos.obtenerConexion();
  return db
    .collection("productos")
    .find({})
    .toArray()
    .then(function (productos) {
      return productos;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function findOne(id) {
  const db = basedatos.obtenerConexion();
  return db
    .collection("productos")
    .findOne({ _id: objectId(id) })
    .then(function (producto) {
      return producto;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function obtenerPorNombre(nombre) {
  let db = basedatos.obtenerConexion();
  return db
    .collection("productos")
    .find({ nombre: new RegExp(nombre, "i") })
    .toArray()
    .then(function (producto) {
      return producto;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function crearUno(datos) {
  let db = basedatos.obtenerConexion();
  return db
    .collection("productos")
    .insertOne(datos)
    .then(function (resConsulta) {
      return resConsulta;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function actualizarUna(id, datos) {
  let db = basedatos.obtenerConexion();
  return db
    .collection("productos")
    .updateOne({ _id: objectId(id) }, { $set: datos })
    .then(function (resultado) {
      console.log(resultado);
      return resultado;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function eliminarUna(id) {
  let db = basedatos.obtenerConexion();
  return db
    .collection("productos")
    .deleteOne({ _id: objectId(id) })
    .then(function (resultado) {
      console.log(resultado);
      return resultado;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function actualizarInventario(id, movimiento) {
  const db = basedatos.obtenerConexion();
  return db
    .collection("productos")
    .updateOne(
      { _id: objectId(id) },
      {
        $inc: { "inventario.stock": movimiento.cantidad },
        $push: { "inventario.movimientos": movimiento },
      }
    )
    .then(function (resultado) {
      console.log(resultado);
      return resultado;
    })
    .catch(function (error) {
      console.log(error);
    });
}

module.exports.findAll = findAll;
module.exports.findOne = findOne;
module.exports.obtenerPorNombre = obtenerPorNombre;
module.exports.crearUno = crearUno;
module.exports.actualizarUna = actualizarUna;
module.exports.eliminarUna = eliminarUna;
module.exports.actualizarInventario = actualizarInventario;
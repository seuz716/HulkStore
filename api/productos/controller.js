// Se importan las dependencias necesarias
const express = require("express");
const serviceProductos = require("./service");

// Se crea el enrutador de productos con Express
const controladorProductos = express.Router();

// Se definen los puntos de entrada a la API

// GET -> Obtiene todas los Productos.
controladorProductos.get("/obtenerProductos", async function (req, res) {
  // Se llama a la función obtenerProductos del servicio
  let Productos = await serviceProductos.obtenerProductos();
  // Se envía la respuesta con el listado de Productos obtenido
  res.send({
    mensaje: "Listado de Productos",
    data: Productos,
  });
});

// GET -> Obtiene una Producto por Id.
controladorProductos.get("/obtenerProducto/:id", async function (req, res) {
  // Se obtiene el ID de la Producto de los parámetros de la URL
  let id = req.params.id;
  // Se llama a la función obtenerProducto del servicio, pasándole el ID
  let Producto = await serviceProductos.obtenerProducto(id);
  // Se envía la respuesta con la Producto obtenida
  res.send({
    " mensaje": "Estación Eléctrica",
    data: Producto,
  });
});

// GET -> Obtiene una Producto por Nombre o descripcion.
controladorProductos.get("/obtenerProductoPorNombre/:nombre", async function (req, res) {
  // Se obtiene el nombre de la Producto de los parámetros de la URL
  let nombre = req.params.nombre;
  // Se llama a la función obtenerProductoPorNombre del servicio, pasándole el nombre
  let Producto = await serviceProductos.obtenerProductoPorNombre(nombre);
  // Se envía la respuesta con la Producto obtenida
  res.send({
    "mensaje ": "Plantas Encontrada",
    data: Producto
  });
});

// POST -> Crea una nueva Producto.
controladorProductos.post("/crearProducto", async function (req, res) {
  // Se obtienen los datos de la Producto del cuerpo de la petición
  let datos = req.body;
  // Se llama a la función crearProducto del servicio, pasándole los datos
  let Producto = await serviceProductos.crearProducto(datos);
  // Se envía la respuesta con los datos de la Producto creada
  res.send({
    mensaje: Producto.mensaje,
    datos: Producto.datos,
  });
});

// PUT -> Actualiza una Producto existente.
controladorProductos.put("/actualizarProducto/:id", async function (req, res) {
  // Se obtiene el ID de la Producto de los parámetros de la URL
  let id = req.params.id;
  // Se obtienen los datos actualizados de la Producto del cuerpo de la petición
  let datos = req.body;
  // Se llama a la función actualizarProducto del servicio, pasándole el ID y los datos actualizados
  let resultado = await serviceProductos.actualizarProducto(id, datos);
  // Se envía la respuesta con el resultado de la operación de actualización
  res.send(resultado);
});

// DELETE -> Elimina una Producto existente.
controladorProductos.delete("/eliminarProducto/:id", async function (req, res) {
  // Se obtiene el ID de la Producto de los parámetros de la URL
  let id = req.params.id;
  // Se llama a la función eliminarProducto del
  let resultado = await serviceProductos.eliminarProducto(id);
  res.send(resultado);
});

module.exports = controladorProductos;

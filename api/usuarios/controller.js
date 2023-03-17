const express = require("express");
const controladorUsuarios = express.Router();
const servicioUsuarios = require('./service');

/* 
Endpoint para iniciar sesión de usuario.
Recibe datos de usuario por medio de query params.
Devuelve resultado de autenticación.
*/
controladorUsuarios.get("/iniciarSesion", async function (req,res) {
  let datosUsuario = req.query;
  let resultado = await servicioUsuarios.iniciarSesion(datosUsuario);
  res.send(resultado);
});


controladorUsuarios.get("/obtenerusers", async function (req,res) {
  let datosUsuario = req.query;
  let resultado = await servicioUsuarios.obtenerUsuarios();
  res.send(resultado);
});

/* 
Endpoint para crear un nuevo usuario.
Recibe datos de usuario por medio de body.
Devuelve el resultado de la operación.
*/
controladorUsuarios.post("/crearusuario", async function (req, res) {
  let datosUsuario = req.body;
  let resultado = await servicioUsuarios.crearUsuario(datosUsuario);
  res.send(resultado);
});

/* 
Endpoint para actualizar un usuario existente.
Recibe el id del usuario a actualizar por medio de params y los nuevos datos por medio de body.
Devuelve el resultado de la operación.
*/
controladorUsuarios.put("/actualzarUsuario/:id", async function (req, res) {
  let id = req.params.id;
  let datos = req.body;
  let resultado = await servicioUsuarios.actualizarUser(id, datos);
  res.send(resultado);
});

/* 
Endpoint para eliminar un usuario existente.
Recibe el id del usuario a eliminar por medio de params.
Devuelve el resultado de la operación.
*/
controladorUsuarios.delete("/eliminarUsuario/:id", async function (req, res) {
  let id = req.params.id;
  let resultado = await servicioUsuarios.eliminarUsuario(id);
  res.send(resultado);

})

module.exports = controladorUsuarios;

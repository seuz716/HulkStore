const express = require('express');
const bcrypt = require('bcrypt');
const modeloUsuarios = require('./model');
const jwt = require('../auth/jwt');



// Inicia sesión de usuario
async function iniciarSesion(datosUsuario) {
  let resultado = {};
  
  // Verifica que los datos de usuario sean válidos
  if (
    datosUsuario &&
    Object.keys(datosUsuario).length > 0 &&
    datosUsuario.usuario &&
    datosUsuario.clave
  ) {
    // Busca el usuario por su nombre de usuario
    let usuario = await modeloUsuarios.buscarUsuario({ usuario: datosUsuario.usuario });
    
    if (usuario) {
      // Verifica si la clave de usuario es válida
      let claveEncriptada = usuario.clave;
      let esValida = bcrypt.compareSync(datosUsuario.clave, claveEncriptada);
      
      if (esValida) {
        // Genera un token JWT para el usuario y lo agrega al resultado
        resultado.mensaje = "Inicio de sesión correcto";
        let token = jwt.generarToken(usuario);
        delete usuario.clave;
        resultado.token = token;
      } else {
        // Devuelve un mensaje de error si la clave es incorrecta
        resultado.mensaje = "Usuario o Clave incorrectos";
        resultado.datos = datosUsuario;
      }
    } else {
      // Devuelve un mensaje de error si el usuario no existe
      resultado.mensaje = "Usuario o Clave incorrectos";
      resultado.datos = datosUsuario;
    }
  } else {
    // Devuelve un mensaje de error si los datos son inválidos
    resultado.mensaje = "Datos Incorrectos";
    resultado.datos = datosUsuario;
  }

  // Retorna el resultado de la operación
  return resultado;
}


async function obtenerUsuarios(){
    let resultado = await modeloUsuarios.findAll();
    return resultado;
};


/**
 * Función para crear un nuevo usuario en la base de datos.
 * @param {Object} datosUsuario - Los datos del usuario a crear.
 * @param {string} datosUsuario.usuario - El nombre de usuario del nuevo usuario.
 * @param {string} datosUsuario.clave - La contraseña en texto plano del nuevo usuario.
 * @returns {Object} Un objeto que indica si el usuario se creó correctamente o no.
 */

async function crearUsuario(datosUsuario) {
  let resultado = {};

  if (datosUsuario && Object.keys(datosUsuario).length > 0) {
    let usuarioExistente = await modeloUsuarios.buscarUsuario({ usuario: datosUsuario.usuario });

    if (usuarioExistente) {
      resultado.mensaje = "El usuario ya existe";
      resultado.datos = datosUsuario;
      return resultado;
    } else if (datosUsuario.usuario && datosUsuario.clave) {
      let claveEncriptada = bcrypt.hashSync(datosUsuario.clave, 10);
      datosUsuario.clave = claveEncriptada;
      let resultadoCrear = await modeloUsuarios.crearUno(datosUsuario);

      if (resultadoCrear && resultadoCrear.acknowledged) {
        resultado.mensaje = "Usuario creado correctamente";
        resultado.datos = resultadoCrear;
      } else {
        resultado.mensaje = "Usuario no creado";
        resultado.datos = datosUsuario;
      }
    } else {
      resultado.mensaje = "Usuario y clave son obligatorios";
      resultado.datos = datosUsuario;
    }
  } else {
    resultado.mensaje = "No hay datos de usuario para crear";
    resultado.datos = datosUsuario;
  }

  return resultado;
}

// Esta función asincrónica actualiza un usuario en la base de datos
// tomando un ID de usuario y los datos actualizados como argumentos
async function actualizarUsuario(id, datos){
    // Validar que el ID del usuario sea válido
    if (!id || id.length !== 24) {
        throw new Error("ID inválido");
    }

    // Validar que se hayan proporcionado datos para actualizar
    if (!datos || Object.keys(datos).length === 0) {
        throw new Error("No hay datos para actualizar");
    }

    // Validar que el campo de nombre sea válido
    if (!datos.usuario || typeof datos.usuario !== "string" || datos.usuario.trim() === "") {
        throw new Error(" Usuario inválido");
    }

    // Actualizar el usuario en la base de datos
    const resConsulta = await modeloUsuarios.actualizarUna(id, datos); 

    // Validar que se haya actualizado correctamente
    if (!resConsulta.acknowledged) {
        throw new Error("Error al actualizar");
    }

    // Devolver un mensaje de éxito
    return "Usuario actualizado correctamente";
};

async function eliminarUsuario(id) {
    try {
        // Validar la longitud y el formato del ID
        if (!id || id.length !== 24 || !/^[0-9A-F]+$/i.test(id)) {
            throw new Error("ID inválido");
        }

        // Verificar que el usuario exista en la base de datos
        const usuario = await modeloUsuarios.obtenerUna(id);
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }

        // Eliminar el usuario de la base de datos
        const resultadoEliminar = await modeloUsuarios.eliminarUna(id);

        // Verificar si se eliminó el usuario correctamente
        const eliminado = resultadoEliminar && resultadoEliminar.acknowledged;
        const mensaje = eliminado ? "Usuario eliminado correctamente" : "Error al eliminar";
        const codigoEstado = eliminado ? 200 : 500;

        return {
            mensaje,
            datos: eliminado ? resultadoEliminar : id,
            codigoEstado
        };
    } catch (error) {
        return {
            mensaje: error.message,
            datos: id,
            codigoEstado: 400
        };
    }
}



module.exports.crearUsuario = crearUsuario;
module.exports.iniciarSesion = iniciarSesion;
module.exports.obtenerUsuarios = obtenerUsuarios;
module.exports.actualizarUsuario = actualizarUsuario;
module.exports.eliminarUsuario = eliminarUsuario;


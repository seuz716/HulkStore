const express = require('express');
const bcrypt = require('bcrypt');
const modeloUsuarios = require('./model');
const jwt = require('../auth/jwt');
require('dotenv').config();


async function iniciarSesion(datosUsuario){
    let resultado ={};
    if (datosUsuario && Object.keys(datosUsuario).length>0 && datosUsuario.usuario && datosUsuario.clave){
            let usuario = await modeloUsuarios.buscarUsuario(datosUsuario.usuario);
            if (usuario){
                let claveEncriptada = usuario.clave;
                let esValida = bcrypt.compareSync(datosUsuario.clave, claveEncriptada);
                if (esValida){
                    resultado.mensaje = "Inicio de sesión correcto";
                    let token = jwt.generarToken(usuario);
                    delete usuario.clave;
                    resultado.token = token;
                     
                } 
                else {
                    resultado.mensaje = "Usuario o Clave incorrectos";
                    resultado.datos = datosUsuario;
                }
            } 
            else {
                    resultado.mensaje = "Usuario o Clave incorrectos";
                    resultado.datos = datosUsuario;
            }
    } 
    else {
             resultado.mensaje = "Datos Incorecctos";
             resultado.datos = datosUsuario; 
    }
    return resultado;
}

async function obtenerUsuarios(){
    let resultado = await modeloUsuarios.findAll();
    return resultado;
};

async function crearUsuario (datosUsuario){
     let resultado = {};
    /*1. objeto vacio*
      *2  existan  las llaves usuario y  clave
    */
    if (datosUsuario  && Object.keys(datosUsuario).length>0){
        if (datosUsuario.usuario && datosUsuario.clave){
            let claveEncriptada = bcrypt.hashSync(datosUsuario.clave, parseInt(process.env.ENC_SALTROUNDS));
            datosUsuario.clave = claveEncriptada;
            let resultadoCrear = await modeloUsuarios.crearUno(datosUsuario);
            if (resultadoCrear && resultadoCrear.acknowledged){
                resultado.mensaje = "Usuario creado correctamente";
                resultado.datos = resultadoCrear;
                
            } else {
                resultado.mensaje = "Usuario  no creado";
                resultado.datos = datosUsuario;
            }
        }
         else {
               resultado.mensaje = "Usuario y clave deben existir";
               resultado.datos = datosUsuario;
        }
    }
     else {
           resultado.mensaje = "No hay datos";
           resultado.datos = datosUsuario;
    }
    return resultado;
};

async function actualizarUsuario(id, datos){
    let resultado = {};
    if (id && id.length == 24){
        if (datos && Object.keys(datos).length > 0){
            if (datos.nombre && datos.nombre !== ""){
                let resConsulta = await modeloUsuarios.actualizarUna(id, datos); 
                    if (resConsulta && resConsulta.acknowledged){
                        resultado.mensaje = "Usuario Actualizado correctamente";
                        resultado.datos = resConsulta;
                    } 
                    else {
                          resultado.mensaje = "Error al actualizar";
                          resultado.datos = resConsulta;  
                    }               
            } 
            else {
                resultado.mensaje = "Titulo vacio";
                resultado.datos = datos.nombre ? datos.nombre :"" ;
            }
        } 
        else {
                resultado.mensaje = "No hay datos";
                resultado.datos = datos;
        }
   } 
    else {
        resultado.mensaje = "ID invalido";
        resultado.datos = id;
    }
    return resultado;
};

async function eliminarUsuario(id){
    let resultado = {};
    if (id && id.length == 24 && /^[0-9A-F]+$/i.test(id)){
        let resultadoEliminar = await modeloUsuarios.eliminarUna(id); 
                if        (resultadoEliminar  && resultadoEliminar.acknowledged){
                          resultado.mensaje = "Usuario eliminado correctamente";
                          resultado.datos = resultadoEliminar;
                    } 
                else {
                          resultado.mensaje = "Error al eliminar";
                          resultado.datos = id;  
                    }               
             } 
                else {
                          resultado.mensaje = "ID invalido";
                          resultado.datos = id;
                     }
     return resultado;
};



module.exports.crearUsuario = crearUsuario;
module.exports.iniciarSesion = iniciarSesion;
module.exports.obtenerUsuarios = obtenerUsuarios;
module.exports.actualizarUsuario = actualizarUsuario;
module.exports.eliminarUsuario = eliminarUsuario;


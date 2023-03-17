const basedatos = require("../../database/connection");
const objectId = require("mongodb").ObjectId;
// let db =  basedatos.obtenerConexion(); permite la conexion db a todas las funciones

/* Modelo 
    Manipular la base de datos
    Obtener, actualizar, guardar, eliminar los envia al servicio
*/


/**
 * Función para buscar todos los usuarios en la base de datos.
 * Utiliza async/await para manejar la asincronía.
 * @returns {Promise} Una promesa que resuelve con los usuarios encontrados en la base de datos.
 *                    Si ocurre un error, la promesa se rechaza con un objeto de Error.
 */
async function findAll() {
  // Obtiene la conexión a la base de datos desde el módulo de conexión.
  let db = basedatos.obtenerConexion();

  try {
    // Busca todos los usuarios en la colección "users".
    let usuarios = await db.collection("users").find({}).toArray();
    return usuarios;
  } catch (error) {
    // Si ocurre un error, lanza una excepción con un mensaje de error.
    throw new Error("Error al buscar los usuarios: " + error.message);
  } 
}





function obtenerUna(id) {
            let db =  basedatos.obtenerConexion();
             return db.collection("users").findOne({"_id" : objectId(id)})
            .then(function (usuario){
                return usuario;
            })
            .catch(function (error){
                console.log(error);
            })
    };  

async function buscarUsuario(nombre) {
        let db =  basedatos.obtenerConexion();
         return await db.collection("users").findOne({"usuario" : nombre});
};    


async function crearUno(datosUsuario){
    let db =  basedatos.obtenerConexion();
     return  await db.collection("users").insertOne(datosUsuario);
};

function actualizarUna(id, datos){
    let db =  basedatos.obtenerConexion();
     return db.collection("users").updateOne(
            {"_id": objectId(id)},
            {"$set": datos}
     )       
    .then(function (resultado){
        console.log(resultado);
        return resultado; 
    })
    .catch(function (error){
        console.log(error);
    })
};

function eliminarUna(id){
    let db =  basedatos.obtenerConexion();
     return db.collection("users").deleteOne(
            {"_id": objectId(id)},
           
     )       
    .then(function (resultado){
        console.log(resultado);
        return resultado; 
    })
    .catch(function (error){
        console.log(error);
    })
};



    

    module.exports.findAll = findAll;
    module.exports.obtenerUna = obtenerUna;        
    module.exports.crearUno = crearUno; 
    module.exports.actualizarUna = actualizarUna;
    module.exports.eliminarUna = eliminarUna;
    module.exports.buscarUsuario = buscarUsuario;
    

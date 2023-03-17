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





// Función que busca y devuelve un documento de usuario por ID utilizando la función `findOne` de la biblioteca `mongodb`
function obtenerUna(id) {

    // Obtener una conexión a la base de datos
    let db = basedatos.obtenerConexion();

    // Buscar el documento utilizando `findOne` y devolver la promesa resultante
    return db.collection("users").findOne({"_id" : objectId(id)})

        // Si la promesa se resuelve correctamente, devolver el documento de usuario
        .then(function (usuario){
            return usuario;
        })

        // Si se produce un error, imprimirlo en la consola y continuar
        .catch(function (error){
            console.log(error);
        })

};


// Función asincrónica que busca un documento de usuario en una base de datos
// utilizando la función `findOne` de la biblioteca `mongodb`
async function buscarUsuario(datosUsuario) {

    // Obtener una conexión a la base de datos
    let db = basedatos.obtenerConexion();

    // Esperar la resolución de la promesa devuelta por `findOne` utilizando la palabra clave `await`
    return await db.collection("users").findOne({usuario: datosUsuario.usuario});

};
   


// Función asincrónica que crea un nuevo documento de usuario en una base de datos
// utilizando la función `insertOne` de la biblioteca `mongodb`
async function crearUno(datosUsuario){

    // Obtener una conexión a la base de datos
    let db =  basedatos.obtenerConexion();

    // Esperar la resolución de la promesa devuelta por `insertOne` utilizando la palabra clave `await`
    return await db.collection("users").insertOne(datosUsuario)
    
    // Manejar el resultado de la operación de inserción
    .then(function (resultado){
        console.log(resultado);
        return resultado; 
    })

    // Manejar los errores que puedan ocurrir durante la operación de inserción
    .catch(function (error){
        console.log(error);
    });
};



function actualizarUna(id, datos){
    // Obtener la conexión a la base de datos
    let db =  basedatos.obtenerConexion();

    // Actualizar un documento de la colección 'users' según su ID, estableciendo nuevos valores para los campos especificados en 'datos'
    return db.collection("users").updateOne(
        {"_id": objectId(id)}, // Consulta para encontrar el documento a actualizar, basándose en su ID
        {"$set": datos} // Operador de actualización para establecer nuevos valores para los campos especificados en 'datos'
    )
    // Si la actualización es exitosa, devolver un objeto con información sobre la operación
    .then(function (resultado){
        console.log(resultado); // Imprimir información sobre la operación en la consola
        return resultado; // Devolver el objeto con información sobre la operación
    })
    // Si ocurre algún error durante la actualización, imprimir el error en la consola
    .catch(function (error){
        console.log(error);
    });
};


function eliminarUna(id){
    // Obtener la conexión a la base de datos
    let db =  basedatos.obtenerConexion();

    // Eliminar un documento de la colección 'users' según su ID
    return db.collection("users").deleteOne(
        {"_id": objectId(id)}
    )
    // Si la eliminación es exitosa, devolver un objeto con información sobre la operación
    .then(function (resultado){
        console.log(resultado); // Imprimir información sobre la operación en la consola
        return resultado; // Devolver el objeto con información sobre la operación
    })
    // Si ocurre algún error durante la eliminación, imprimir el error en la consola
    .catch(function (error){
        console.log(error);
    });
};




    

    module.exports.findAll = findAll;
    module.exports.obtenerUna = obtenerUna;        
    module.exports.crearUno = crearUno; 
    module.exports.actualizarUna = actualizarUna;
    module.exports.eliminarUna = eliminarUna;
    module.exports.buscarUsuario = buscarUsuario;
    

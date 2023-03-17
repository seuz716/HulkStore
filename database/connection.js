const mongoClient = require("mongodb").MongoClient;
require("dotenv").config();

let conexion;

const conectar = function () {
  return new Promise(function (resolve, reject) {
    if (conexion) {
      return resolve();
    }
    mongoClient.connect("mongodb+srv://cesar:cesar@cluster0.wtlfm.mongodb.net/?retryWrites=true&w=majority" {            useNewUrlParser: true })
      .then(function (client) {
        conexion = client.db("hulk");
        console.log("Base de datos conectada exitosamente");
        resolve();
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

const getConexion = function () {
  if (!conexion) {
    throw new Error("La conexión a la base de datos aún no se ha establecido.");
  }
  return conexion;
};

module.exports = { conectar, getConexion };

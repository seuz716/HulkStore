const jwt = require('jsonwebtoken');
require('dotenv').config();

/* Los datos requeridos son  Id, roles, nombre */

function generarToken(datos) {
    let payload = {
        "id":datos._id,
        "nombre":datos.nombre,
        
    }
    const token = jwt.sign(payload,"clave_secreta_para_generar_el_token",{
        expiresIn:"2h"
    }) 
    
    return token;
}

module.exports.generarToken = generarToken;
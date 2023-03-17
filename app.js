/* Importar los módulos requeridos */
const express = require('express');
const conexion = require('./database/connection');
const controladorProductos = require('./api/productos/controller');
const controladorUsuarios = require('./api/usuarios/controller');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

/* Configuracion Inicial */
const app = express();
const port = process.env.PORT || 3500;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(cors());
app.use(compression());
app.use(helmet());

/* Iniciar las rutas */
app.use('/api/productos', controladorProductos);
app.use('/api/usuarios', controladorUsuarios);

/* Configurar el puerto */
conexion.conectar()
  .then(() => {
    app.listen(port, () => {
      console.log(`API ejecutándose exitosamente en el puerto: ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

const modelProductos = require("./model");

/* El servicio contiene la logica de la api recibe los datos del controlador 
y los manipula enviando y recibiendo los datos desde el model y dando respuesta al controlador*/

/* Obtiene todos los elementos */
async function obtenerProductos(orden = "asc") {
  try {
    const productos = await modelProductos.findAll({
      order: [["nombre", orden]],
    });
    return productos;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener los productos");
  }
};



/* Obtiene un elemento por el _id de mongo */

async function obtenerProducto(id) {
  try {
    let producto;
    if (!id) {
      producto = { mensaje: "Debe proporcionar un ID válido" };
    } else {
      producto = await modelProductos.findOne(id);
      if (!producto) {
        producto = { mensaje: `No se encontró un producto con ID: ${id}` };
      }
    }
    return producto;
  } catch (error) {
    console.error(error);
    return { mensaje: "Error al obtener el producto" };
  }
};




/* Obtiene elementos por nombre o parte de el*/
async function obtenerProductoPorNombre(nombre) {
  console.log("Buscando productos con nombre: ", nombre);
  let producto = await modelProductos.obtenerPorNombre(nombre);
  return producto;
};

/*Crea un nuevo elemento*/
async function crearProducto(datos) {
  let resultado = {};
  if (!datos || Object.keys(datos).length === 0) {
    resultado.mensaje = "No se puede crear Producto";
    resultado.datos = "No hay datos";
    return resultado;
  }
  const { nombre, descripcion, marca, categoria, precio, inventario } = datos;
  if (!nombre || !descripcion || !marca || !categoria || !precio || !inventario) {
    resultado.mensaje = "No se puede crear Producto";
    resultado.datos = "Faltan campos requeridos";
    return resultado;
  }
  if (typeof nombre !== "string" || typeof descripcion !== "string" || typeof marca !== "string" || typeof categoria !== "string") {
    resultado.mensaje = "No se puede crear Producto";
    resultado.datos = "Los campos de texto deben ser cadenas de caracteres";
    return resultado;
  }
  if (typeof precio !== "number" || precio <= 0) {
    resultado.mensaje = "No se puede crear Producto";
    resultado.datos = "El precio debe ser un número positivo mayor a cero";
    return resultado;
  }
  if (!inventario.stock || typeof inventario.stock !== "number" || inventario.stock < 0) {
    resultado.mensaje = "No se puede crear Producto";
    resultado.datos = "El inventario debe tener un stock numérico no negativo";
    return resultado;
  }
  if (inventario.minimo !== undefined && (typeof inventario.minimo !== "number" || inventario.minimo < 0)) {
    resultado.mensaje = "No se puede crear Producto";
    resultado.datos = "El inventario debe tener un mínimo numérico no negativo";
    return resultado;
  }
  if (inventario.maximo !== undefined && (typeof inventario.maximo !== "number" || inventario.maximo < 0)) {
    resultado.mensaje = "No se puede crear Producto";
    resultado.datos = "El inventario debe tener un máximo numérico no negativo";
    return resultado;
  }
  if (inventario.minimo !== undefined && inventario.maximo !== undefined && inventario.minimo > inventario.maximo) {
    resultado.mensaje = "No se puede crear Producto";
    resultado.datos = "El mínimo del inventario debe ser menor o igual al máximo";
    return resultado;
  }
  if (!inventario.movimientos || !Array.isArray(inventario.movimientos)) {
    resultado.mensaje = "No se puede crear Producto";
    resultado.datos = "El inventario debe tener un array de movimientos";
    return resultado;
  }
  for (const movimiento of inventario.movimientos) {
    if (typeof movimiento.fecha !== "string" || !Date.parse(movimiento.fecha)) {
      resultado.mensaje = "No se puede crear Producto";
      resultado.datos = "La fecha del movimiento debe ser una cadena de caracteres con formato de fecha";
      return resultado;
    }
    if (typeof movimiento.tipo !== "string" || !["entrada", "salida", "ajuste"].includes(movimiento.tipo)) {
      resultado.mensaje = "No se puede crear Producto";
      resultado.datos = "El tipo del movimiento debe ser 'entrada', 'salida' o 'ajuste'";
      return resultado;
    }
    if (typeof movimiento.cantidad !== "number" || movimiento.cantidad <= 0) {
      resultado.mensaje = "No se puede crear Producto";
        resultado.datos = "La cantidad del movimiento debe ser un número positivo mayor a cero";
      return resultado;
    }
  }
  // Si se pasaron todas las validaciones, se puede crear el producto
  resultado.mensaje = "Producto creado exitosamente";
  resultado.datos = datos;
  return resultado;
}

async function actualizarProducto(id, datos) {
  let resultado = {};
  if (id && id.length == 24) {
    if (datos && Object.keys(datos).length > 0) {
      let producto = await modelProductos.obtenerPorId(id);
      if (producto) {
        let inventario = producto.inventario;
        if (datos.nombre && datos.nombre !== "") {
          // Actualiza el nombre
          producto.nombre = datos.nombre;
        }
        if (datos.descripcion && datos.descripcion !== "") {
          // Actualiza la descripción
          producto.descripcion = datos.descripcion;
        }
        if (datos.marca && datos.marca !== "") {
          // Actualiza la marca
          producto.marca = datos.marca;
        }
        if (datos.categoria && datos.categoria !== "") {
          // Actualiza la categoría
          producto.categoria = datos.categoria;
        }
        if (datos.precio && datos.precio !== "") {
          // Actualiza el precio
          producto.precio = datos.precio;
        }
        if (datos.inventario && Object.keys(datos.inventario).length > 0) {
          if (datos.inventario.stock && datos.inventario.stock !== "") {
            // Actualiza el stock
            inventario.stock = datos.inventario.stock;
          }
          if (datos.inventario.minimo && datos.inventario.minimo !== "") {
            // Actualiza el mínimo de inventario
            inventario.minimo = datos.inventario.minimo;
          }
          if (datos.inventario.maximo && datos.inventario.maximo !== "") {
            // Actualiza el máximo de inventario
            inventario.maximo = datos.inventario.maximo;
          }
          if (datos.inventario.movimientos && datos.inventario.movimientos.length > 0) {
            // Actualiza los movimientos de inventario
            inventario.movimientos.push(...datos.inventario.movimientos);
          }
          // Actualiza el inventario en el objeto producto
          producto.inventario = inventario;
        }
        let resConsulta = await modelProductos.actualizarUna(id, producto);
        if (resConsulta && resConsulta.acknowledged) {
          resultado.mensaje = "Producto actualizado correctamente";
          resultado.datos = resConsulta;
        } else {
          resultado.mensaje = "Error al actualizar";
          resultado.datos = resConsulta;
        }
      } else {
        resultado.mensaje = "Producto no encontrado";
        resultado.datos = id;
      }
    } else {
      resultado.mensaje = "No hay datos";
      resultado.datos = datos;
    }
  } else {
    resultado.mensaje = "ID inválido";
    resultado.datos = id;
  }
  return resultado;
}



async function eliminarProducto(id) {
  let resultado = {};
  if (id && id.length == 24 && /^[0-9A-F]+$/i.test(id)) {
    let resultadoEliminar = await modelProductos.eliminarUna(id);
    if (resultadoEliminar && resultadoEliminar.acknowledged) {
      resultado.mensaje = "Producto eliminada correctamente";
      resultado.datos = resultadoEliminar;
    } else {
      resultado.mensaje = "Error al eliminar";
      resultado.datos = id;
    }
  } else {
    resultado.mensaje = "ID invalido";
    resultado.datos = id;
  }
  return resultado;
};

module.exports.obtenerProductos = obtenerProductos;
module.exports.obtenerProducto = obtenerProducto;
module.exports.obtenerProductoPorNombre = obtenerProductoPorNombre;
module.exports.crearProducto = crearProducto;
module.exports.actualizarProducto = actualizarProducto;
module.exports.eliminarProducto = eliminarProducto;

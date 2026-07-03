/* ============================================================================
   GESTIÓN DE CONTENIDO Y USUARIOS EN MONGODB — PROYECTO "STREAMHUB"
   Base de Datos No Relacionales
   ============================================================================

   Cómo ejecutar este archivo:
   1. Abrir MongoDB Compass o mongosh.
   2. Conectarse a una instancia local (mongodb://localhost:27017) o Atlas.
   3. En mongosh: 
        load("streamhub_mongodb.js")
      O copiar y pegar los bloques por sección en la shell / Compass "mongosh" tab.

   Base de datos utilizada: streamhub
   ============================================================================ */

use("streamhub");

/* ============================================================================
   TASK 1 — ANÁLISIS DEL DOMINIO Y DISEÑO DE DOCUMENTOS
   ============================================================================

   Dominio: StreamHub, una plataforma de streaming de contenido audiovisual.

   Colecciones definidas:

   1) usuarios
      - Información de la cuenta, plan de suscripción e historial de
        visualización (arreglo de documentos anidados con referencia al
        contenido visto, fecha y progreso).

   2) contenidos
      - Colección unificada para películas y series (se diferencian por el
        campo "tipo": "pelicula" | "serie"). Incluye campos comunes
        (título, género, año, duración, actores) y campos anidados
        específicos (temporadas para series, reseñas embebidas).

   3) valoraciones
      - Calificaciones y comentarios que los usuarios hacen sobre un
        contenido. Se modela como colección separada (y no embebida en
        "contenidos") porque crece de forma independiente y puede
        consultarse/agregarse con alta frecuencia (patrón de referencia).

   4) listas
      - Listas personalizadas de usuarios (ej. "Ver más tarde",
        "Favoritos"), con arreglo de referencias a contenidos.

   -- Estructura JSON de cada documento --------------------------------------

   usuarios
   {
     _id: ObjectId,
     nombre: String,
     email: String,
     edad: Number,
     pais: String,
     plan: String,            // "basico" | "estandar" | "premium"
     fechaRegistro: Date,
     activo: Boolean,
     historial: [             // documentos anidados
       {
         contenidoId: ObjectId,
         tituloVisto: String,
         fecha: Date,
         progreso: Number     // porcentaje 0-100
       }
     ]
   }

   contenidos
   {
     _id: ObjectId,
     titulo: String,
     tipo: String,             // "pelicula" | "serie"
     genero: [String],         // arreglo de géneros
     anio: Number,
     duracionMinutos: Number,  // para películas
     temporadas: Number,       // para series (null en películas)
     director: String,
     actores: [String],
     calificacionPromedio: Number,
     pais: String,
     sinopsis: String,
     reseñas: [                // reseñas embebidas rápidas (resumen)
       { usuario: String, comentario: String, puntuacion: Number }
     ]
   }

   valoraciones
   {
     _id: ObjectId,
     usuarioId: ObjectId,
     usuarioNombre: String,
     contenidoId: ObjectId,
     contenidoTitulo: String,
     puntuacion: Number,       // 1 a 5
     comentario: String,
     fecha: Date
   }

   listas
   {
     _id: ObjectId,
     usuarioId: ObjectId,
     nombreLista: String,      // "Favoritos", "Ver más tarde"
     contenidos: [ObjectId],   // referencias a _id de "contenidos"
     fechaCreacion: Date
   }

   ============================================================================ */


/* ============================================================================
   TASK 2 — INSERCIÓN DE DATOS
   ============================================================================ */

/* ---- 2.1 Limpieza previa (opcional, útil para reejecutar el script) ------ */
db.usuarios.drop();
db.contenidos.drop();
db.valoraciones.drop();
db.listas.drop();

/* ---- 2.2 Inserción de contenidos (insertMany) ----------------------------- */
db.contenidos.insertMany([
  {
    titulo: "El Origen del Código",
    tipo: "pelicula",
    genero: ["Ciencia Ficción", "Acción"],
    anio: 2019,
    duracionMinutos: 148,
    temporadas: null,
    director: "Laura Méndez",
    actores: ["Carlos Ríos", "Ana Torres"],
    calificacionPromedio: 4.5,
    pais: "México",
    sinopsis: "Un programador descubre que vive dentro de una simulación.",
    reseñas: [
      { usuario: "juanp", comentario: "Excelente ritmo y efectos.", puntuacion: 5 },
      { usuario: "marial", comentario: "Un poco larga pero buena.", puntuacion: 4 }
    ]
  },
  {
    titulo: "Noches de Barranquilla",
    tipo: "pelicula",
    genero: ["Drama", "Romance"],
    anio: 2021,
    duracionMinutos: 110,
    temporadas: null,
    director: "Sofía Cantillo",
    actores: ["Diego Pérez", "Valentina Suárez"],
    calificacionPromedio: 4.1,
    pais: "Colombia",
    sinopsis: "Dos jóvenes viven una historia de amor durante el Carnaval.",
    reseñas: [
      { usuario: "karenr", comentario: "Muy emotiva.", puntuacion: 4 }
    ]
  },
  {
    titulo: "Frontera Digital",
    tipo: "pelicula",
    genero: ["Thriller", "Ciencia Ficción"],
    anio: 2023,
    duracionMinutos: 132,
    temporadas: null,
    director: "Mateo Rodríguez",
    actores: ["Elena Gómez", "Pedro Salas"],
    calificacionPromedio: 3.9,
    pais: "España",
    sinopsis: "Un hacker debe evitar un colapso financiero global.",
    reseñas: []
  },
  {
    titulo: "Raíces del Sur",
    tipo: "serie",
    genero: ["Drama", "Historia"],
    anio: 2020,
    duracionMinutos: null,
    temporadas: 3,
    director: "Camila Herrera",
    actores: ["Andrés Duarte", "Lucía Vargas"],
    calificacionPromedio: 4.7,
    pais: "Colombia",
    sinopsis: "La historia de una familia campesina a través de tres generaciones.",
    reseñas: [
      { usuario: "pablos", comentario: "Una obra maestra.", puntuacion: 5 },
      { usuario: "danielaf", comentario: "Muy bien actuada.", puntuacion: 5 }
    ]
  },
  {
    titulo: "Código Rojo",
    tipo: "serie",
    genero: ["Acción", "Crimen"],
    anio: 2022,
    duracionMinutos: null,
    temporadas: 2,
    director: "Ricardo Nieto",
    actores: ["Camilo Restrepo", "Isabel Ortiz"],
    calificacionPromedio: 4.0,
    pais: "México",
    sinopsis: "Una unidad especial de policía combate el crimen organizado.",
    reseñas: [
      { usuario: "juanp", comentario: "Adictiva desde el primer capítulo.", puntuacion: 4 }
    ]
  },
  {
    titulo: "Risas en Cadena",
    tipo: "serie",
    genero: ["Comedia"],
    anio: 2018,
    duracionMinutos: null,
    temporadas: 5,
    director: "Fernanda López",
    actores: ["Gabriel Castro", "Natalia Peña"],
    calificacionPromedio: 3.8,
    pais: "Argentina",
    sinopsis: "Las aventuras de un grupo de amigos en Buenos Aires.",
    reseñas: []
  },
  {
    titulo: "Al Filo del Abismo",
    tipo: "pelicula",
    genero: ["Acción", "Aventura"],
    anio: 2017,
    duracionMinutos: 125,
    temporadas: null,
    director: "Hugo Sánchez",
    actores: ["Marco Fuentes", "Regina Blanco"],
    calificacionPromedio: 4.3,
    pais: "Estados Unidos",
    sinopsis: "Un grupo de exploradores busca un tesoro perdido en los Andes.",
    reseñas: [
      { usuario: "karenr", comentario: "Buenos efectos especiales.", puntuacion: 4 }
    ]
  },
  {
    titulo: "Ecos del Pasado",
    tipo: "pelicula",
    genero: ["Drama"],
    anio: 2015,
    duracionMinutos: 98,
    temporadas: null,
    director: "Patricia Domínguez",
    actores: ["Rodrigo Aguilar", "Silvia Molina"],
    calificacionPromedio: 3.6,
    pais: "Chile",
    sinopsis: "Un hombre reconstruye su historia familiar tras un accidente.",
    reseñas: []
  }
]);

/* ---- 2.3 Inserción de usuarios (insertMany), con historial embebido ------- */
db.usuarios.insertMany([
  {
    nombre: "Juan Pérez",
    email: "juanp@correo.com",
    edad: 27,
    pais: "Colombia",
    plan: "premium",
    fechaRegistro: new Date("2022-01-15"),
    activo: true,
    historial: [
      { tituloVisto: "El Origen del Código", fecha: new Date("2024-02-01"), progreso: 100 },
      { tituloVisto: "Código Rojo", fecha: new Date("2024-03-10"), progreso: 80 },
      { tituloVisto: "Al Filo del Abismo", fecha: new Date("2024-04-05"), progreso: 100 },
      { tituloVisto: "Raíces del Sur", fecha: new Date("2024-05-20"), progreso: 60 },
      { tituloVisto: "Frontera Digital", fecha: new Date("2024-06-01"), progreso: 100 },
      { tituloVisto: "Risas en Cadena", fecha: new Date("2024-06-15"), progreso: 45 }
    ]
  },
  {
    nombre: "Karen Rodríguez",
    email: "karenr@correo.com",
    edad: 34,
    pais: "México",
    plan: "estandar",
    fechaRegistro: new Date("2021-08-22"),
    activo: true,
    historial: [
      { tituloVisto: "Noches de Barranquilla", fecha: new Date("2024-01-10"), progreso: 100 },
      { tituloVisto: "Al Filo del Abismo", fecha: new Date("2024-02-14"), progreso: 90 }
    ]
  },
  {
    nombre: "María López",
    email: "marial@correo.com",
    edad: 22,
    pais: "Argentina",
    plan: "basico",
    fechaRegistro: new Date("2023-05-02"),
    activo: false,
    historial: [
      { tituloVisto: "El Origen del Código", fecha: new Date("2023-06-01"), progreso: 100 }
    ]
  },
  {
    nombre: "Pablo Sánchez",
    email: "pablos@correo.com",
    edad: 41,
    pais: "Colombia",
    plan: "premium",
    fechaRegistro: new Date("2020-11-30"),
    activo: true,
    historial: [
      { tituloVisto: "Raíces del Sur", fecha: new Date("2024-01-05"), progreso: 100 },
      { tituloVisto: "Raíces del Sur", fecha: new Date("2024-01-06"), progreso: 100 },
      { tituloVisto: "Código Rojo", fecha: new Date("2024-02-11"), progreso: 100 },
      { tituloVisto: "Ecos del Pasado", fecha: new Date("2024-03-19"), progreso: 100 },
      { tituloVisto: "Frontera Digital", fecha: new Date("2024-04-22"), progreso: 70 },
      { tituloVisto: "Al Filo del Abismo", fecha: new Date("2024-05-30"), progreso: 100 }
    ]
  },
  {
    nombre: "Daniela Fonseca",
    email: "danielaf@correo.com",
    edad: 29,
    pais: "España",
    plan: "estandar",
    fechaRegistro: new Date("2022-09-18"),
    activo: true,
    historial: [
      { tituloVisto: "Raíces del Sur", fecha: new Date("2024-02-01"), progreso: 100 },
      { tituloVisto: "Risas en Cadena", fecha: new Date("2024-02-20"), progreso: 100 }
    ]
  }
]);

/* ---- 2.4 Inserción de una valoración individual (insertOne) --------------- */
db.valoraciones.insertOne({
  usuarioId: db.usuarios.findOne({ email: "juanp@correo.com" })._id,
  usuarioNombre: "Juan Pérez",
  contenidoId: db.contenidos.findOne({ titulo: "El Origen del Código" })._id,
  contenidoTitulo: "El Origen del Código",
  puntuacion: 5,
  comentario: "Una de las mejores películas de ciencia ficción del año.",
  fecha: new Date("2024-02-02")
});

/* ---- 2.5 Inserción masiva de valoraciones (insertMany) -------------------- */
db.valoraciones.insertMany([
  {
    usuarioId: db.usuarios.findOne({ email: "karenr@correo.com" })._id,
    usuarioNombre: "Karen Rodríguez",
    contenidoId: db.contenidos.findOne({ titulo: "Noches de Barranquilla" })._id,
    contenidoTitulo: "Noches de Barranquilla",
    puntuacion: 4,
    comentario: "Historia entrañable, ambientación perfecta.",
    fecha: new Date("2024-01-11")
  },
  {
    usuarioId: db.usuarios.findOne({ email: "pablos@correo.com" })._id,
    usuarioNombre: "Pablo Sánchez",
    contenidoId: db.contenidos.findOne({ titulo: "Raíces del Sur" })._id,
    contenidoTitulo: "Raíces del Sur",
    puntuacion: 5,
    comentario: "Guion sobresaliente y gran dirección de actores.",
    fecha: new Date("2024-01-07")
  },
  {
    usuarioId: db.usuarios.findOne({ email: "danielaf@correo.com" })._id,
    usuarioNombre: "Daniela Fonseca",
    contenidoId: db.contenidos.findOne({ titulo: "Risas en Cadena" })._id,
    contenidoTitulo: "Risas en Cadena",
    puntuacion: 3,
    comentario: "Divertida pero un poco repetitiva en la temporada 4.",
    fecha: new Date("2024-02-21")
  },
  {
    usuarioId: db.usuarios.findOne({ email: "juanp@correo.com" })._id,
    usuarioNombre: "Juan Pérez",
    contenidoId: db.contenidos.findOne({ titulo: "Código Rojo" })._id,
    contenidoTitulo: "Código Rojo",
    puntuacion: 4,
    comentario: "Buena acción, aunque el final quedó abierto.",
    fecha: new Date("2024-03-11")
  },
  {
    usuarioId: db.usuarios.findOne({ email: "pablos@correo.com" })._id,
    usuarioNombre: "Pablo Sánchez",
    contenidoId: db.contenidos.findOne({ titulo: "Frontera Digital" })._id,
    contenidoTitulo: "Frontera Digital",
    puntuacion: 3,
    comentario: "Interesante premisa pero ritmo irregular.",
    fecha: new Date("2024-04-23")
  },
  {
    usuarioId: db.usuarios.findOne({ email: "marial@correo.com" })._id,
    usuarioNombre: "María López",
    contenidoId: db.contenidos.findOne({ titulo: "El Origen del Código" })._id,
    contenidoTitulo: "El Origen del Código",
    puntuacion: 4,
    comentario: "Muy entretenida, aunque algo predecible.",
    fecha: new Date("2023-06-02")
  }
]);

/* ---- 2.6 Inserción de listas personalizadas (insertMany) ------------------ */
db.listas.insertMany([
  {
    usuarioId: db.usuarios.findOne({ email: "juanp@correo.com" })._id,
    nombreLista: "Favoritos",
    contenidos: [
      db.contenidos.findOne({ titulo: "El Origen del Código" })._id,
      db.contenidos.findOne({ titulo: "Raíces del Sur" })._id
    ],
    fechaCreacion: new Date("2024-01-01")
  },
  {
    usuarioId: db.usuarios.findOne({ email: "karenr@correo.com" })._id,
    nombreLista: "Ver más tarde",
    contenidos: [
      db.contenidos.findOne({ titulo: "Frontera Digital" })._id,
      db.contenidos.findOne({ titulo: "Código Rojo" })._id
    ],
    fechaCreacion: new Date("2024-02-15")
  },
  {
    usuarioId: db.usuarios.findOne({ email: "pablos@correo.com" })._id,
    nombreLista: "Favoritos",
    contenidos: [
      db.contenidos.findOne({ titulo: "Raíces del Sur" })._id,
      db.contenidos.findOne({ titulo: "Ecos del Pasado" })._id,
      db.contenidos.findOne({ titulo: "Al Filo del Abismo" })._id
    ],
    fechaCreacion: new Date("2023-12-20")
  }
]);


/* ============================================================================
   TASK 3 — CONSULTAS (LECTURA) CON OPERADORES
   ============================================================================ */

/* ---- 3.1 $gt: Películas con duración > 120 minutos ------------------------ */
db.contenidos.find({
  tipo: "pelicula",
  duracionMinutos: { $gt: 120 }
});

/* ---- 3.2 $lt: Contenidos estrenados antes del año 2019 -------------------- */
db.contenidos.find({
  anio: { $lt: 2019 }
});

/* ---- 3.3 $eq: Contenidos cuyo país de origen es exactamente "Colombia" ---- */
db.contenidos.find({
  pais: { $eq: "Colombia" }
});

/* ---- 3.4 $in: Contenidos cuyo género incluye Acción o Comedia ------------- */
db.contenidos.find({
  genero: { $in: ["Acción", "Comedia"] }
});

/* ---- 3.5 $and: Series con más de 2 temporadas Y calificación >= 4 -------- */
db.contenidos.find({
  $and: [
    { tipo: "serie" },
    { temporadas: { $gt: 2 } },
    { calificacionPromedio: { $gte: 4 } }
  ]
});

/* ---- 3.6 $or: Contenidos de Colombia o de México --------------------------*/
db.contenidos.find({
  $or: [
    { pais: "Colombia" },
    { pais: "México" }
  ]
});

/* ---- 3.7 $regex: Contenidos cuyo título contiene la palabra "Código" ------ */
db.contenidos.find({
  titulo: { $regex: "Código", $options: "i" }
});

/* ---- 3.8 $regex: Usuarios cuyo email termina en "@correo.com" ------------- */
db.usuarios.find({
  email: { $regex: "@correo\\.com$" }
});

/* ---- 3.9 Usuarios que vieron más de 5 contenidos (uso de $expr + $size) --- */
db.usuarios.find({
  $expr: { $gt: [{ $size: "$historial" }, 5] }
});

/* ---- 3.10 Combinación $and + $or: Películas de acción con calificación
             mayor a 4 O producidas en España ------------------------------- */
db.contenidos.find({
  $and: [
    { tipo: "pelicula" },
    {
      $or: [
        { $and: [{ genero: "Acción" }, { calificacionPromedio: { $gt: 4 } }] },
        { pais: "España" }
      ]
    }
  ]
});


/* ============================================================================
   TASK 4 — ACTUALIZACIONES Y ELIMINACIONES
   ============================================================================ */

/* ---- 4.1 updateOne: Actualizar la calificación promedio de un contenido --- */
db.contenidos.updateOne(
  { titulo: "Frontera Digital" },
  { $set: { calificacionPromedio: 4.2 } }
);

/* ---- 4.2 updateOne: Agregar una nueva reseña embebida a un contenido ------ */
db.contenidos.updateOne(
  { titulo: "Ecos del Pasado" },
  { $push: { reseñas: { usuario: "rodrigoa", comentario: "Muy conmovedora.", puntuacion: 4 } } }
);

/* ---- 4.3 updateMany: Marcar como "premium" a todos los usuarios de
            Colombia con plan "estandar" (ejemplo de campaña de fidelización) */
db.usuarios.updateMany(
  { pais: "Colombia", plan: "estandar" },
  { $set: { plan: "premium" } }
);

/* ---- 4.4 updateMany: Incrementar en 1 la puntuación de valoraciones
            con comentarios de menos de 20 caracteres (ajuste de sesgo) ----- */
db.valoraciones.updateMany(
  { $expr: { $lt: [{ $strLenCP: "$comentario" }, 20] } },
  { $inc: { puntuacion: 1 } }
);

/* ---- 4.5 deleteOne: Eliminar una valoración específica -------------------- */
db.valoraciones.deleteOne({
  usuarioNombre: "Daniela Fonseca",
  contenidoTitulo: "Risas en Cadena"
});

/* ---- 4.6 deleteMany: Eliminar contenidos sin ninguna reseña --------------- */
db.contenidos.deleteMany({
  reseñas: { $size: 0 }
});

/* Nota: 4.6 eliminará "Frontera Digital" (reseñas: []) y cualquier otro
   contenido sin reseñas embebidas al momento de correr el script (antes
   de 4.2, "Ecos del Pasado" también tenía reseñas: [], pero ya se le
   agregó una reseña en el paso 4.2, por lo que sobrevive). Ejecutar el
   script en el orden dado para reproducir el mismo resultado. */


/* ============================================================================
   TASK 5 — ÍNDICES PARA PERFORMANCE
   ============================================================================ */

/* ---- 5.1 Índice simple sobre "titulo" en contenidos -----------------------
   Justificación: el título es el campo más consultado por los usuarios al
   buscar contenido (búsquedas por nombre y $regex), por lo que un índice
   acelera drásticamente estas consultas frente a un COLLSCAN. */
db.contenidos.createIndex({ titulo: 1 });

/* ---- 5.2 Índice sobre "genero" (arreglo) -----------------------------------
   Justificación: las consultas por género ($in) son muy frecuentes en
   plataformas de streaming (filtros de catálogo); al ser un arreglo,
   MongoDB crea automáticamente un índice multikey. */
db.contenidos.createIndex({ genero: 1 });

/* ---- 5.3 Índice compuesto sobre "tipo" y "anio" ----------------------------
   Justificación: muchas consultas combinan tipo de contenido (película/serie)
   con rango de año (recientes vs. clásicos); un índice compuesto evita
   escanear toda la colección para esos filtros combinados. */
db.contenidos.createIndex({ tipo: 1, anio: -1 });

/* ---- 5.4 Índice único sobre "email" en usuarios ----------------------------
   Justificación: el email identifica de forma única a cada usuario y se usa
   en el login; un índice único garantiza integridad y acelera la búsqueda. */
db.usuarios.createIndex({ email: 1 }, { unique: true });

/* ---- 5.5 Índice sobre "contenidoId" en valoraciones ------------------------
   Justificación: las agregaciones de calificación promedio por contenido
   (Task 6) filtran/agrupan constantemente por este campo. */
db.valoraciones.createIndex({ contenidoId: 1 });

/* ---- 5.6 Índice de texto sobre "sinopsis" para búsquedas de texto libre --- */
db.contenidos.createIndex({ sinopsis: "text" });

/* ---- 5.7 Verificación de índices existentes -------------------------------- */
db.contenidos.getIndexes();
db.usuarios.getIndexes();
db.valoraciones.getIndexes();
db.listas.getIndexes();


/* ============================================================================
   TASK EXTRA — PIPELINES DE AGREGACIÓN (eran mínimo 2, pero decidí entregar 4)
   ============================================================================ */

/* ---- 6.1 Pipeline 1: Calificación promedio y número de valoraciones
            por contenido, ordenado de mayor a menor calificación ---------- */
db.valoraciones.aggregate([
  {
    $group: {
      _id: "$contenidoTitulo",
      calificacionPromedio: { $avg: "$puntuacion" },
      totalValoraciones: { $sum: 1 }
    }
  },
  { $sort: { calificacionPromedio: -1 } },
  {
    $project: {
      _id: 0,
      contenido: "$_id",
      calificacionPromedio: { $round: ["$calificacionPromedio", 2] },
      totalValoraciones: 1
    }
  }
]);

/* ---- 6.2 Pipeline 2: Cantidad de contenidos por género
            (usa $unwind porque "genero" es un arreglo) --------------------- */
db.contenidos.aggregate([
  { $unwind: "$genero" },
  {
    $group: {
      _id: "$genero",
      totalContenidos: { $sum: 1 },
      calificacionPromedioGenero: { $avg: "$calificacionPromedio" }
    }
  },
  { $sort: { totalContenidos: -1 } },
  {
    $project: {
      _id: 0,
      genero: "$_id",
      totalContenidos: 1,
      calificacionPromedioGenero: { $round: ["$calificacionPromedioGenero", 2] }
    }
  }
]);

/* ---- 6.3 Pipeline 3: Usuarios con su cantidad de contenidos vistos,
            filtrando solo usuarios activos con más de 1 contenido visto --- */
db.usuarios.aggregate([
  { $match: { activo: true } },
  { $unwind: "$historial" },
  {
    $group: {
      _id: { usuario: "$nombre", pais: "$pais" },
      contenidosVistos: { $sum: 1 },
      progresoPromedio: { $avg: "$historial.progreso" }
    }
  },
  { $match: { contenidosVistos: { $gt: 1 } } },
  { $sort: { contenidosVistos: -1 } },
  {
    $project: {
      _id: 0,
      usuario: "$_id.usuario",
      pais: "$_id.pais",
      contenidosVistos: 1,
      progresoPromedio: { $round: ["$progresoPromedio", 1] }
    }
  }
]);

/* ---- 6.4 Pipeline 4: Top 3 países con más contenido producido y su
            duración promedio (solo películas) ------------------------------ */
db.contenidos.aggregate([
  { $match: { tipo: "pelicula" } },
  {
    $group: {
      _id: "$pais",
      totalPeliculas: { $sum: 1 },
      duracionPromedio: { $avg: "$duracionMinutos" }
    }
  },
  { $sort: { totalPeliculas: -1 } },
  { $limit: 3 },
  {
    $project: {
      _id: 0,
      pais: "$_id",
      totalPeliculas: 1,
      duracionPromedioMin: { $round: ["$duracionPromedio", 0] }
    }
  }
]);

/* ============================================================================
   FINNNNNN DEL SCRIPT, GRACIAS POR VER :D ATT: Oscar Corzooo
   ============================================================================ */

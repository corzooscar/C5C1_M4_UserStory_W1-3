# Gestión de Contenido y Usuarios en MongoDB — Proyecto StreamHub

## Contenido de la entrega
- `streamhub_mongodb.js` — Script completo con todos los comandos MongoDB solicitados (Tasks 1 a 5 + agregaciones), listo para ejecutar en `mongosh` o Compass.

## Resumen de la solución

### Task 1 — Diseño de colecciones
Se definieron 4 colecciones para el dominio **StreamHub** (plataforma de streaming):

| Colección | Propósito | Relación |
|---|---|---|
| `usuarios` | Cuentas, plan y **historial embebido** de visualización | 1 documento por usuario |
| `contenidos` | Películas y series unificadas (`tipo`), con **reseñas embebidas** rápidas | 1 documento por título |
| `valoraciones` | Calificaciones y comentarios, **referenciando** `usuarioId` y `contenidoId` | colección independiente (crece rápido, se agrega con frecuencia) |
| `listas` | Listas personalizadas (Favoritos, Ver más tarde) con **arreglo de referencias** a contenidos | 1 documento por lista |

**Decisión de modelado:** se combinó *embedding* (historial dentro de usuario, reseñas rápidas dentro de contenido) con *referencing* (valoraciones y listas), siguiendo el criterio de que datos que crecen sin límite o se consultan/agregan de forma independiente (valoraciones) se separan en su propia colección, mientras que datos pequeños y de acceso conjunto (historial, reseñas resumidas) se embeben.

### Task 2 — Inserción de datos
- 8 contenidos insertados con `insertMany()` (mezcla de películas y series, con y sin reseñas).
- 5 usuarios insertados con `insertMany()`, incluyendo historiales de distinto tamaño (uno con 6 elementos para cubrir el caso "> 5 contenidos vistos").
- 1 valoración con `insertOne()` y 6 más con `insertMany()`.
- 3 listas personalizadas con `insertMany()`.

### Task 3 — Consultas con operadores
Se incluyen 10 consultas `find()` cubriendo: `$gt`, `$lt`, `$eq`, `$in`, `$and`, `$or`, `$regex`, además de `$expr` combinado con `$size` para contar elementos de un arreglo (usuarios con más de 5 contenidos vistos).

### Task 4 — Actualizaciones y eliminaciones
- 2 `updateOne()` (cambiar calificación, agregar reseña con `$push`).
- 2 `updateMany()` (cambio de plan masivo, ajuste de puntuación con `$inc` + `$expr`).
- 1 `deleteOne()` y 1 `deleteMany()`.

### Task 5 — Índices
Se crearon 6 índices, cada uno justificado según el patrón de consulta que optimiza (ver comentarios en el script):
1. `contenidos.titulo` — búsquedas por nombre.
2. `contenidos.genero` — filtros de catálogo (`$in`), índice *multikey* por ser arreglo.
3. `contenidos.{tipo, anio}` — consultas combinadas tipo + rango de año (índice compuesto).
4. `usuarios.email` (único) — login y unicidad de cuenta.
5. `valoraciones.contenidoId` — soporta las agregaciones de calificación promedio.
6. `contenidos.sinopsis` (texto) — búsqueda de texto libre.

Se verifican con `getIndexes()` sobre las 4 colecciones.

### Agregaciones (4 pipelines entregados, mínimo requerido: 2)
1. Calificación promedio y total de valoraciones por contenido (`$group`, `$sort`, `$project`).
2. Cantidad de contenidos y calificación promedio por género (`$unwind`, `$group`, `$sort`, `$project`).
3. Contenidos vistos y progreso promedio por usuario activo (`$match`, `$unwind`, `$group`, `$match`, `$sort`, `$project`).
4. Top 3 países con más películas producidas y su duración promedio (`$match`, `$group`, `$sort`, `$limit`, `$project`).

## Cómo ejecutar
```bash
mongosh "mongodb://localhost:27017" --file streamhub_mongodb.js
```
o desde Compass, en la pestaña "mongosh" integrada, pegar el contenido del archivo por secciones (Task 1 → Task 5).

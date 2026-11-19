-- SUMARIS 0.4: nodos de conocimiento de los cursos nuevos (Divisiones, Los Números, Figuras Geométricas, Fracciones y Problemas)
-- Ejecutar UNA vez sobre la base de datos "sumaris" que ya tengas creada (sin borrar tus usuarios ni tu progreso).
-- Cada lección del sistema registra sus intentos en un nodo: 10-12 divisiones, 13-15 números, 16-18 figuras, 19-21 fracciones, 22-24 problemas.
-- Es seguro ejecutarlo de nuevo: INSERT IGNORE no duplica los nodos que ya existan.
USE sumaris;

INSERT IGNORE INTO `nodo_conocimiento` (`id_nodo`, `titulo_nodo`, `descripcion`, `nivel_requisito`) VALUES
  (10, 'Divisiones Básicas', 'Repartir en partes iguales', 1),
  (11, 'Divisiones Intermedias', 'El signo de dividir', 1),
  (12, 'Divisiones Avanzadas', 'Dividir con las tablas', 1),
  (13, 'Números Básicos', 'Contar del 1 al 20', 1),
  (14, 'Números Intermedios', 'Mayor, menor e igual', 1),
  (15, 'Números Avanzados', 'Pares e impares', 1),
  (16, 'Figuras Básicas', 'Círculos, cuadrados y triángulos', 1),
  (17, 'Figuras Intermedias', 'Lados y esquinas', 1),
  (18, 'Figuras Avanzadas', 'Cuerpos geométricos', 1),
  (19, 'Fracciones Básicas', 'Partes de un entero', 1),
  (20, 'Fracciones Intermedias', 'Numerador y denominador', 1),
  (21, 'Fracciones Avanzadas', 'Comparar fracciones', 1),
  (22, 'Problemas Básicos', 'Sumar y restar con historias', 1),
  (23, 'Problemas Intermedios', 'Multiplicar y dividir con historias', 1),
  (24, 'Problemas Avanzados', 'Problemas de dos pasos', 1);

SELECT id_nodo, titulo_nodo FROM nodo_conocimiento ORDER BY id_nodo;

-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: sumaris
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `evaluacion_sesion`
--

DROP TABLE IF EXISTS `evaluacion_sesion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluacion_sesion` (
  `id_evaluacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_nodo` int NOT NULL,
  `origen` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'leccion',
  `aciertos` int unsigned NOT NULL DEFAULT '0',
  `errores` int unsigned NOT NULL DEFAULT '0',
  `tiempo_invertido_segundos` int unsigned NOT NULL DEFAULT '0',
  `pistas_usadas` int unsigned NOT NULL DEFAULT '0',
  `completada` tinyint(1) NOT NULL DEFAULT '1',
  `puntaje` decimal(5,2) NOT NULL,
  `dominio_resultante` decimal(5,2) NOT NULL,
  `indicador` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `accion_sugerida` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_evaluacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_evaluacion`),
  KEY `idx_eval_usuario_nodo` (`id_usuario`,`id_nodo`,`fecha_evaluacion`),
  KEY `fk_eval_nodo` (`id_nodo`),
  CONSTRAINT `fk_eval_nodo` FOREIGN KEY (`id_nodo`) REFERENCES `nodo_conocimiento` (`id_nodo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_eval_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluacion_sesion`
--

LOCK TABLES `evaluacion_sesion` WRITE;
/*!40000 ALTER TABLE `evaluacion_sesion` DISABLE KEYS */;
INSERT INTO `evaluacion_sesion` VALUES (1,12,1,'leccion',6,0,52,2,1,95.00,95.00,'Dominado','avanzar','2026-11-19 16:37:25'),(2,13,1,'leccion',6,2,45,1,1,73.59,73.59,'Dominado','avanzar','2026-11-20 02:00:49'),(3,13,1,'leccion',6,0,69,0,1,100.00,90.10,'Dominado','avanzar','2026-11-20 14:48:53'),(4,15,1,'leccion',6,0,115,1,1,97.50,97.50,'Dominado','avanzar','2026-11-20 15:49:44');
/*!40000 ALTER TABLE `evaluacion_sesion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_recompensas`
--

DROP TABLE IF EXISTS `historial_recompensas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_recompensas` (
  `id_recompensa` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `nombre_recompensa` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_logro` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_obtencion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_recompensa`),
  KEY `fk_recompensa_usuario` (`id_usuario`),
  CONSTRAINT `fk_recompensa_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_recompensas`
--

LOCK TABLES `historial_recompensas` WRITE;
/*!40000 ALTER TABLE `historial_recompensas` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_recompensas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `intento_ejercicio`
--

DROP TABLE IF EXISTS `intento_ejercicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `intento_ejercicio` (
  `id_intento` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_nodo` int NOT NULL,
  `es_correcto` tinyint(1) NOT NULL DEFAULT '1',
  `cantidad_errores` int unsigned DEFAULT '0',
  `tiempo_invertido_segundos` int unsigned DEFAULT '0',
  `tiempo_respuesta` int unsigned DEFAULT '0',
  `pistas_solicitadas` int unsigned DEFAULT '0',
  `intentos_totales` int unsigned DEFAULT '1',
  `necesita_esfuerzo` tinyint(1) DEFAULT '0',
  `fecha_intento` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_intento`),
  KEY `fk_intento_usuario` (`id_usuario`),
  KEY `fk_intento_nodo` (`id_nodo`),
  CONSTRAINT `fk_intento_nodo` FOREIGN KEY (`id_nodo`) REFERENCES `nodo_conocimiento` (`id_nodo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_intento_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intento_ejercicio`
--

LOCK TABLES `intento_ejercicio` WRITE;
/*!40000 ALTER TABLE `intento_ejercicio` DISABLE KEYS */;
INSERT INTO `intento_ejercicio` VALUES (1,4,1,0,0,0,5,0,1,0,'2026-10-28 20:19:53'),(2,4,1,0,0,0,5,0,1,0,'2026-10-28 20:19:53'),(3,4,1,1,0,0,5,0,1,0,'2026-10-28 21:09:21'),(4,4,1,0,0,0,5,0,1,0,'2026-10-28 21:09:30'),(5,4,1,0,0,0,5,0,1,0,'2026-10-28 21:09:41'),(6,4,1,1,0,0,5,0,1,0,'2026-10-28 21:09:49'),(7,4,1,1,0,0,5,0,1,0,'2026-10-28 21:09:59'),(11,4,1,1,0,0,5,0,1,0,'2026-10-28 22:53:15'),(12,4,1,1,0,0,5,0,1,0,'2026-10-28 23:47:58'),(13,4,1,1,0,0,5,0,1,0,'2026-10-28 23:48:07'),(14,4,1,1,0,0,5,0,1,0,'2026-10-28 23:48:29'),(15,4,2,1,0,0,5,0,1,0,'2026-10-28 23:48:38'),(16,4,2,1,0,0,5,0,1,0,'2026-10-28 23:48:42'),(17,4,2,1,0,0,5,0,1,0,'2026-10-28 23:49:32'),(18,4,3,1,0,0,5,0,1,0,'2026-10-28 23:49:45'),(19,4,3,1,0,0,5,0,1,0,'2026-10-28 23:50:02'),(20,4,3,1,0,0,5,0,1,0,'2026-10-28 23:50:09'),(21,4,1,1,0,0,5,0,1,0,'2026-10-28 23:50:18'),(22,4,1,1,0,0,5,0,1,0,'2026-10-28 23:50:22'),(23,4,1,1,0,0,5,0,1,0,'2026-10-28 23:50:37'),(24,4,2,1,0,0,5,0,1,0,'2026-10-28 23:50:55'),(25,4,2,1,0,0,5,0,1,0,'2026-10-28 23:51:00'),(26,4,2,1,0,0,5,0,1,0,'2026-10-28 23:51:08'),(27,4,1,1,0,0,5,0,1,0,'2026-10-28 23:52:00'),(28,4,1,1,0,0,5,0,1,0,'2026-10-28 23:52:13'),(29,4,1,1,0,0,5,0,1,0,'2026-10-28 23:52:32'),(30,4,2,1,0,0,5,0,1,0,'2026-10-28 23:52:47'),(31,4,2,1,0,0,5,0,1,0,'2026-10-28 23:52:53'),(32,4,2,1,0,0,5,0,1,0,'2026-10-28 23:53:00'),(33,4,3,1,0,0,5,0,1,0,'2026-10-28 23:54:10'),(34,4,3,1,0,0,5,0,1,0,'2026-10-28 23:54:43'),(35,4,3,1,0,0,5,0,1,0,'2026-10-28 23:55:12'),(36,4,1,1,0,0,5,0,1,0,'2026-10-28 23:55:56'),(37,4,1,1,0,0,5,0,1,0,'2026-10-28 23:56:15'),(38,4,1,1,0,0,5,0,1,0,'2026-10-28 23:57:39'),(39,4,2,1,0,0,5,0,1,0,'2026-10-28 23:57:57'),(40,4,2,1,0,0,5,0,1,0,'2026-10-28 23:58:12'),(41,4,2,1,0,0,5,0,1,0,'2026-10-28 23:58:25'),(42,4,3,1,0,0,5,0,1,0,'2026-10-28 23:58:44'),(43,4,3,1,0,0,5,0,1,0,'2026-10-28 23:58:59'),(44,4,3,1,0,0,5,0,1,0,'2026-10-28 23:59:04'),(45,4,1,1,0,0,5,0,1,0,'2026-10-29 00:01:55'),(46,4,1,1,0,0,5,0,1,0,'2026-10-29 00:01:59'),(47,4,1,1,0,0,5,0,1,0,'2026-10-29 00:02:09'),(48,4,2,1,0,0,5,0,1,0,'2026-10-29 00:02:16'),(49,4,2,1,0,0,5,0,1,0,'2026-10-29 00:02:21'),(50,4,2,1,0,0,5,0,1,0,'2026-10-29 00:02:41'),(51,4,3,1,0,0,5,0,1,0,'2026-10-29 00:02:51'),(52,4,3,1,0,0,5,0,1,0,'2026-10-29 00:02:57'),(53,4,3,1,0,0,5,0,1,0,'2026-10-29 00:03:01'),(55,10,1,1,0,0,5,0,1,0,'2026-10-30 20:19:24'),(56,10,1,1,0,0,5,0,1,0,'2026-10-30 20:23:42'),(57,10,1,1,0,0,5,0,1,0,'2026-10-30 20:23:48'),(58,10,1,0,0,0,5,0,1,0,'2026-11-02 05:44:49'),(59,10,1,0,0,0,5,0,1,0,'2026-11-02 05:45:35'),(60,10,1,0,0,0,5,0,1,0,'2026-11-02 05:49:21'),(61,10,1,0,0,0,5,0,1,0,'2026-11-02 05:53:02'),(62,10,1,0,0,0,5,0,1,0,'2026-11-02 05:53:06'),(63,10,1,0,0,0,5,0,1,0,'2026-11-02 05:59:20'),(64,10,1,0,0,0,5,0,1,0,'2026-11-02 05:59:28'),(65,10,1,0,0,0,5,0,1,0,'2026-11-02 05:59:40'),(66,10,1,0,0,0,5,0,1,0,'2026-11-02 06:00:39'),(67,10,1,0,0,0,5,0,1,0,'2026-11-02 06:11:15'),(68,10,1,0,0,0,5,0,1,0,'2026-11-02 06:11:20'),(69,10,1,0,0,0,5,0,1,0,'2026-11-02 06:12:33'),(70,10,1,1,0,0,5,0,1,0,'2026-11-02 06:12:38'),(71,10,1,1,0,0,5,0,1,0,'2026-11-02 06:21:24'),(72,10,1,0,0,0,5,0,1,0,'2026-11-02 06:22:41'),(73,10,1,1,0,0,5,0,1,0,'2026-11-02 06:23:37'),(74,10,1,1,0,0,5,0,1,0,'2026-11-02 06:23:43'),(75,10,1,1,0,0,5,0,1,0,'2026-11-02 06:29:00'),(76,10,1,1,0,0,5,0,1,0,'2026-11-02 06:29:07'),(77,10,1,1,0,0,5,0,1,0,'2026-11-02 09:29:38'),(78,10,1,1,0,0,5,0,1,0,'2026-11-02 09:29:44'),(79,11,1,1,0,0,25,1,1,0,'2026-11-07 19:12:33'),(80,11,1,1,0,0,18,0,1,0,'2026-11-07 19:12:53'),(81,11,1,0,0,0,10,0,1,0,'2026-11-07 19:13:04'),(82,11,1,1,0,0,26,0,1,0,'2026-11-07 19:13:33'),(83,11,1,1,0,0,5,0,1,0,'2026-11-07 19:13:39'),(84,11,1,1,0,0,36,0,1,0,'2026-11-07 19:14:16'),(85,11,1,1,0,0,3,0,1,0,'2026-11-07 19:14:21'),(86,12,1,1,0,0,9,1,1,0,'2026-11-19 16:36:39'),(87,12,1,1,0,0,9,1,1,0,'2026-11-19 16:36:49'),(88,12,1,1,0,0,3,0,1,0,'2026-11-19 16:36:52'),(89,12,1,1,0,0,12,0,1,0,'2026-11-19 16:37:05'),(90,12,1,1,0,0,7,0,1,0,'2026-11-19 16:37:12'),(91,12,1,1,0,0,12,0,1,0,'2026-11-19 16:37:24'),(92,13,1,1,0,0,4,0,1,0,'2026-11-20 02:00:02'),(93,13,1,0,0,0,5,0,1,0,'2026-11-20 02:00:08'),(94,13,1,1,0,0,3,0,1,0,'2026-11-20 02:00:12'),(95,13,1,1,0,0,7,0,1,0,'2026-11-20 02:00:20'),(96,13,1,1,0,0,7,0,1,0,'2026-11-20 02:00:28'),(97,13,1,1,0,0,9,0,1,0,'2026-11-20 02:00:37'),(98,13,1,0,0,0,5,0,1,0,'2026-11-20 02:00:42'),(99,13,1,1,0,0,5,1,1,0,'2026-11-20 02:00:48'),(100,14,1,1,0,0,14,0,1,0,'2026-11-20 05:08:19'),(101,14,1,1,0,0,5,0,1,0,'2026-11-20 05:08:26'),(102,14,1,1,0,0,4,0,1,0,'2026-11-20 05:08:31'),(103,14,1,1,0,0,18,0,1,0,'2026-11-20 05:08:50'),(104,13,1,1,0,0,10,0,1,0,'2026-11-20 05:13:02'),(105,13,1,1,0,0,3,0,1,0,'2026-11-20 05:13:06'),(106,13,1,1,0,0,3,0,1,0,'2026-11-20 05:13:09'),(107,13,1,1,0,0,17,0,1,0,'2026-11-20 05:13:27'),(108,13,2,1,0,0,66,1,1,0,'2026-11-20 14:46:47'),(109,13,1,1,0,0,4,0,1,0,'2026-11-20 14:47:34'),(110,13,1,1,0,0,4,0,1,0,'2026-11-20 14:47:39'),(111,13,1,1,0,0,4,0,1,0,'2026-11-20 14:47:44'),(112,13,1,1,0,0,16,0,1,0,'2026-11-20 14:48:01'),(113,13,1,1,0,0,28,0,1,0,'2026-11-20 14:48:30'),(114,13,1,1,0,0,13,0,1,0,'2026-11-20 14:48:45'),(115,13,13,0,0,0,17,0,1,0,'2026-11-20 14:50:13'),(116,13,13,1,0,0,19,0,1,0,'2026-11-20 14:50:34'),(117,13,13,1,0,0,5,0,1,0,'2026-11-20 14:50:40'),(118,15,1,1,0,0,12,0,1,0,'2026-11-20 15:47:35'),(119,15,1,1,0,0,26,0,1,0,'2026-11-20 15:48:18'),(120,15,1,1,0,0,14,1,1,0,'2026-11-20 15:48:33'),(121,15,1,1,0,0,22,0,1,0,'2026-11-20 15:48:56'),(122,15,1,1,0,0,30,0,1,0,'2026-11-20 15:49:30'),(123,15,1,1,0,0,11,0,1,0,'2026-11-20 15:49:43');
/*!40000 ALTER TABLE `intento_ejercicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nodo_conocimiento`
--

DROP TABLE IF EXISTS `nodo_conocimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nodo_conocimiento` (
  `id_nodo` int NOT NULL AUTO_INCREMENT,
  `titulo_nodo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `nivel_requisito` int unsigned DEFAULT '1',
  PRIMARY KEY (`id_nodo`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nodo_conocimiento`
--

LOCK TABLES `nodo_conocimiento` WRITE;
/*!40000 ALTER TABLE `nodo_conocimiento` DISABLE KEYS */;
INSERT INTO `nodo_conocimiento` VALUES (1,'Sumas Básicas','Cimientos principales de las matemáticas',1),(2,'Sumas Intermedias','Agrupación y adición de objetos',1),(3,'Sumas Avanzadas','Decenas y unidades',1),(4,'Restas Básicas','Introducción a la sustracción',1),(5,'Restas Intermedias','Quitar elementos y diferencias',1),(6,'Restas Avanzadas','Sustracciones de mayor valor',1),(7,'Multiplicaciones Básicas','Grupos iguales y matrices',1),(8,'Multiplicaciones Intermedias','Suma repetida',1),(9,'Multiplicaciones Avanzadas','Tablas y factores',1),(10,'Divisiones Básicas','Repartir en partes iguales',1),(11,'Divisiones Intermedias','El signo de dividir',1),(12,'Divisiones Avanzadas','Dividir con las tablas',1),(13,'Números Básicos','Contar del 1 al 20',1),(14,'Números Intermedios','Mayor, menor e igual',1),(15,'Números Avanzados','Pares e impares',1),(16,'Figuras Básicas','Círculos, cuadrados y triángulos',1),(17,'Figuras Intermedias','Lados y esquinas',1),(18,'Figuras Avanzadas','Cuerpos geométricos',1),(19,'Fracciones Básicas','Partes de un entero',1),(20,'Fracciones Intermedias','Numerador y denominador',1),(21,'Fracciones Avanzadas','Comparar fracciones',1),(22,'Problemas Básicos','Sumar y restar con historias',1),(23,'Problemas Intermedios','Multiplicar y dividir con historias',1),(24,'Problemas Avanzados','Problemas de dos pasos',1);
/*!40000 ALTER TABLE `nodo_conocimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prerrequisito_nodo`
--

DROP TABLE IF EXISTS `prerrequisito_nodo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prerrequisito_nodo` (
  `id_nodo` int NOT NULL,
  `id_nodo_requerido` int NOT NULL,
  `dominio_minimo` decimal(5,2) NOT NULL DEFAULT '70.00',
  PRIMARY KEY (`id_nodo`,`id_nodo_requerido`),
  KEY `fk_prereq_requerido` (`id_nodo_requerido`),
  CONSTRAINT `fk_prereq_nodo` FOREIGN KEY (`id_nodo`) REFERENCES `nodo_conocimiento` (`id_nodo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_prereq_requerido` FOREIGN KEY (`id_nodo_requerido`) REFERENCES `nodo_conocimiento` (`id_nodo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prerrequisito_nodo`
--

LOCK TABLES `prerrequisito_nodo` WRITE;
/*!40000 ALTER TABLE `prerrequisito_nodo` DISABLE KEYS */;
INSERT INTO `prerrequisito_nodo` VALUES (2,1,70.00),(3,2,70.00),(4,1,70.00),(5,4,70.00),(6,5,70.00),(7,2,70.00),(8,7,70.00),(9,8,70.00),(10,6,70.00),(10,9,70.00),(11,10,70.00),(12,11,70.00),(14,13,70.00),(15,14,70.00),(17,16,70.00),(18,17,70.00),(19,12,70.00),(20,19,70.00),(21,20,70.00),(22,3,70.00),(22,6,70.00),(23,9,70.00),(23,12,70.00),(24,21,70.00),(24,23,70.00);
/*!40000 ALTER TABLE `prerrequisito_nodo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progreso_lecciones`
--

DROP TABLE IF EXISTS `progreso_lecciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progreso_lecciones` (
  `id_progreso_leccion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `curso` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `leccion_indice` int unsigned NOT NULL,
  `completada` tinyint(1) DEFAULT '1',
  `fecha_completado` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_progreso_leccion`),
  KEY `fk_prog_leccion_usuario` (`id_usuario`),
  CONSTRAINT `fk_prog_leccion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progreso_lecciones`
--

LOCK TABLES `progreso_lecciones` WRITE;
/*!40000 ALTER TABLE `progreso_lecciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `progreso_lecciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progreso_usuario`
--

DROP TABLE IF EXISTS `progreso_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progreso_usuario` (
  `id_usuario` int NOT NULL,
  `id_nodo` int NOT NULL,
  `porcentaje_dominio` decimal(5,2) DEFAULT '0.00',
  `estado_nodo` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Bloqueado',
  `ultima_interaccion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`,`id_nodo`),
  KEY `fk_progreso_nodo` (`id_nodo`),
  CONSTRAINT `fk_progreso_nodo` FOREIGN KEY (`id_nodo`) REFERENCES `nodo_conocimiento` (`id_nodo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_progreso_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progreso_usuario`
--

LOCK TABLES `progreso_usuario` WRITE;
/*!40000 ALTER TABLE `progreso_usuario` DISABLE KEYS */;
INSERT INTO `progreso_usuario` VALUES (2,1,0.00,'Desbloqueado','2026-10-16 04:02:01'),(2,2,0.00,'Bloqueado','2026-11-19 14:14:44'),(2,3,0.00,'Bloqueado','2026-11-19 14:14:44'),(2,4,0.00,'Bloqueado','2026-11-19 14:14:44'),(2,5,0.00,'Bloqueado','2026-11-19 14:14:44'),(2,6,0.00,'Bloqueado','2026-11-19 14:14:44'),(2,7,0.00,'Bloqueado','2026-11-19 14:14:44'),(2,8,0.00,'Bloqueado','2026-11-19 14:14:44'),(2,9,0.00,'Bloqueado','2026-11-19 14:14:44'),(3,1,0.00,'Desbloqueado','2026-10-16 04:03:24'),(3,2,0.00,'Bloqueado','2026-11-19 14:14:44'),(3,3,0.00,'Bloqueado','2026-11-19 14:14:44'),(3,4,0.00,'Bloqueado','2026-11-19 14:14:44'),(3,5,0.00,'Bloqueado','2026-11-19 14:14:44'),(3,6,0.00,'Bloqueado','2026-11-19 14:14:44'),(3,7,0.00,'Bloqueado','2026-11-19 14:14:44'),(3,8,0.00,'Bloqueado','2026-11-19 14:14:44'),(3,9,0.00,'Bloqueado','2026-11-19 14:14:44'),(4,1,0.00,'Desbloqueado','2026-10-26 20:25:32'),(4,2,0.00,'Bloqueado','2026-11-19 14:14:44'),(4,3,0.00,'Bloqueado','2026-11-19 14:14:44'),(4,4,0.00,'Bloqueado','2026-11-19 14:14:44'),(4,5,0.00,'Bloqueado','2026-11-19 14:14:44'),(4,6,0.00,'Bloqueado','2026-11-19 14:14:44'),(4,7,0.00,'Bloqueado','2026-11-19 14:14:44'),(4,8,0.00,'Bloqueado','2026-11-19 14:14:44'),(4,9,0.00,'Bloqueado','2026-11-19 14:14:44'),(5,1,0.00,'Desbloqueado','2026-10-27 16:46:44'),(5,2,0.00,'Bloqueado','2026-11-19 14:14:44'),(5,3,0.00,'Bloqueado','2026-11-19 14:14:44'),(5,4,0.00,'Bloqueado','2026-11-19 14:14:44'),(5,5,0.00,'Bloqueado','2026-11-19 14:14:44'),(5,6,0.00,'Bloqueado','2026-11-19 14:14:44'),(5,7,0.00,'Bloqueado','2026-11-19 14:14:44'),(5,8,0.00,'Bloqueado','2026-11-19 14:14:44'),(5,9,0.00,'Bloqueado','2026-11-19 14:14:44'),(6,1,0.00,'Desbloqueado','2026-10-27 17:12:10'),(6,2,0.00,'Bloqueado','2026-11-19 14:14:44'),(6,3,0.00,'Bloqueado','2026-11-19 14:14:44'),(6,4,0.00,'Bloqueado','2026-11-19 14:14:44'),(6,5,0.00,'Bloqueado','2026-11-19 14:14:44'),(6,6,0.00,'Bloqueado','2026-11-19 14:14:44'),(6,7,0.00,'Bloqueado','2026-11-19 14:14:44'),(6,8,0.00,'Bloqueado','2026-11-19 14:14:44'),(6,9,0.00,'Bloqueado','2026-11-19 14:14:44'),(7,1,0.00,'Desbloqueado','2026-10-28 19:12:03'),(7,2,0.00,'Bloqueado','2026-11-19 14:14:44'),(7,3,0.00,'Bloqueado','2026-11-19 14:14:44'),(7,4,0.00,'Bloqueado','2026-11-19 14:14:44'),(7,5,0.00,'Bloqueado','2026-11-19 14:14:44'),(7,6,0.00,'Bloqueado','2026-11-19 14:14:44'),(7,7,0.00,'Bloqueado','2026-11-19 14:14:44'),(7,8,0.00,'Bloqueado','2026-11-19 14:14:44'),(7,9,0.00,'Bloqueado','2026-11-19 14:14:44'),(8,1,0.00,'Desbloqueado','2026-10-28 19:55:07'),(8,2,0.00,'Bloqueado','2026-11-19 14:14:44'),(8,3,0.00,'Bloqueado','2026-11-19 14:14:44'),(8,4,0.00,'Bloqueado','2026-11-19 14:14:44'),(8,5,0.00,'Bloqueado','2026-11-19 14:14:44'),(8,6,0.00,'Bloqueado','2026-11-19 14:14:44'),(8,7,0.00,'Bloqueado','2026-11-19 14:14:44'),(8,8,0.00,'Bloqueado','2026-11-19 14:14:44'),(8,9,0.00,'Bloqueado','2026-11-19 14:14:44'),(9,1,0.00,'Desbloqueado','2026-11-05 17:17:09'),(9,2,0.00,'Bloqueado','2026-11-19 14:14:44'),(9,3,0.00,'Bloqueado','2026-11-19 14:14:44'),(9,4,0.00,'Bloqueado','2026-11-19 14:14:44'),(9,5,0.00,'Bloqueado','2026-11-19 14:14:44'),(9,6,0.00,'Bloqueado','2026-11-19 14:14:44'),(9,7,0.00,'Bloqueado','2026-11-19 14:14:44'),(9,8,0.00,'Bloqueado','2026-11-19 14:14:44'),(9,9,0.00,'Bloqueado','2026-11-19 14:14:44'),(10,1,0.00,'Desbloqueado','2026-11-05 17:17:06'),(10,2,0.00,'Bloqueado','2026-11-19 14:14:44'),(10,3,0.00,'Bloqueado','2026-11-19 14:14:44'),(10,4,0.00,'Bloqueado','2026-11-19 14:14:44'),(10,5,0.00,'Bloqueado','2026-11-19 14:14:44'),(10,6,0.00,'Bloqueado','2026-11-19 14:14:44'),(10,7,0.00,'Bloqueado','2026-11-19 14:14:44'),(10,8,0.00,'Bloqueado','2026-11-19 14:14:44'),(10,9,0.00,'Bloqueado','2026-11-19 14:14:44'),(11,1,0.00,'Desbloqueado','2026-11-07 19:09:51'),(11,2,0.00,'Bloqueado','2026-11-19 14:14:44'),(11,3,0.00,'Bloqueado','2026-11-19 14:14:44'),(11,4,0.00,'Bloqueado','2026-11-19 14:14:44'),(11,5,0.00,'Bloqueado','2026-11-19 14:14:44'),(11,6,0.00,'Bloqueado','2026-11-19 14:14:44'),(11,7,0.00,'Bloqueado','2026-11-19 14:14:44'),(11,8,0.00,'Bloqueado','2026-11-19 14:14:44'),(11,9,0.00,'Bloqueado','2026-11-19 14:14:44'),(12,1,95.00,'Dominado','2026-11-19 16:37:25'),(12,2,0.00,'Desbloqueado','2026-11-19 16:37:25'),(12,3,0.00,'Bloqueado','2026-11-19 16:35:25'),(12,4,0.00,'Desbloqueado','2026-11-19 16:37:25'),(12,5,0.00,'Bloqueado','2026-11-19 16:35:25'),(12,6,0.00,'Bloqueado','2026-11-19 16:35:25'),(12,7,0.00,'Bloqueado','2026-11-19 16:35:25'),(12,8,0.00,'Bloqueado','2026-11-19 16:35:25'),(12,9,0.00,'Bloqueado','2026-11-19 16:35:25'),(12,10,0.00,'Bloqueado','2026-11-20 01:57:27'),(12,13,0.00,'Desbloqueado','2026-11-20 01:57:27'),(12,16,0.00,'Desbloqueado','2026-11-20 01:57:27'),(13,1,90.10,'Dominado','2026-11-20 14:48:53'),(13,2,0.00,'Desbloqueado','2026-11-20 02:00:49'),(13,3,0.00,'Bloqueado','2026-11-20 01:59:03'),(13,4,0.00,'Desbloqueado','2026-11-20 02:00:49'),(13,5,0.00,'Bloqueado','2026-11-20 01:59:04'),(13,6,0.00,'Bloqueado','2026-11-20 01:59:04'),(13,7,0.00,'Bloqueado','2026-11-20 01:59:04'),(13,8,0.00,'Bloqueado','2026-11-20 01:59:04'),(13,9,0.00,'Bloqueado','2026-11-20 01:59:04'),(13,10,0.00,'Bloqueado','2026-11-20 01:59:04'),(13,11,0.00,'Bloqueado','2026-11-20 05:06:33'),(13,12,0.00,'Bloqueado','2026-11-20 05:06:33'),(13,13,0.00,'Desbloqueado','2026-11-20 01:59:04'),(13,14,0.00,'Bloqueado','2026-11-20 05:06:33'),(13,15,0.00,'Bloqueado','2026-11-20 05:06:33'),(13,16,0.00,'Desbloqueado','2026-11-20 01:59:04'),(13,17,0.00,'Bloqueado','2026-11-20 05:06:33'),(13,18,0.00,'Bloqueado','2026-11-20 05:06:33'),(13,19,0.00,'Bloqueado','2026-11-20 05:06:33'),(13,20,0.00,'Bloqueado','2026-11-20 05:06:33'),(13,21,0.00,'Bloqueado','2026-11-20 05:06:33'),(13,22,0.00,'Bloqueado','2026-11-20 05:06:33'),(13,23,0.00,'Bloqueado','2026-11-20 05:06:33'),(13,24,0.00,'Bloqueado','2026-11-20 05:06:33'),(14,1,0.00,'Desbloqueado','2026-11-20 05:07:33'),(14,2,0.00,'Bloqueado','2026-11-20 05:07:33'),(14,3,0.00,'Bloqueado','2026-11-20 05:07:33'),(14,4,0.00,'Bloqueado','2026-11-20 05:07:33'),(14,5,0.00,'Bloqueado','2026-11-20 05:07:33'),(14,6,0.00,'Bloqueado','2026-11-20 05:07:33'),(14,7,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,8,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,9,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,10,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,11,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,12,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,13,0.00,'Desbloqueado','2026-11-20 05:07:34'),(14,14,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,15,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,16,0.00,'Desbloqueado','2026-11-20 05:07:34'),(14,17,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,18,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,19,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,20,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,21,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,22,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,23,0.00,'Bloqueado','2026-11-20 05:07:34'),(14,24,0.00,'Bloqueado','2026-11-20 05:07:34'),(15,1,97.50,'Dominado','2026-11-20 15:49:44'),(15,2,0.00,'Desbloqueado','2026-11-20 15:49:44'),(15,3,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,4,0.00,'Desbloqueado','2026-11-20 15:49:44'),(15,5,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,6,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,7,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,8,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,9,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,10,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,11,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,12,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,13,0.00,'Desbloqueado','2026-11-20 15:45:45'),(15,14,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,15,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,16,0.00,'Desbloqueado','2026-11-20 15:45:45'),(15,17,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,18,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,19,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,20,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,21,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,22,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,23,0.00,'Bloqueado','2026-11-20 15:45:45'),(15,24,0.00,'Bloqueado','2026-11-20 15:45:45');
/*!40000 ALTER TABLE `progreso_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refuerzo_pendiente`
--

DROP TABLE IF EXISTS `refuerzo_pendiente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refuerzo_pendiente` (
  `id_usuario` int NOT NULL,
  `id_nodo_origen` int NOT NULL,
  `id_nodo_refuerzo` int NOT NULL,
  `motivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resuelto` tinyint(1) NOT NULL DEFAULT '0',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`,`id_nodo_origen`),
  KEY `fk_refuerzo_origen` (`id_nodo_origen`),
  KEY `fk_refuerzo_nodo` (`id_nodo_refuerzo`),
  CONSTRAINT `fk_refuerzo_nodo` FOREIGN KEY (`id_nodo_refuerzo`) REFERENCES `nodo_conocimiento` (`id_nodo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_refuerzo_origen` FOREIGN KEY (`id_nodo_origen`) REFERENCES `nodo_conocimiento` (`id_nodo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_refuerzo_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refuerzo_pendiente`
--

LOCK TABLES `refuerzo_pendiente` WRITE;
/*!40000 ALTER TABLE `refuerzo_pendiente` DISABLE KEYS */;
/*!40000 ALTER TABLE `refuerzo_pendiente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo_electronico` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `edad` int unsigned NOT NULL,
  `nivel_actual` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Principiante',
  `estereotipo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Explorador Novato',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `test_completado` tinyint(1) DEFAULT '0',
  `tema_preferido` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'claro',
  `audio_activado` tinyint(1) DEFAULT '1',
  `alto_contraste` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo_electronico` (`correo_electronico`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (2,'papoi','papoi@gmail.com','$2b$10$inawDN3wzkxiD2XIfWz08eyzfVTBvPZEXIH6uOInJSnY3EsskH3TG',8,'Principiante','Explorador Novato','2026-10-16 04:02:01',0,'claro',1,0),(3,'nenuco','nenuco@gmail.com','$2b$10$3fpjoGFebcmcyj1MkpPyY.jne7vOXW5O1CPQgwp1opNWAxK0JX7.2',11,'Principiante','Explorador Novato','2026-10-16 04:03:24',0,'claro',1,0),(4,'chariotsilver4','chariotsilver4@gmail.com','$2b$10$sx9yAYHqxqJbDkMqfplV4eUUr/wvIpVuk.5pX0uYjBOdfjX6anF.O',9,'Intermedio','Explorador Novato','2026-10-26 20:25:32',1,'claro',1,0),(5,'pipo','pipo@gmail.com','$2b$10$lYJ05XhsTMMWvFb/DEbqPuho9pD8Om2rHNaIyvXMPfhR1FTiI0GRy',8,'Intermedio','Explorador Novato','2026-10-27 16:46:44',1,'claro',1,0),(6,'sisifo','sisifo@gmail.com','$2b$10$rZatWLvnLQ2b0KhnMnnpP.68LHHh/Cq89R1FFrY0hpyvfd9iKqmFy',12,'Principiante','Explorador Novato','2026-10-27 17:12:10',1,'claro',1,0),(7,'alancito','alancito@gmail.com','$2b$10$NVKTGJdClqlz0cdFD0iTNOKObmpFBrLsOpyQ5fRXk0kbPuRCCa4N6',8,'Principiante','Explorador Novato','2026-10-28 19:12:03',1,'claro',1,0),(8,'pepillo','pepillo@gmail.com','$2b$10$Z671TZP98nr4PUATQeYYte9Dd5UvC72IuqMfHo.VOiPyEOyvCH1T2',9,'Intermedio','Autodidacta Constante','2026-10-28 19:55:07',1,'claro',1,0),(9,'venado26','venado26@gmail.com','$2b$10$Ec/oFneM78mbMl7mU34rw.PbWbzNjpeMpOzDDrxgrJXYtPG22kKkC',10,'Avanzado','Autodidacta Eficiente','2026-10-30 20:03:29',1,'claro',1,0),(10,'pablocrg16','pablocrg16@gmail.com','$2b$10$PlylOQrPmjcNCoZoP26m/e7UqgR0m48NkJEZEGoUU0HLdIXJ/p9Pa',5,'Principiante','Aprendiz Frágil','2026-10-30 20:18:16',1,'claro',1,0),(11,'papulin','papulin@gmail.com','$2b$10$90Fjt4Gf/lqgIIy8B0/huOF4lhR/zI6OYttt3hQmvRqnuXBdN6WcO',7,'Intermedio','Autodidacta Constante','2026-11-07 19:09:51',1,'claro',1,0),(12,'adair','adair@gmail.com','$2b$10$ZNrER08w8xzl9kzEaR2kIu9XAoPbjfngEgY5N4BKvGPCbx9eP0w12',9,'Intermedio','Autodidacta Constante','2026-11-19 16:35:12',1,'claro',1,0),(13,'ejemplo','ejemplo@gmail.com','$2b$10$FCHvAP3OmYk/JtcJbXINN.qM86Slb7g4TCcdbqABfxVwvwFvtlBmK',10,'Principiante','Aprendiz Frágil','2026-11-20 01:58:53',1,'claro',1,0),(14,'tunometecabra','tunometecabra@gmail.com','$2b$10$wuUQBbj.faf5pfUGQhooGOri20D6yvp5Vsnz2bncge6xFHySzGw12',12,'Principiante','Aprendiz Frágil','2026-11-20 05:07:21',1,'claro',1,0),(15,'ejemplo1','ejemplo1@gmail.com','$2b$10$dXNX7Pp4ekhrk2lMZDjO6.hPJLN/L/kukUWPeho5g6EtfgzDg1d1S',9,'Principiante','Aprendiz Frágil','2026-11-20 15:45:23',1,'claro',1,0);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-24 13:06:56

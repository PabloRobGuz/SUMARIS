CREATE DATABASE  IF NOT EXISTS `sumaris` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sumaris`;
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
-- Table structure for table `historial_recompensas`
--

DROP TABLE IF EXISTS `historial_recompensas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_recompensas` (
  `id_recompensa` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `nombre_recompensa` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_logro` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intento_ejercicio`
--

LOCK TABLES `intento_ejercicio` WRITE;
/*!40000 ALTER TABLE `intento_ejercicio` DISABLE KEYS */;
INSERT INTO `intento_ejercicio` VALUES (1,4,1,0,0,0,5,0,1,0,'2026-10-28 20:19:53'),(2,4,1,0,0,0,5,0,1,0,'2026-10-28 20:19:53'),(3,4,1,1,0,0,5,0,1,0,'2026-10-28 21:09:21'),(4,4,1,0,0,0,5,0,1,0,'2026-10-28 21:09:30'),(5,4,1,0,0,0,5,0,1,0,'2026-10-28 21:09:41'),(6,4,1,1,0,0,5,0,1,0,'2026-10-28 21:09:49'),(7,4,1,1,0,0,5,0,1,0,'2026-10-28 21:09:59'),(11,4,1,1,0,0,5,0,1,0,'2026-10-28 22:53:15'),(12,4,1,1,0,0,5,0,1,0,'2026-10-28 23:47:58'),(13,4,1,1,0,0,5,0,1,0,'2026-10-28 23:48:07'),(14,4,1,1,0,0,5,0,1,0,'2026-10-28 23:48:29'),(15,4,2,1,0,0,5,0,1,0,'2026-10-28 23:48:38'),(16,4,2,1,0,0,5,0,1,0,'2026-10-28 23:48:42'),(17,4,2,1,0,0,5,0,1,0,'2026-10-28 23:49:32'),(18,4,3,1,0,0,5,0,1,0,'2026-10-28 23:49:45'),(19,4,3,1,0,0,5,0,1,0,'2026-10-28 23:50:02'),(20,4,3,1,0,0,5,0,1,0,'2026-10-28 23:50:09'),(21,4,1,1,0,0,5,0,1,0,'2026-10-28 23:50:18'),(22,4,1,1,0,0,5,0,1,0,'2026-10-28 23:50:22'),(23,4,1,1,0,0,5,0,1,0,'2026-10-28 23:50:37'),(24,4,2,1,0,0,5,0,1,0,'2026-10-28 23:50:55'),(25,4,2,1,0,0,5,0,1,0,'2026-10-28 23:51:00'),(26,4,2,1,0,0,5,0,1,0,'2026-10-28 23:51:08'),(27,4,1,1,0,0,5,0,1,0,'2026-10-28 23:52:00'),(28,4,1,1,0,0,5,0,1,0,'2026-10-28 23:52:13'),(29,4,1,1,0,0,5,0,1,0,'2026-10-28 23:52:32'),(30,4,2,1,0,0,5,0,1,0,'2026-10-28 23:52:47'),(31,4,2,1,0,0,5,0,1,0,'2026-10-28 23:52:53'),(32,4,2,1,0,0,5,0,1,0,'2026-10-28 23:53:00'),(33,4,3,1,0,0,5,0,1,0,'2026-10-28 23:54:10'),(34,4,3,1,0,0,5,0,1,0,'2026-10-28 23:54:43'),(35,4,3,1,0,0,5,0,1,0,'2026-10-28 23:55:12'),(36,4,1,1,0,0,5,0,1,0,'2026-10-28 23:55:56'),(37,4,1,1,0,0,5,0,1,0,'2026-10-28 23:56:15'),(38,4,1,1,0,0,5,0,1,0,'2026-10-28 23:57:39'),(39,4,2,1,0,0,5,0,1,0,'2026-10-28 23:57:57'),(40,4,2,1,0,0,5,0,1,0,'2026-10-28 23:58:12'),(41,4,2,1,0,0,5,0,1,0,'2026-10-28 23:58:25'),(42,4,3,1,0,0,5,0,1,0,'2026-10-28 23:58:44'),(43,4,3,1,0,0,5,0,1,0,'2026-10-28 23:58:59'),(44,4,3,1,0,0,5,0,1,0,'2026-10-28 23:59:04'),(45,4,1,1,0,0,5,0,1,0,'2026-10-29 00:01:55'),(46,4,1,1,0,0,5,0,1,0,'2026-10-29 00:01:59'),(47,4,1,1,0,0,5,0,1,0,'2026-10-29 00:02:09'),(48,4,2,1,0,0,5,0,1,0,'2026-10-29 00:02:16'),(49,4,2,1,0,0,5,0,1,0,'2026-10-29 00:02:21'),(50,4,2,1,0,0,5,0,1,0,'2026-10-29 00:02:41'),(51,4,3,1,0,0,5,0,1,0,'2026-10-29 00:02:51'),(52,4,3,1,0,0,5,0,1,0,'2026-10-29 00:02:57'),(53,4,3,1,0,0,5,0,1,0,'2026-10-29 00:03:01');
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
  `titulo_nodo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `nivel_requisito` int unsigned DEFAULT '1',
  PRIMARY KEY (`id_nodo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nodo_conocimiento`
--

LOCK TABLES `nodo_conocimiento` WRITE;
/*!40000 ALTER TABLE `nodo_conocimiento` DISABLE KEYS */;
INSERT INTO `nodo_conocimiento` VALUES (1,'Sumas Básicas','Cimientos principales de las matemáticas',1),(2,'Sumas Intermedias','Agrupación y adición de objetos',1),(3,'Sumas Avanzadas','Decenas y unidades',1),(4,'Restas Básicas','Introducción a la sustracción',1),(5,'Restas Intermedias','Quitar elementos y diferencias',1),(6,'Restas Avanzadas','Sustracciones de mayor valor',1),(7,'Multiplicaciones Básicas','Grupos iguales y matrices',1),(8,'Multiplicaciones Intermedias','Suma repetida',1),(9,'Multiplicaciones Avanzadas','Tablas y factores',1);
/*!40000 ALTER TABLE `nodo_conocimiento` ENABLE KEYS */;
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
  `curso` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `estado_nodo` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT 'Bloqueado',
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
INSERT INTO `progreso_usuario` VALUES (2,1,0.00,'Desbloqueado','2026-10-16 04:02:01'),(3,1,0.00,'Desbloqueado','2026-10-16 04:03:24'),(4,1,0.00,'Desbloqueado','2026-10-26 20:25:32'),(5,1,0.00,'Desbloqueado','2026-10-27 16:46:44'),(6,1,0.00,'Desbloqueado','2026-10-27 17:12:10'),(7,1,0.00,'Desbloqueado','2026-10-28 19:12:03'),(8,1,0.00,'Desbloqueado','2026-10-28 19:55:07');
/*!40000 ALTER TABLE `progreso_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo_electronico` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `edad` int unsigned NOT NULL,
  `nivel_actual` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Principiante',
  `estereotipo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Explorador Novato',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `test_completado` tinyint(1) DEFAULT '0',
  `tema_preferido` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'claro',
  `audio_activado` tinyint(1) DEFAULT '1',
  `alto_contraste` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo_electronico` (`correo_electronico`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (2,'papoi','papoi@gmail.com','$2b$10$inawDN3wzkxiD2XIfWz08eyzfVTBvPZEXIH6uOInJSnY3EsskH3TG',8,'Principiante','Explorador Novato','2026-10-16 04:02:01',0,'claro',1,0),(3,'nenuco','nenuco@gmail.com','$2b$10$3fpjoGFebcmcyj1MkpPyY.jne7vOXW5O1CPQgwp1opNWAxK0JX7.2',11,'Principiante','Explorador Novato','2026-10-16 04:03:24',0,'claro',1,0),(4,'chariotsilver4','chariotsilver4@gmail.com','$2b$10$sx9yAYHqxqJbDkMqfplV4eUUr/wvIpVuk.5pX0uYjBOdfjX6anF.O',9,'Intermedio','Explorador Novato','2026-10-26 20:25:32',1,'claro',1,0),(5,'pipo','pipo@gmail.com','$2b$10$lYJ05XhsTMMWvFb/DEbqPuho9pD8Om2rHNaIyvXMPfhR1FTiI0GRy',8,'Intermedio','Explorador Novato','2026-10-27 16:46:44',1,'claro',1,0),(6,'sisifo','sisifo@gmail.com','$2b$10$rZatWLvnLQ2b0KhnMnnpP.68LHHh/Cq89R1FFrY0hpyvfd9iKqmFy',12,'Principiante','Explorador Novato','2026-10-27 17:12:10',1,'claro',1,0),(7,'alancito','alancito@gmail.com','$2b$10$NVKTGJdClqlz0cdFD0iTNOKObmpFBrLsOpyQ5fRXk0kbPuRCCa4N6',8,'Principiante','Explorador Novato','2026-10-28 19:12:03',1,'claro',1,0),(8,'pepillo','pepillo@gmail.com','$2b$10$Z671TZP98nr4PUATQeYYte9Dd5UvC72IuqMfHo.VOiPyEOyvCH1T2',9,'Intermedio','Autodidacta Constante','2026-10-28 19:55:07',1,'claro',1,0);
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

-- Dump completed on 2026-10-28 18:18:47

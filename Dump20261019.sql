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
  `cantidad_errores` int unsigned DEFAULT '0',
  `tiempo_invertido_segundos` int unsigned DEFAULT '0',
  `pistas_solicitadas` int unsigned DEFAULT '0',
  `intentos_totales` int unsigned DEFAULT '1',
  `necesita_esfuerzo` tinyint(1) DEFAULT '0',
  `fecha_intento` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_intento`),
  KEY `fk_intento_usuario` (`id_usuario`),
  KEY `fk_intento_nodo` (`id_nodo`),
  CONSTRAINT `fk_intento_nodo` FOREIGN KEY (`id_nodo`) REFERENCES `nodo_conocimiento` (`id_nodo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_intento_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intento_ejercicio`
--

LOCK TABLES `intento_ejercicio` WRITE;
/*!40000 ALTER TABLE `intento_ejercicio` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nodo_conocimiento`
--

LOCK TABLES `nodo_conocimiento` WRITE;
/*!40000 ALTER TABLE `nodo_conocimiento` DISABLE KEYS */;
INSERT INTO `nodo_conocimiento` VALUES (1,'Aritmética y fracciones','Cimientos principales de las matemáticas',1);
/*!40000 ALTER TABLE `nodo_conocimiento` ENABLE KEYS */;
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
INSERT INTO `progreso_usuario` VALUES (2,1,0.00,'Desbloqueado','2026-10-16 04:02:01'),(3,1,0.00,'Desbloqueado','2026-10-16 04:03:24');
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
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo_electronico` (`correo_electronico`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (2,'papoi','papoi@gmail.com','$2b$10$inawDN3wzkxiD2XIfWz08eyzfVTBvPZEXIH6uOInJSnY3EsskH3TG',8,'Principiante','Explorador Novato','2026-10-16 04:02:01'),(3,'nenuco','nenuco@gmail.com','$2b$10$3fpjoGFebcmcyj1MkpPyY.jne7vOXW5O1CPQgwp1opNWAxK0JX7.2',11,'Principiante','Explorador Novato','2026-10-16 04:03:24');
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

-- Dump completed on 2026-10-19 11:26:00

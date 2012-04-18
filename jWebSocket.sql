CREATE DATABASE  IF NOT EXISTS `jwebsocket` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `jwebsocket`;
-- MySQL dump 10.13  Distrib 5.5.16, for Win32 (x86)
--
-- Host: localhost    Database: jwebsocket
-- ------------------------------------------------------
-- Server version	5.5.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `flights`
--

DROP TABLE IF EXISTS `flights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `flights` (
  `FLIGHT_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `FLIGHT_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `FLIGHT_STATUS` enum('LANDING','BOARDING','TAKING_OFF') NOT NULL,
  `FLIGHT_PASSENGERS` int(11) NOT NULL DEFAULT '0',
  `AIRPORT_ID` int(11) NOT NULL,
  `AIRLINE_ID` varchar(45) NOT NULL,
  PRIMARY KEY (`FLIGHT_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flights`
--

LOCK TABLES `flights` WRITE;
/*!40000 ALTER TABLE `flights` DISABLE KEYS */;
INSERT INTO `flights` VALUES 
  (1,'2012-02-21 19:25:15','LANDING',56,2,'1'),
  (2,'2012-02-21 19:25:28','LANDING',432,4,'7'),
  (3,'2012-02-21 19:25:54','BOARDING',122,1,'4'),
  (5,'2012-02-21 19:25:58','BOARDING',87,5,'2'),
  (6,'2012-02-21 19:26:00','BOARDING',44,6,'2'),
  (7,'2012-02-21 19:26:11','TAKING_OFF',86,7,'3'),
  (8,'2012-03-19 12:04:05','LANDING',175,2,'5'),
  (9,'2012-03-19 12:04:35','LANDING',21,3,'1'),
  (10,'2012-03-19 12:04:38','LANDING',70,3,'5'),
  (11,'2012-03-19 15:01:05','LANDING',328,1,'4'),
  (12,'2012-03-19 23:03:37','LANDING',65,7,'6'),
  (13,'2012-03-19 23:04:03','LANDING',161,6,'6'),
  (14,'2012-03-19 23:04:04','LANDING',490,4,'7'),
  (15,'2012-03-26 20:56:07','TAKING_OFF',288,2,'2'),
  (16,'2012-03-26 20:56:07','BOARDING',159,2,'1'),
  (17,'2012-03-29 20:44:34','TAKING_OFF',200,1,'7'),
  (18,'2012-03-29 20:45:06','TAKING_OFF',133,3,'3'),
  (19,'2012-03-29 20:53:41','TAKING_OFF',32,5,'1'),
  (20,'2012-03-29 20:54:12','TAKING_OFF',98,5,'7'),
  (21,'2012-03-29 20:54:44','BOARDING',65,6,'6'),
  (22,'2012-04-07 09:42:24','TAKING_OFF',431,2,'7'),
  (23,'2012-04-07 09:44:53','BOARDING',222,4,'2'),
  (24,'2012-04-07 09:50:59','BOARDING',122,5,'1'),
  (25,'2012-04-07 09:53:05','TAKING_OFF',300,4,'5');
/*!40000 ALTER TABLE `flights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `airports`
--

DROP TABLE IF EXISTS `airports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `airports` (
  `AIRPORT_ID` int(11) NOT NULL AUTO_INCREMENT,
  `AIRPORT_NAME` varchar(45) DEFAULT NULL,
  `AIRPORT_CITY` varchar(45) DEFAULT NULL,
  `AIRPORT_CODE` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`AIRPORT_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airports`
--

LOCK TABLES `airports` WRITE;
/*!40000 ALTER TABLE `airports` DISABLE KEYS */;
INSERT INTO `airports` VALUES 
  (1,'Barajas','Madrid','MAD'),
  (2,'Es Codolar','Ibiza','IBZ'),
  (3,'La Paloma','Bilbao','BIO'),
  (4,'El Prat','Barcelona','BCN'),
  (5,'Monflorite','Huesca','HSK'),
  (6,'San Pablo','Sevilla','SVQ'),
  (7,'Manises','Valencia','VLC');
/*!40000 ALTER TABLE `airports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `airlines`
--

DROP TABLE IF EXISTS `airlines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `airlines` (
  `AIRLINE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `AIRLINE_NAME` varchar(45) NOT NULL,
  `AIRLINE_COUNTRY` varchar(45) DEFAULT NULL,
  `AIRLINE_CODE` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`AIRLINE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airlines`
--

LOCK TABLES `airlines` WRITE;
/*!40000 ALTER TABLE `airlines` DISABLE KEYS */;
INSERT INTO `airlines` VALUES 
  (1,'Air France','France','AFR'),
  (2,'Lufthansa','Germany',NULL),
  (3,'Iberia','Spain',NULL),
  (4,'British Airways','United Kingdom',NULL),
  (5,'Aerolíneas Argentinas','Argentina',NULL),
  (6,'American Airlines','USA',NULL),
  (7,'Qantas','Australia',NULL);
/*!40000 ALTER TABLE `airlines` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-04-18 23:57:54

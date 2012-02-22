-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 22-02-2012 a las 22:31:46
-- Versión del servidor: 5.5.16
-- Versión de PHP: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `jwebsocket`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `flights`
--

CREATE TABLE IF NOT EXISTS `flights` (
  `FLIGHT_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `FLIGHT_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `FLIGHT_STATUS` enum('LANDING','BOARDING','TAKING_OFF') NOT NULL,
  PRIMARY KEY (`FLIGHT_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Volcado de datos para la tabla `flights`
--

INSERT INTO `flights` (`FLIGHT_ID`, `FLIGHT_TIME`, `FLIGHT_STATUS`) VALUES
(1, '2012-02-21 19:25:15', 'LANDING'),
(2, '2012-02-21 19:25:28', 'LANDING'),
(3, '2012-02-21 19:25:54', 'BOARDING'),
(4, '2012-02-21 19:25:56', 'BOARDING'),
(5, '2012-02-21 19:25:58', 'BOARDING'),
(6, '2012-02-21 19:26:00', 'BOARDING'),
(7, '2012-02-21 19:26:11', 'TAKING_OFF');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

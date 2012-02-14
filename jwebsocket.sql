/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50516
Source Host           : localhost:3306
Source Database       : jwebsocket

Target Server Type    : MYSQL
Target Server Version : 50516
File Encoding         : 65001

Date: 2012-02-11 10:16:36
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `sessions`
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `SESSIONID` bigint(20) NOT NULL AUTO_INCREMENT,
  `INITTIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `STATUS` enum('INIT','OPEN','CLOSED') NOT NULL,
  PRIMARY KEY (`SESSIONID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of sessions
-- ----------------------------
INSERT INTO `sessions` VALUES ('1', '2012-02-10 18:31:57', 'INIT');
INSERT INTO `sessions` VALUES ('2', '2012-02-10 18:31:57', 'INIT');
INSERT INTO `sessions` VALUES ('3', '2012-02-10 18:32:40', 'INIT');
INSERT INTO `sessions` VALUES ('4', '2012-02-10 18:32:40', 'OPEN');
INSERT INTO `sessions` VALUES ('5', '2012-02-10 18:32:40', 'OPEN');
INSERT INTO `sessions` VALUES ('6', '2012-02-10 18:32:40', 'OPEN');
INSERT INTO `sessions` VALUES ('7', '2012-02-10 18:32:40', 'OPEN');
INSERT INTO `sessions` VALUES ('8', '2012-02-10 18:32:40', 'OPEN');
INSERT INTO `sessions` VALUES ('9', '2012-02-10 18:32:40', 'OPEN');
INSERT INTO `sessions` VALUES ('10', '2012-02-10 18:32:40', 'CLOSED');
INSERT INTO `sessions` VALUES ('11', '2012-02-10 18:32:40', 'CLOSED');
INSERT INTO `sessions` VALUES ('12', '2012-02-10 18:32:40', 'CLOSED');
INSERT INTO `sessions` VALUES ('13', '2012-02-10 18:32:43', 'INIT');
INSERT INTO `sessions` VALUES ('14', '2012-02-10 18:32:43', 'OPEN');
INSERT INTO `sessions` VALUES ('15', '2012-02-10 18:32:43', 'OPEN');
INSERT INTO `sessions` VALUES ('16', '2012-02-10 18:32:43', 'OPEN');
INSERT INTO `sessions` VALUES ('17', '2012-02-10 18:32:43', 'OPEN');
INSERT INTO `sessions` VALUES ('18', '2012-02-10 18:32:43', 'OPEN');
INSERT INTO `sessions` VALUES ('19', '2012-02-10 18:32:43', 'OPEN');
INSERT INTO `sessions` VALUES ('20', '2012-02-10 18:32:43', 'CLOSED');
INSERT INTO `sessions` VALUES ('21', '2012-02-10 18:32:43', 'CLOSED');
INSERT INTO `sessions` VALUES ('22', '2012-02-10 18:32:43', 'CLOSED');

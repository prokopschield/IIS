-- Adminer 4.8.1 MySQL 5.5.5-10.11.3-MariaDB-1:10.11.3+maria~ubu2204 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `camp_id` bigint(20) unsigned NOT NULL,
  `leader_id` bigint(20) unsigned NOT NULL,
  `description` text NOT NULL,
  `points` double NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `leader_id` (`leader_id`),
  KEY `camp_id` (`camp_id`),
  CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`leader_id`) REFERENCES `leader` (`id`) ON DELETE CASCADE,
  CONSTRAINT `activity_ibfk_2` FOREIGN KEY (`camp_id`) REFERENCES `camp` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `attended`;
CREATE TABLE `attended` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` bigint(20) unsigned NOT NULL,
  `attendee_id` int(10) unsigned NOT NULL,
  `score` double NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `activity_id` (`activity_id`),
  KEY `attendee_id` (`attendee_id`),
  CONSTRAINT `attended_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attended_ibfk_2` FOREIGN KEY (`attendee_id`) REFERENCES `attendee` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `attendee`;
CREATE TABLE `attendee` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `attendee_id` bigint(20) unsigned NOT NULL,
  `camp_id` bigint(20) unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `attendee_id` (`attendee_id`),
  KEY `camp_id` (`camp_id`),
  CONSTRAINT `attendee_ibfk_1` FOREIGN KEY (`attendee_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendee_ibfk_2` FOREIGN KEY (`camp_id`) REFERENCES `camp` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `auth`;
CREATE TABLE `auth` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `method` varchar(8) NOT NULL,
  `secret` varchar(64) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `file_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `camp`;
CREATE TABLE `camp` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `organizer_id` bigint(20) unsigned NOT NULL,
  `name` varchar(64) NOT NULL,
  `web` varchar(64) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `organizer` (`organizer_id`),
  CONSTRAINT `camp_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `dm`;
CREATE TABLE `dm` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` bigint(20) unsigned NOT NULL,
  `recipient_id` bigint(20) unsigned NOT NULL,
  `hash` varchar(43) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `recipient_id` (`recipient_id`),
  KEY `sender_id` (`sender_id`),
  CONSTRAINT `dm_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dm_ibfk_2` FOREIGN KEY (`recipient_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `file`;
CREATE TABLE `file` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(64) NOT NULL,
  `hash` varchar(43) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `leader`;
CREATE TABLE `leader` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `camp_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `camp_id` (`camp_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `leader_ibfk_1` FOREIGN KEY (`camp_id`) REFERENCES `camp` (`id`) ON DELETE CASCADE,
  CONSTRAINT `leader_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `displayname` varchar(64) NOT NULL,
  `legal_name` varchar(64) NOT NULL,
  `legal_guardian` varchar(64) NOT NULL,
  `legal_guardian_contact` varchar(64) NOT NULL,
  `email` varchar(64) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

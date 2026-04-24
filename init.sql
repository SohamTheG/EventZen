-- ==========================================
-- 1. USER & ATTENDEE DATABASE
-- ==========================================
CREATE DATABASE IF NOT EXISTS userattendeesdb;
USE userattendeesdb;

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `attendees` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `event_id` int NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1esxmgs8d1wyypehbhbijyrkd` (`user_id`),
  CONSTRAINT `FK1esxmgs8d1wyypehbhbijyrkd` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ==========================================
-- 2. EVENTS & BOOKING DATABASE
-- ==========================================
CREATE DATABASE IF NOT EXISTS events_booking_db;
USE events_booking_db;

CREATE TABLE IF NOT EXISTS `events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `host_id` bigint DEFAULT NULL,
  `is_public` bit(1) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `event_date` date DEFAULT NULL,
  `status` enum('APPROVED','CANCELLED','PENDING','REJECTED') DEFAULT NULL,
  `venue_id` bigint DEFAULT NULL,
  `event_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK1ovacgmcqsqj8588kv8xpcqab` (`event_id`),
  CONSTRAINT `FK2ww82bk3npaiyu9oeehwtt2q3` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ==========================================
-- 3. VENUE & VENDOR DATABASE
-- ==========================================
CREATE DATABASE IF NOT EXISTS venue_service_db;
USE venue_service_db;

-- (Deleted the CREATE TABLE commands here so Sequelize can do it automatically)
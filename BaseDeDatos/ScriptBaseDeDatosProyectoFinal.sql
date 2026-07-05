-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema proyecto_final_segunda_mano_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema proyecto_final_segunda_mano_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `proyecto_final_segunda_mano_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `proyecto_final_segunda_mano_db` ;

-- -----------------------------------------------------
-- Table `proyecto_final_segunda_mano_db`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_final_segunda_mano_db`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar_url` VARCHAR(255) NULL DEFAULT NULL,
  `role` ENUM('Usuario', 'Moderador', 'Administrador') NULL DEFAULT 'Usuario',
  `status` ENUM('Activo', 'Bloqueado') NULL DEFAULT 'Activo',
  `avg_rating` DECIMAL(3,2) NULL DEFAULT '0.00',
  `location` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NOW(),
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `proyecto_final_segunda_mano_db`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_final_segunda_mano_db`.`categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `slug` VARCHAR(50) NOT NULL,
  `created_at` DATETIME NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `slug` (`slug` ASC) VISIBLE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `proyecto_final_segunda_mano_db`.`articles`
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Table `proyecto_final_segunda_mano_db`.`articles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_final_segunda_mano_db`.`articles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `condition` ENUM('Nuevo', 'Como nuevo', 'Buen estado', 'Aceptable') NOT NULL,
  `status` ENUM('Borrador', 'Publicado', 'En revisión', 'Retirado', 'Vendido') NULL DEFAULT 'Borrador' 
    COMMENT 'Estado actual del artículo en la plataforma.',
  `previous_status` ENUM('Borrador', 'Publicado', 'En revisión', 'Retirado', 'Vendido') NULL DEFAULT NULL 
    COMMENT 'Guarda el estado anterior antes de entrar a "En revisión" para poder restaurarlo si el moderador lo aprueba.',
  `location` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT NOW(),
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `category_id` (`category_id` ASC) VISIBLE,
  CONSTRAINT `articles_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `articles_ibfk_2`
    FOREIGN KEY (`category_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`categories` (`id`)
    ON DELETE RESTRICT)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `proyecto_final_segunda_mano_db`.`article_photos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_final_segunda_mano_db`.`article_photos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `article_id` INT NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `order` INT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `article_id` (`article_id` ASC) VISIBLE,
  CONSTRAINT `article_photos_ibfk_1`
    FOREIGN KEY (`article_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`articles` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `proyecto_final_segunda_mano_db`.`conversations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_final_segunda_mano_db`.`conversations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `article_id` INT NOT NULL,
  `buyer_id` INT NOT NULL,
  `seller_id` INT NOT NULL,
  `created_at` DATETIME NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  INDEX `article_id` (`article_id` ASC) VISIBLE,
  INDEX `buyer_id` (`buyer_id` ASC) VISIBLE,
  INDEX `seller_id` (`seller_id` ASC) VISIBLE,
  CONSTRAINT `conversations_ibfk_1`
    FOREIGN KEY (`article_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`articles` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `conversations_ibfk_2`
    FOREIGN KEY (`buyer_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `conversations_ibfk_3`
    FOREIGN KEY (`seller_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `proyecto_final_segunda_mano_db`.`favorites`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_final_segunda_mano_db`.`favorites` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `article_id` INT NOT NULL,
  `created_at` DATETIME NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_id` (`user_id` ASC, `article_id` ASC) VISIBLE,
  INDEX `article_id` (`article_id` ASC) VISIBLE,
  CONSTRAINT `favorites_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2`
    FOREIGN KEY (`article_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`articles` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `proyecto_final_segunda_mano_db`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_final_segunda_mano_db`.`messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `conversation_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `is_read` TINYINT(1) NULL DEFAULT '0',
  `sent_at` DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  INDEX `conversation_id` (`conversation_id` ASC) VISIBLE,
  INDEX `sender_id` (`sender_id` ASC) VISIBLE,
  CONSTRAINT `messages_ibfk_1`
    FOREIGN KEY (`conversation_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`conversations` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2`
    FOREIGN KEY (`sender_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `proyecto_final_segunda_mano_db`.`notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_final_segunda_mano_db`.`notifications` (
  `id` INT NOT NULL AUTO_INCREMENT 
    COMMENT 'ID único autoincremental de cada notificación.',
  `user_id` INT NOT NULL 
    COMMENT 'ID del usuario destinatario que recibirá la notificación en la plataforma.',
  `type` ENUM('Nuevo_Mensaje', 'Articulo_Rechazado', 'Articulo_Aprobado', 'Articulo_Vendido') NOT NULL 
    COMMENT 'Define el tipo de evento para aplicar lógicas, iconos o redirecciones en el Frontend.',
  `content` TEXT NOT NULL 
    COMMENT 'Texto descriptivo y legible que se le mostrará al usuario en su pantalla.',
  `reference_id` INT NULL DEFAULT NULL 
    COMMENT 'ID del objeto relacionado (conversation_id o article_id) para permitir la redirección al hacer clic.',
  `is_read` TINYINT(1) NULL DEFAULT '0' 
    COMMENT 'Estado de lectura de la notificación: 0 = No leída, 1 = Leída.',
  `created_at` DATETIME NULL DEFAULT NOW() 
    COMMENT 'Fecha y hora exacta en la que el sistema generó la notificación.',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	COMMENT 'Fecha y hora exacta en la que el sistema actulizó la notificación.',
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `notifications_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `proyecto_final_segunda_mano_db`.`ratings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_final_segunda_mano_db`.`ratings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `from_user_id` INT NOT NULL,
  `to_user_id` INT NOT NULL,
  `article_id` INT NOT NULL,
  `score` INT NOT NULL,
  `comment` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  INDEX `from_user_id` (`from_user_id` ASC) VISIBLE,
  INDEX `to_user_id` (`to_user_id` ASC) VISIBLE,
  INDEX `article_id` (`article_id` ASC) VISIBLE,
  CONSTRAINT `ratings_ibfk_1`
    FOREIGN KEY (`from_user_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2`
    FOREIGN KEY (`to_user_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_3`
    FOREIGN KEY (`article_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`articles` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `proyecto_final_segunda_mano_db`.`reports`
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Table `proyecto_final_segunda_mano_db`.`reports`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_final_segunda_mano_db`.`reports` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID único autoincremental de cada reporte.',
  `reporter_id` INT NOT NULL COMMENT 'ID del usuario que realiza la denuncia o reporte.',
  `article_id` INT NULL DEFAULT NULL COMMENT 'ID del artículo reportado (se llena si el reporte es tipo Articulo, de lo contrario es NULL).',
  `reported_user_id` INT NULL DEFAULT NULL COMMENT 'ID del usuario reportado (se llena si el reporte es tipo Usuario, de lo contrario es NULL).',
  `message_id` INT NULL DEFAULT NULL COMMENT 'ID del mensaje de chat reportado (se llena si el reporte es tipo Mensaje, de lo contrario es NULL).',
  `type` ENUM('Articulo', 'Usuario', 'Mensaje') NOT NULL COMMENT 'Define la categoría del reporte para saber qué objeto del sistema estamos auditando.',
  `reason` TEXT NOT NULL COMMENT 'Explicación o motivos detallados escritos por el usuario sobre el porqué del reporte.',
  `status` ENUM('Pendiente', 'Resuelto') NULL DEFAULT 'Pendiente' COMMENT 'Estado del reporte en el flujo de trabajo de los moderadores.',
  `moderator_id` INT NULL DEFAULT NULL COMMENT 'ID del usuario con rol Moderador/Administrador que tomó el reporte para gestionarlo.',
  `moderator_note` TEXT NULL DEFAULT NULL COMMENT 'Anotaciones internas del moderador explicando la resolución tomada.',
  `created_at` DATETIME NULL DEFAULT NOW() COMMENT 'Fecha y hora exacta en la que el usuario envió el reporte.',
  `resolved_at` DATETIME NULL DEFAULT NULL COMMENT 'Fecha y hora exacta en la que el moderador marcó el reporte como Resuelto.',
  PRIMARY KEY (`id`),
  
  -- Índices para optimizar las búsquedas en el panel de control del moderador
  INDEX `reporter_id` (`reporter_id` ASC) VISIBLE,
  INDEX `article_id` (`article_id` ASC) VISIBLE,
  INDEX `reported_user_id` (`reported_user_id` ASC) VISIBLE,
  INDEX `message_id` (`message_id` ASC) VISIBLE,
  INDEX `moderator_id` (`moderator_id` ASC) VISIBLE,
  
  -- Llaves Foráneas (Relaciones entre tablas)
  CONSTRAINT `reports_ibfk_1`
    FOREIGN KEY (`reporter_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `reports_ibfk_2`
    FOREIGN KEY (`article_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`articles` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `reports_ibfk_3`
    FOREIGN KEY (`reported_user_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `reports_ibfk_4`
    FOREIGN KEY (`message_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`messages` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `reports_ibfk_5`
    FOREIGN KEY (`moderator_id`)
    REFERENCES `proyecto_final_segunda_mano_db`.`users` (`id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

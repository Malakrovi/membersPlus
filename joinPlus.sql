-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:3306
-- Généré le :  Ven 21 Août 2020 à 18:26
-- Version du serveur :  5.7.30-0ubuntu0.18.04.1
-- Version de PHP :  7.2.24-0ubuntu0.18.04.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `joinPlus`
--

-- --------------------------------------------------------

--
-- Structure de la table `find`
--

CREATE TABLE `find` (
  `userID` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serverArray` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `guilds`
--

CREATE TABLE `guilds` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memberCount` int(11) DEFAULT NULL,
  `currentJoins` int(11) NOT NULL DEFAULT '0',
  `boughtJoins` int(11) NOT NULL DEFAULT '0',
  `invite` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `advertName` text COLLATE utf8mb4_unicode_ci,
  `currentBoost` int(11) NOT NULL DEFAULT '0',
  `boughtBoost` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `joins`
--

CREATE TABLE `joins` (
  `userID` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serverID` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joinedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `canLeaveAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `members`
--

CREATE TABLE `members` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tag` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coins` float(50,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `transaction` json DEFAULT NULL,
  `joinedServers` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `stats`
--

CREATE TABLE `stats` (
  `Users` int(11) DEFAULT NULL,
  `Servers` int(11) DEFAULT NULL,
  `commandsMade` int(11) DEFAULT '0',
  `joined` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

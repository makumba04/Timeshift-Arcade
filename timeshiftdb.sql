-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-06-2024 a las 20:51:53
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `timeshiftdb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `category`
--

CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL,
  `category_description` varchar(100) NOT NULL,
  `category_cover_path` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `category`
--

INSERT INTO `category` (`category_id`, `category_name`, `category_description`, `category_cover_path`) VALUES
(1, 'Puzzles', 'Perfect to give activity to the grey!', '/images/categories-cover/puzzles.png'),
(2, 'Action', 'Cameras... Set... ACTION!', '/images/categories-cover/action.png'),
(3, 'Driving', 'Drop a gear and disappear!', '/images/categories-cover/driving.png'),
(4, 'Shooters', 'Aim for the head!', '/images/categories-cover/shooters.png'),
(5, 'Platforms', 'Your princess is in another castle...', '/images/categories-cover/platforms.png'),
(6, 'RPGs', 'It\'s dangerous to go alone. Take this!', '/images/categories-cover/rpg.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `game`
--

CREATE TABLE `game` (
  `game_id` int(11) NOT NULL,
  `category_type` int(11) DEFAULT NULL,
  `game_name` varchar(50) DEFAULT NULL,
  `game_description` mediumtext NOT NULL,
  `localpath` varchar(50) NOT NULL,
  `htp` longtext NOT NULL,
  `featured` tinyint(1) DEFAULT NULL,
  `cover_path` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `game`
--

INSERT INTO `game` (`game_id`, `category_type`, `game_name`, `game_description`, `localpath`, `htp`, `featured`, `cover_path`) VALUES
(1, 4, 'Arkanoid', 'Enter a realm of retro arcade excitement! Control a paddle to bounce a ball and destroy bricks. Traverse through increasingly challenging levels, dodging obstacles and snagging power-ups. With addictive gameplay and vibrant visuals, can you conquer every stage and claim arcade glory?', '/games/arkanoid/game.js', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident odio saepe deserunt cum. Dolorem quia repellat minima earum ipsum? Illo earum omnis quas facere et optio consequatur obcaecati eligendi ad. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam dolorem fuga consequuntur cumque quasi, autem cupiditate odio accusantium ipsa mollitia, maiores optio aspernatur dolor velit excepturi ratione quaerat ut impedit! Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, molestias praesentium animi, sed fugiat, fuga itaque possimus magnam beatae veritatis dolores accusamus ad quidem! Deleniti molestiae similique blanditiis. Eum, itaque! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi, accusamus. Modi nostrum, itaque deserunt non ea vero omnis dolores exercitationem voluptas fuga doloremque sequi rem! Similique sit voluptatibus laborum deserunt. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias eius laudantium quas fugit amet corrupti eligendi, distinctio odio quam reiciendis incidunt odit veritatis corporis aut molestiae nostrum facilis molestias doloribus! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque facere quod perspiciatis deserunt sed aspernatur natus magnam et ad accusamus culpa, maxime laboriosam officiis nesciunt! Non consequuntur veniam atque dolorem. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea unde ipsa cupiditate quasi tempore officiis! Cumque repellat omnis excepturi doloribus iusto, a ratione, dolorem veniam adipisci, minima eos at autem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis nostrum fugit eveniet veritatis repellat optio quas beatae dicta ducimus laudantium pariatur voluptas nisi expedita, ad non, magnam consequuntur neque quibusdam. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus ratione vel explicabo debitis sint quae est quisquam accusamus cum, eos, alias blanditiis, placeat rerum recusandae at! Mollitia cum nam est. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, earum? Rem dolorem suscipit fugit numquam temporibus commodi doloribus voluptatum laborum totam odio voluptatem, nihil maiores officiis fuga, cum ut animi. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam quis repudiandae magni voluptates excepturi impedit maxime sunt accusantium officia? Unde beatae laudantium itaque dolores. Recusandae quisquam id sapiente commodi omnis.', 1, '/images/games-cover/arkanoid.jpg'),
(2, 4, 'Space Invaders', 'Defend Earth from a relentless alien invasion! Maneuver your ship across the screen, blasting waves of descending extraterrestrial foes. With each level, the invaders speed up, intensifying the challenge. Utilize barriers strategically and aim for high scores in this iconic arcade classic.', '/games/space_invaders/game.js', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident odio saepe deserunt cum. Dolorem quia repellat minima earum ipsum? Illo earum omnis quas facere et optio consequatur obcaecati eligendi ad. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam dolorem fuga consequuntur cumque quasi, autem cupiditate odio accusantium ipsa mollitia, maiores optio aspernatur dolor velit excepturi ratione quaerat ut impedit! Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, molestias praesentium animi, sed fugiat, fuga itaque possimus magnam beatae veritatis dolores accusamus ad quidem! Deleniti molestiae similique blanditiis. Eum, itaque! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi, accusamus. Modi nostrum, itaque deserunt non ea vero omnis dolores exercitationem voluptas fuga doloremque sequi rem! Similique sit voluptatibus laborum deserunt. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias eius laudantium quas fugit amet corrupti eligendi, distinctio odio quam reiciendis incidunt odit veritatis corporis aut molestiae nostrum facilis molestias doloribus! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque facere quod perspiciatis deserunt sed aspernatur natus magnam et ad accusamus culpa, maxime laboriosam officiis nesciunt! Non consequuntur veniam atque dolorem. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea unde ipsa cupiditate quasi tempore officiis! Cumque repellat omnis excepturi doloribus iusto, a ratione, dolorem veniam adipisci, minima eos at autem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis nostrum fugit eveniet veritatis repellat optio quas beatae dicta ducimus laudantium pariatur voluptas nisi expedita, ad non, magnam consequuntur neque quibusdam. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus ratione vel explicabo debitis sint quae est quisquam accusamus cum, eos, alias blanditiis, placeat rerum recusandae at! Mollitia cum nam est. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, earum? Rem dolorem suscipit fugit numquam temporibus commodi doloribus voluptatum laborum totam odio voluptatem, nihil maiores officiis fuga, cum ut animi. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam quis repudiandae magni voluptates excepturi impedit maxime sunt accusantium officia? Unde beatae laudantium itaque dolores. Recusandae quisquam id sapiente commodi omnis.', 1, '/images/games-cover/spaceinvaders.jpg'),
(3, 1, 'Tetris', 'Embrace the addictive puzzle challenge! Rotate and maneuver falling blocks to complete solid lines and clear the screen. With increasing speed and complexity, test your spatial skills and reflexes. Whether solo or in competition, Tetris offers timeless fun for casual players and competitive gamers alike.', '/games/tetris/game.js', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident odio saepe deserunt cum. Dolorem quia repellat minima earum ipsum? Illo earum omnis quas facere et optio consequatur obcaecati eligendi ad. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam dolorem fuga consequuntur cumque quasi, autem cupiditate odio accusantium ipsa mollitia, maiores optio aspernatur dolor velit excepturi ratione quaerat ut impedit! Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, molestias praesentium animi, sed fugiat, fuga itaque possimus magnam beatae veritatis dolores accusamus ad quidem! Deleniti molestiae similique blanditiis. Eum, itaque! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi, accusamus. Modi nostrum, itaque deserunt non ea vero omnis dolores exercitationem voluptas fuga doloremque sequi rem! Similique sit voluptatibus laborum deserunt. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias eius laudantium quas fugit amet corrupti eligendi, distinctio odio quam reiciendis incidunt odit veritatis corporis aut molestiae nostrum facilis molestias doloribus! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque facere quod perspiciatis deserunt sed aspernatur natus magnam et ad accusamus culpa, maxime laboriosam officiis nesciunt! Non consequuntur veniam atque dolorem. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea unde ipsa cupiditate quasi tempore officiis! Cumque repellat omnis excepturi doloribus iusto, a ratione, dolorem veniam adipisci, minima eos at autem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis nostrum fugit eveniet veritatis repellat optio quas beatae dicta ducimus laudantium pariatur voluptas nisi expedita, ad non, magnam consequuntur neque quibusdam. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus ratione vel explicabo debitis sint quae est quisquam accusamus cum, eos, alias blanditiis, placeat rerum recusandae at! Mollitia cum nam est. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, earum? Rem dolorem suscipit fugit numquam temporibus commodi doloribus voluptatum laborum totam odio voluptatem, nihil maiores officiis fuga, cum ut animi. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam quis repudiandae magni voluptates excepturi impedit maxime sunt accusantium officia? Unde beatae laudantium itaque dolores. Recusandae quisquam id sapiente commodi omnis.', 1, '/images/games-cover/tetris.jpg'),
(4, 2, 'Metroid', 'Navigate treacherous alien landscapes as bounty hunter Samus Aran. Explore labyrinthine caverns, battle deadly creatures, and unravel the mystery of the Metroids. Utilize an arsenal of weapons and upgrades to survive. Can you thwart the Space Pirates and eradicate the Metroid threat?', '/games/metroid/game.js', 'Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. ', 0, '/images/games-cover/metroid.jpg'),
(5, 4, 'Doom', 'Plunge into the depths of Hell as a space marine. Unleash relentless firepower against hordes of demonic foes in fast-paced, adrenaline-fueled combat. Navigate twisted corridors, uncover secrets, and confront towering demons. Survive the infernal onslaught and become the ultimate demon slayer.', '/games/doom/game.js', 'Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. ', 0, '/images/games-cover/doom.jpg'),
(6, 3, 'Grand Theft Auto', 'Enter the criminal underworld as a street thug rising through the ranks. Navigate a sprawling, open-world city, engaging in high-stakes heists, car chases, and turf wars. Complete missions for crime bosses or wreak havoc as you explore the gritty, lawless streets of Liberty City.', '/games/gta1/game.js', 'Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. ', 0, '/images/games-cover/gta.jpg'),
(7, 6, 'Pokemon Red', 'Embark on an epic journey as a Pokémon Trainer in the vibrant Kanto region. Capture, train, and battle a diverse array of Pokémon to become the Champion. Explore towns, conquer Gyms, and thwart the plans of the nefarious Team Rocket. Can you catch \'em all and fulfill your destiny?', '/games/pokemonred/game.js', 'Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. ', 0, '/images/games-cover/pokemonred.jpg'),
(8, 5, 'Super Mario Bros', 'Join Mario on a heroic quest to rescue Princess Peach from the clutches of Bowser, King of the Koopas. Navigate through Mushroom Kingdom\'s perilous landscapes, overcome obstacles, and stomp on enemies. Discover secret passages, power-ups, and warp pipes in this timeless platforming adventure.', '/games/supermariobros/game.js', 'Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. Lorem ipsum, dolor sit amet. Consenctetur adipisciting elit. ', 0, '/images/games-cover/supermariobros.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pfp_image`
--

CREATE TABLE `pfp_image` (
  `pfp_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `Image` longblob NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `saves`
--

CREATE TABLE `saves` (
  `gamedata_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL,
  `saved_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`saved_data`))
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `user_bio` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `passwd` varchar(100) NOT NULL,
  `user_role` tinyint(4) NOT NULL
) ;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_id`, `username`, `user_bio`, `email`, `passwd`, `user_role`) VALUES
(1, 'admin', NULL, 'cabellocontactme@gmail.com', '$2b$10$wEBGMgoxwlboCtkoA9DPz.X00.xuqtEGoBvfMo1I9Mv92ncyQsmWa', 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indices de la tabla `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`game_id`),
  ADD KEY `category_type` (`category_type`);

--
-- Indices de la tabla `pfp_image`
--
ALTER TABLE `pfp_image`
  ADD PRIMARY KEY (`pfp_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `saves`
--
ALTER TABLE `saves`
  ADD PRIMARY KEY (`gamedata_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `game_id` (`game_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `game`
--
ALTER TABLE `game`
  MODIFY `game_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `pfp_image`
--
ALTER TABLE `pfp_image`
  MODIFY `pfp_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `saves`
--
ALTER TABLE `saves`
  MODIFY `gamedata_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

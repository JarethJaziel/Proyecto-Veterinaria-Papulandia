-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-11-2025 a las 23:09:12
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `papulandia`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id` int(11) NOT NULL,
  `mascota_id` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `motivo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`id`, `mascota_id`, `fecha`, `motivo`) VALUES
(1, 3, '2025-11-24 12:21:00', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historiales`
--

CREATE TABLE `historiales` (
  `id` int(11) NOT NULL,
  `mascota_id` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `procedimiento` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascotas`
--

CREATE TABLE `mascotas` (
  `id` int(10) NOT NULL,
  `usuario_id` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `especie` varchar(50) NOT NULL,
  `raza` varchar(50) NOT NULL,
  `fecha_nacimiento` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mascotas`
--

INSERT INTO `mascotas` (`id`, `usuario_id`, `nombre`, `especie`, `raza`, `fecha_nacimiento`) VALUES
(1, 5, 'mpol', 'perro', 'labrador', '2025-11-10'),
(2, 7, 'Bebé daysi', 'Pato', 'muscoby', '2021-02-10'),
(3, 5, 'perro1', 'perro', 'persa', '2025-11-01'),
(7, 5, 'perro2', 'perro', 'persa', '2025-11-01'),
(8, 8, 'Cookie', 'perro', 'salchicha', '2017-01-26'),
(11, 8, 'Cookie2', 'gato', 'muscoby', '2025-11-20'),
(12, 5, 'Bebé daysi', 'perro', 'muscoby', '2025-11-26'),
(13, 9, 'Manchas', 'perro', 'malish', '2024-01-25'),
(14, 5, 'asdasdasdas', 'gato', 'aaaaa', '2025-11-06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `correo` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  `tipo` enum('admin','cliente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellidos`, `correo`, `contrasena`, `telefono`, `tipo`) VALUES
(3, 'Jareth', 'Moo', 'jarethmoo@gmail.com', '$2y$10$A/BuRC1s6GULKGll6.rd3e6mtln9WDaG8/A3D899lnWSLIBDm4p2q', NULL, 'admin'),
(5, 'a', 'a', 'a@a', '$2y$10$N83ihRrPBv.gbkqmkXdM9O8rsiAlihXQDBAZnb8wpO5FWdVayvqGm', '12', 'cliente'),
(6, 'Braulio', 'Cuevas', 'Braulio@correo', '$2y$10$RrTCfYVmqtzJdFnV9sXtdu7l0GAe67lhgDaBTFWldQkLNuF8KZ5Re', '123', 'cliente'),
(7, 'Pablo', 'Martínez', 'pablo@correo', '$2y$10$7vPfxESRNJOiicdf8nj5U.bSXx/Mo45h0Blu0rXoYUWIqMJNC9E6.', '', 'cliente'),
(8, 'capi', 'madera', 'capi@madera', '$2y$10$664XeZkdCBtHCw9Y5xWIyu8tEfEca6lXJw8hiXfQtRluVzBX1PEV2', '9999', 'cliente'),
(9, 'Elizabeth', 'Ramayo', 'a23201690@alumnos.uady.mx', '$2y$10$2Rwds89m57tg0uhzKQgQ3umIz8KmUySpIVYg9lia7WWL1dQ5hdliC', '', 'cliente'),
(16, 'Martin', 'Pool Chuc', 'martin@pool.com', '$2y$10$Tj6CNFZu2/.dTr0Ll3zVwOVo4ErbDPG7BGIs48rkpuDW3x3aN/lwO', '0393939', 'cliente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mascota_id` (`mascota_id`);

--
-- Indices de la tabla `historiales`
--
ALTER TABLE `historiales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mascota_id` (`mascota_id`);

--
-- Indices de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_usuario_mascota_nombre` (`usuario_id`,`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `historiales`
--
ALTER TABLE `historiales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`mascota_id`) REFERENCES `mascotas` (`id`);

--
-- Filtros para la tabla `historiales`
--
ALTER TABLE `historiales`
  ADD CONSTRAINT `historiales_ibfk_1` FOREIGN KEY (`mascota_id`) REFERENCES `mascotas` (`id`);

--
-- Filtros para la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD CONSTRAINT `mascotas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

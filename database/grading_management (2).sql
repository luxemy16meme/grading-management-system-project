-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 19, 2025 at 06:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `grading_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `grade_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `teachers_id` int(11) NOT NULL,
  `semester` varchar(20) NOT NULL,
  `midterm` decimal(5,2) DEFAULT NULL,
  `final` decimal(5,2) DEFAULT NULL,
  `average` decimal(5,2) DEFAULT NULL,
  `remarks` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grades`
--

INSERT INTO `grades` (`grade_id`, `student_id`, `teachers_id`, `semester`, `midterm`, `final`, `average`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 5, 5, '1st', 0.00, 0.00, 0.00, 'FAILED', '2025-11-19 11:48:36', '2025-11-19 15:02:18'),
(2, 4, 5, '1st', 88.00, 90.00, 89.00, 'PASSED', '2025-11-19 11:48:36', '2025-11-19 14:24:58'),
(10, 5, 5, '2nd', 92.00, 90.00, 91.00, 'PASSED', '2025-11-19 13:33:13', '2025-11-19 13:33:13'),
(11, 4, 5, '2nd', 89.00, 91.00, 90.00, 'PASSED', '2025-11-19 13:33:13', '2025-11-19 13:33:13'),
(17, 7, 5, '1st', 70.00, 70.00, 70.00, 'FAILED', '2025-11-19 13:52:44', '2025-11-19 13:53:31');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `student_number` varchar(50) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `year_level` varchar(20) DEFAULT NULL,
  `section` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`student_id`, `student_number`, `fullname`, `year_level`, `section`, `password`) VALUES
(1, 'ST10001IT', 'Maria Clara de los Santos', '2', 'B', 'ji741a8f'),
(2, 'ST1002IT', 'Jack Stone', '2', 'B', 'u1onfbwi'),
(4, 'ST10003IT', 'Liza Besera', '1', 'C', 'oixbnbja'),
(5, 'ST10004IT', 'Hannah Kuradang', '1', 'C', 'zuby3v3c'),
(7, 'ST10007IT', 'Kate Mercado', '1', 'C', '05sk3w0m');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  `teachers_id` int(11) DEFAULT NULL,
  `semester` varchar(20) DEFAULT NULL,
  `school_year` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `super_admins`
--

CREATE TABLE `super_admins` (
  `admin_id` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `super_admins`
--

INSERT INTO `super_admins` (`admin_id`, `fullname`, `email`, `password`) VALUES
(1, '', 'sysadmin', 'sysadmin');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `teachers_id` int(11) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `status` enum('pending','rejected','approved') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`teachers_id`, `fullName`, `email`, `password`, `department`, `status`, `created_at`) VALUES
(1, 'Hannah Noraine', 'hana@gmail.com', '$2b$10$8iJkXkhVB1IHLa8KQqMMBetfLXyVfdlqAaUJVQyJVKLn4gXoaTt5a', 'HM', 'approved', '2025-11-09 07:04:08'),
(3, 'Janjan', 'janjan@gmail.com', '$2b$10$yyBhUmnhOZxdHpx6m37wl.J4mh8sVwspZ2wkFIAjjzfsQIuERHhXm', 'IT', 'approved', '2025-11-09 09:35:09'),
(4, 'Michelle Mae', 'mae@gmail.com', '$2b$10$4qMq5.poFOOV1rDCJDzEaO3oBfiqALMXXv9YQLUZZQQ1nv.iaqFdC', 'HM', 'approved', '2025-11-10 04:48:34'),
(5, 'Jarey Fel Macuya', 'jarreey@gmail.com', '$2b$10$7hwCuB7.CLbkJVrosDfTrOx5I6Lf4xxH1/FrK9Q4DE1GPfjwsWAcS', 'IT', 'approved', '2025-11-11 10:15:43'),
(6, 'Emily Macadome', 'emi@gmail.com', '$2b$10$ly9QuuxQFE9qSr6lqqopE.923iZ3xwpFZO9Cm46DORtcg/r2MYgYe', 'IT', 'approved', '2025-11-19 16:55:42');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_assignments`
--

CREATE TABLE `teacher_assignments` (
  `id` int(11) NOT NULL,
  `teachers_id` int(11) NOT NULL,
  `year_level` int(11) NOT NULL,
  `section` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher_assignments`
--

INSERT INTO `teacher_assignments` (`id`, `teachers_id`, `year_level`, `section`, `created_at`) VALUES
(1, 1, 1, 'A', '2025-11-19 11:02:31'),
(2, 1, 1, 'B', '2025-11-19 11:02:38'),
(3, 5, 1, 'C', '2025-11-19 11:03:34'),
(4, 5, 1, 'D', '2025-11-19 11:03:39'),
(5, 1, 1, 'E', '2025-11-19 16:56:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`grade_id`),
  ADD UNIQUE KEY `unique_student_grade` (`student_id`,`teachers_id`,`semester`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `student_number` (`student_number`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`),
  ADD KEY `teachers_id` (`teachers_id`);

--
-- Indexes for table `super_admins`
--
ALTER TABLE `super_admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`teachers_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `teacher_assignments`
--
ALTER TABLE `teacher_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teachers_id` (`teachers_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `grades`
--
ALTER TABLE `grades`
  MODIFY `grade_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `super_admins`
--
ALTER TABLE `super_admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `teachers_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `teacher_assignments`
--
ALTER TABLE `teacher_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `teacher_assignments`
--
ALTER TABLE `teacher_assignments`
  ADD CONSTRAINT `teacher_assignments_ibfk_1` FOREIGN KEY (`teachers_id`) REFERENCES `teachers` (`teachers_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

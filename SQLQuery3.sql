-- =======================================================
-- ШАГ 1: УДАЛЕНИЕ СТАРОЙ БАЗЫ ИЗ СИСТЕМЫ
-- =======================================================
USE master;
GO

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'HotelBookingDB')
BEGIN
    ALTER DATABASE HotelBookingDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE HotelBookingDB;
    PRINT 'Старая база удалена из системы.';
END
GO

-- =======================================================
-- ШАГ 2: СОЗДАНИЕ БАЗЫ С НОВЫМИ ИМЕНАМИ ФАЙЛОВ
-- (чтобы обойти заблокированные старые файлы)
-- =======================================================
CREATE DATABASE HotelBookingDB
ON PRIMARY (
    NAME = 'HotelBookingDB_v2',
    FILENAME = 'C:\Users\HUAWEI\HotelBookingDB_v2.mdf',
    SIZE = 10MB,
    MAXSIZE = 200MB,
    FILEGROWTH = 10MB
)
LOG ON (
    NAME = 'HotelBookingDB_v2_log',
    FILENAME = 'C:\Users\HUAWEI\HotelBookingDB_v2_log.ldf',
    SIZE = 5MB,
    MAXSIZE = 100MB,
    FILEGROWTH = 10MB
);
GO

PRINT 'База создана с новыми файлами.';
GO

USE HotelBookingDB;
GO

-- =======================================================
-- ШАГ 3: СОЗДАНИЕ ТАБЛИЦ
-- =======================================================

CREATE TABLE Country (
    country_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE City (
    city_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_id INT NOT NULL,
    CONSTRAINT FK_City_Country FOREIGN KEY (country_id) REFERENCES Country(country_id)
);

CREATE TABLE Hotel (
    hotel_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    stars INT CHECK (stars BETWEEN 1 AND 5),
    city_id INT NOT NULL,
    CONSTRAINT FK_Hotel_City FOREIGN KEY (city_id) REFERENCES City(city_id)
);

CREATE TABLE RoomType (
    room_type_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Room (
    room_id INT IDENTITY(1,1) PRIMARY KEY,
    number VARCHAR(10) NOT NULL,
    hotel_id INT NOT NULL,
    room_type_id INT NOT NULL,
    is_available BIT DEFAULT 1,
    CONSTRAINT FK_Room_Hotel FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id),
    CONSTRAINT FK_Room_Type FOREIGN KEY (room_type_id) REFERENCES RoomType(room_type_id)
);

CREATE TABLE [User] (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE Booking (
    booking_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'New',
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Booking_User FOREIGN KEY (user_id) REFERENCES [User](user_id),
    CONSTRAINT FK_Booking_Room FOREIGN KEY (room_id) REFERENCES Room(room_id)
);

CREATE TABLE Payment (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(50),
    status VARCHAR(50),
    paid_at DATETIME,
    CONSTRAINT FK_Payment_Booking FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);
GO
PRINT 'Все таблицы созданы.';
GO

-- =======================================================
-- ШАГ 4: ВСТАВКА СТРАН (ЯВНЫЕ ID)
-- =======================================================
SET IDENTITY_INSERT Country ON;
INSERT INTO Country (country_id, name) VALUES 
(1, 'Россия'), (2, 'США'), (3, 'Германия'), (4, 'Франция'), (5, 'Италия'), 
(6, 'Испания'), (7, 'Великобритания'), (8, 'Китай'), (9, 'Япония'), (10, 'Бразилия'),
(11, 'Канада'), (12, 'Австралия'), (13, 'Индия'), (14, 'Турция'), (15, 'Египет'),
(16, 'Таиланд'), (17, 'Мексика'), (18, 'Аргентина'), (19, 'ЮАР'), (20, 'Южная Корея');
SET IDENTITY_INSERT Country OFF;
PRINT '20 стран добавлено.';
GO

-- =======================================================
-- ШАГ 5: ВСТАВКА ГОРОДОВ (ЯВНЫЕ ID)
-- =======================================================
SET IDENTITY_INSERT City ON;
INSERT INTO City (city_id, name, country_id) VALUES 
-- Россия (1)
(1, 'Москва', 1), (2, 'Санкт-Петербург', 1), (3, 'Казань', 1),
-- США (2)
(4, 'Нью-Йорк', 2), (5, 'Лос-Анджелес', 2), (6, 'Чикаго', 2), (7, 'Майами', 2),
-- Германия (3)
(8, 'Берлин', 3), (9, 'Мюнхен', 3), (10, 'Гамбург', 3),
-- Франция (4)
(11, 'Париж', 4), (12, 'Марсель', 4), (13, 'Лион', 4),
-- Италия (5)
(14, 'Рим', 5), (15, 'Милан', 5), (16, 'Венеция', 5), (17, 'Флоренция', 5),
-- Испания (6)
(18, 'Мадрид', 6), (19, 'Барселона', 6), (20, 'Валенсия', 6),
-- Великобритания (7)
(21, 'Лондон', 7), (22, 'Манчестер', 7), (23, 'Эдинбург', 7),
-- Китай (8)
(24, 'Пекин', 8), (25, 'Шанхай', 8), (26, 'Гонконг', 8), (27, 'Шэньчжэнь', 8),
-- Япония (9)
(28, 'Токио', 9), (29, 'Осака', 9), (30, 'Киото', 9),
-- Бразилия (10)
(31, 'Рио-де-Жанейро', 10), (32, 'Сан-Паулу', 10), (33, 'Сальвадор', 10),
-- Канада (11)
(34, 'Торонто', 11), (35, 'Ванкувер', 11), (36, 'Монреаль', 11),
-- Австралия (12)
(37, 'Сидней', 12), (38, 'Мельбурн', 12), (39, 'Брисбен', 12),
-- Индия (13)
(40, 'Мумбаи', 13), (41, 'Дели', 13), (42, 'Бангалор', 13),
-- Турция (14)
(43, 'Стамбул', 14), (44, 'Анталья', 14), (45, 'Анкара', 14),
-- Египет (15)
(46, 'Каир', 15), (47, 'Александрия', 15), (48, 'Хургада', 15),
-- Таиланд (16)
(49, 'Бангкок', 16), (50, 'Пхукет', 16), (51, 'Паттайя', 16),
-- Мексика (17)
(52, 'Мехико', 17), (53, 'Канкун', 17), (54, 'Гвадалахара', 17),
-- Аргентина (18)
(55, 'Буэнос-Айрес', 18), (56, 'Кордова', 18), (57, 'Росарио', 18),
-- ЮАР (19)
(58, 'Кейптаун', 19), (59, 'Йоханнесбург', 19), (60, 'Дурбан', 19),
-- Южная Корея (20)
(61, 'Сеул', 20), (62, 'Пусан', 20), (63, 'Инчхон', 20);
SET IDENTITY_INSERT City OFF;
PRINT '63 города добавлено.';
GO

-- =======================================================
-- ШАГ 6: ТИПЫ КОМНАТ (ЯВНЫЕ ID)
-- =======================================================
SET IDENTITY_INSERT RoomType ON;
INSERT INTO RoomType (room_type_id, name, capacity, price_per_night) VALUES 
(1, 'Standard', 2, 100.00),
(2, 'Deluxe', 3, 200.00),
(3, 'Suite', 4, 350.00),
(4, 'Economy', 1, 50.00);
SET IDENTITY_INSERT RoomType OFF;
PRINT 'Типы комнат добавлены.';
GO

-- =======================================================
-- ШАГ 7: ОТЕЛИ (ЯВНЫЕ ID)
-- =======================================================
SET IDENTITY_INSERT Hotel ON;
INSERT INTO Hotel (hotel_id, name, address, stars, city_id) VALUES 
(1, 'Grand Hotel Moscow', 'ул. Тверская, 1', 5, 1),
(2, 'Budget Inn SPb', 'Невский пр., 10', 3, 2),
(3, 'Sunset Resort', 'Ocean Drive, 5', 4, 7),
(4, 'Berlin Central', 'Unter den Linden, 2', 4, 8),
(5, 'Tokyo Tower View', 'Minato-ku, 3', 5, 28);
SET IDENTITY_INSERT Hotel OFF;
PRINT 'Отели добавлены.';
GO

-- =======================================================
-- ШАГ 8: КОМНАТЫ (ЯВНЫЕ ID)
-- =======================================================
SET IDENTITY_INSERT Room ON;
INSERT INTO Room (room_id, number, hotel_id, room_type_id, is_available) VALUES 
(1, '101', 1, 1, 1),
(2, '102', 1, 1, 1),
(3, '201', 1, 2, 1),
(4, '301', 1, 3, 1),
(5, '1A', 2, 4, 1),
(6, '1B', 2, 4, 1),
(7, '2A', 2, 1, 1),
(8, '501', 3, 2, 1),
(9, '502', 3, 2, 1),
(10, '601', 3, 3, 1);
SET IDENTITY_INSERT Room OFF;
PRINT 'Комнаты добавлены.';
GO

-- =======================================================
-- ШАГ 9: ПОЛЬЗОВАТЕЛИ (ЯВНЫЕ ID)
-- =======================================================
SET IDENTITY_INSERT [User] ON;
INSERT INTO [User] (user_id, full_name, email, phone, password_hash) VALUES 
(1, 'Иван Иванов', 'ivan@example.com', '+79991112233', 'hash123'),
(2, 'John Doe', 'john@example.com', '+15556667788', 'hash456'),
(3, 'Maria Garcia', 'maria@example.com', '+34999888777', 'hash789');
SET IDENTITY_INSERT [User] OFF;
PRINT 'Пользователи добавлены.';
GO

-- =======================================================
-- ШАГ 10: БРОНИРОВАНИЯ (ЯВНЫЕ ID)
-- =======================================================
SET IDENTITY_INSERT Booking ON;
INSERT INTO Booking (booking_id, user_id, room_id, check_in, check_out, status) VALUES 
(1, 1, 1, '2024-06-01', '2024-06-05', 'Confirmed'),
(2, 2, 10, '2024-07-10', '2024-07-15', 'New');
SET IDENTITY_INSERT Booking OFF;
PRINT 'Бронирования добавлены.';
GO

-- =======================================================
-- ШАГ 11: ПЛАТЕЖИ (ЯВНЫЕ ID)
-- =======================================================
SET IDENTITY_INSERT Payment ON;
INSERT INTO Payment (payment_id, booking_id, amount, method, status, paid_at) VALUES 
(1, 1, 400.00, 'Credit Card', 'Paid', GETDATE());
SET IDENTITY_INSERT Payment OFF;
PRINT 'Платежи добавлены.';
GO

-- =======================================================
-- ШАГ 12: ПРОВЕРКА
-- =======================================================
PRINT '=== Количество стран и городов ===';
SELECT c.name AS Country, COUNT(ci.city_id) AS City_Count
FROM Country c
JOIN City ci ON c.country_id = ci.country_id
GROUP BY c.name
ORDER BY c.name;
GO

PRINT '=== Отели и комнаты ===';
SELECT 
    co.name AS Country,
    ci.name AS City,
    h.name AS Hotel,
    h.stars AS Stars,
    r.number AS Room_Num,
    rt.name AS Room_Type,
    rt.price_per_night AS Price
FROM Hotel h
JOIN City ci ON h.city_id = ci.city_id
JOIN Country co ON ci.country_id = co.country_id
JOIN Room r ON h.hotel_id = r.hotel_id
JOIN RoomType rt ON r.room_type_id = rt.room_type_id
ORDER BY co.name, ci.name, h.name;
GO

PRINT '=== Бронирования ===';
SELECT 
    b.booking_id,
    u.full_name AS Client,
    h.name AS Hotel,
    r.number AS Room,
    b.check_in,
    b.check_out,
    b.status AS Booking_Status,
    p.amount AS Paid_Amount,
    p.status AS Payment_Status
FROM Booking b
JOIN [User] u ON b.user_id = u.user_id
JOIN Room r ON b.room_id = r.room_id
JOIN Hotel h ON r.hotel_id = h.hotel_id
LEFT JOIN Payment p ON b.booking_id = p.booking_id;
GO

PRINT '=== ВСЁ ГОТОВО, БРАТ! ===';
GO
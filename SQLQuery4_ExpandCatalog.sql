/*
  Расширение каталога HotelBookingDB.
  Запускать ПОСЛЕ SQLQuery3.sql в Microsoft SQL Server.
  Скрипт идемпотентный: повторный запуск не добавляет дубликаты,
  если в городе уже есть 3 отеля и у отеля уже есть 3 номера.
*/
USE HotelBookingDB;
GO
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;

DECLARE @cityId INT;
DECLARE @cityName VARCHAR(100);
DECLARE @hotelCount INT;
DECLARE @hotelNumber INT;
DECLARE @newHotelId INT;
DECLARE @roomNumber INT;

DECLARE city_cursor CURSOR LOCAL FAST_FORWARD FOR
    SELECT city_id, name FROM City ORDER BY city_id;

OPEN city_cursor;
FETCH NEXT FROM city_cursor INTO @cityId, @cityName;

WHILE @@FETCH_STATUS = 0
BEGIN
    SELECT @hotelCount = COUNT(*) FROM Hotel WHERE city_id = @cityId;

    WHILE @hotelCount < 3
    BEGIN
        SET @hotelNumber = @hotelCount + 1;

        INSERT INTO Hotel (name, address, stars, city_id)
        VALUES (
            CONCAT('Aurora ', @cityName, ' ', @hotelNumber),
            CONCAT('Central street, ', @hotelNumber),
            CASE @hotelNumber WHEN 1 THEN 4 WHEN 2 THEN 3 ELSE 5 END,
            @cityId
        );

        SET @newHotelId = CONVERT(INT, SCOPE_IDENTITY());

        SET @roomNumber = 1;
        WHILE @roomNumber <= 3
        BEGIN
            INSERT INTO Room (number, hotel_id, room_type_id, is_available)
            VALUES (
                CONCAT('H', @newHotelId, '-', @roomNumber),
                @newHotelId,
                CASE @roomNumber WHEN 1 THEN 1 WHEN 2 THEN 2 ELSE 3 END,
                1
            );
            SET @roomNumber += 1;
        END;

        SET @hotelCount += 1;
    END;

    FETCH NEXT FROM city_cursor INTO @cityId, @cityName;
END;

CLOSE city_cursor;
DEALLOCATE city_cursor;

/* Добираем номера для уже существующих отелей, у которых их меньше трёх. */
DECLARE @hotelId INT;
DECLARE @roomCount INT;

DECLARE hotel_cursor CURSOR LOCAL FAST_FORWARD FOR
    SELECT hotel_id FROM Hotel ORDER BY hotel_id;

OPEN hotel_cursor;
FETCH NEXT FROM hotel_cursor INTO @hotelId;

WHILE @@FETCH_STATUS = 0
BEGIN
    SELECT @roomCount = COUNT(*) FROM Room WHERE hotel_id = @hotelId;

    WHILE @roomCount < 3
    BEGIN
        SET @roomNumber = @roomCount + 1;

        INSERT INTO Room (number, hotel_id, room_type_id, is_available)
        VALUES (
            CONCAT('H', @hotelId, '-', @roomNumber),
            @hotelId,
            CASE @roomNumber WHEN 1 THEN 1 WHEN 2 THEN 2 ELSE 3 END,
            1
        );

        SET @roomCount += 1;
    END;

    FETCH NEXT FROM hotel_cursor INTO @hotelId;
END;

CLOSE hotel_cursor;
DEALLOCATE hotel_cursor;

COMMIT TRANSACTION;
GO

/* Контрольный отчёт: в каждой строке должно быть Hotel_Count >= 3 и Room_Count >= 3. */
WITH HotelRoomCounts AS (
    SELECT h.hotel_id, h.city_id, COUNT(r.room_id) AS Room_Count
    FROM Hotel h
    LEFT JOIN Room r ON r.hotel_id = h.hotel_id
    GROUP BY h.hotel_id, h.city_id
)
SELECT
    c.city_id,
    c.name AS City,
    COUNT(hr.hotel_id) AS Hotel_Count,
    MIN(COALESCE(hr.Room_Count, 0)) AS Min_Rooms_Per_Hotel
FROM City c
LEFT JOIN HotelRoomCounts hr ON hr.city_id = c.city_id
GROUP BY c.city_id, c.name
ORDER BY c.city_id;
GO

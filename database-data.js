/*
 * Front-end seed, собранный из SQLQuery3.sql.
 * Браузер не подключается к SQL Server напрямую; этот слой временно имитирует
 * ответ API и будет заменён fetch-запросами после появления backend.
 */
window.AURORA_DB = {
  countries: [
    {id:1,name:'Россия',cities:[{id:1,name:'Москва'},{id:2,name:'Санкт-Петербург'},{id:3,name:'Казань'}]},
    {id:2,name:'США',cities:[{id:4,name:'Нью-Йорк'},{id:5,name:'Лос-Анджелес'},{id:6,name:'Чикаго'},{id:7,name:'Майами'}]},
    {id:3,name:'Германия',cities:[{id:8,name:'Берлин'},{id:9,name:'Мюнхен'},{id:10,name:'Гамбург'}]},
    {id:4,name:'Франция',cities:[{id:11,name:'Париж'},{id:12,name:'Марсель'},{id:13,name:'Лион'}]},
    {id:5,name:'Италия',cities:[{id:14,name:'Рим'},{id:15,name:'Милан'},{id:16,name:'Венеция'},{id:17,name:'Флоренция'}]},
    {id:6,name:'Испания',cities:[{id:18,name:'Мадрид'},{id:19,name:'Барселона'},{id:20,name:'Валенсия'}]},
    {id:7,name:'Великобритания',cities:[{id:21,name:'Лондон'},{id:22,name:'Манчестер'},{id:23,name:'Ливерпуль'}]},
    {id:8,name:'Китай',cities:[{id:24,name:'Пекин'},{id:25,name:'Шанхай'},{id:26,name:'Гуанчжоу'},{id:27,name:'Шэньчжэнь'}]},
    {id:9,name:'Япония',cities:[{id:28,name:'Токио'},{id:29,name:'Киото'},{id:30,name:'Осака'}]},
    {id:10,name:'Бразилия',cities:[{id:31,name:'Рио-де-Жанейро'},{id:32,name:'Сан-Паулу'},{id:33,name:'Форталеза'}]},
    {id:11,name:'Канада',cities:[{id:34,name:'Торонто'},{id:35,name:'Монреаль'},{id:36,name:'Ванкувер'}]},
    {id:12,name:'Австралия',cities:[{id:37,name:'Сидней'},{id:38,name:'Мельбурн'},{id:39,name:'Брисбен'}]},
    {id:13,name:'Индия',cities:[{id:40,name:'Мумбаи'},{id:41,name:'Дели'},{id:42,name:'Бангалор'}]},
    {id:14,name:'Турция',cities:[{id:43,name:'Стамбул'},{id:44,name:'Анталья'},{id:45,name:'Анкара'}]},
    {id:15,name:'Египет',cities:[{id:46,name:'Каир'},{id:47,name:'Александрия'},{id:48,name:'Хургада'}]},
    {id:16,name:'Таиланд',cities:[{id:49,name:'Бангкок'},{id:50,name:'Пхукет'},{id:51,name:'Паттайя'}]},
    {id:17,name:'Мексика',cities:[{id:52,name:'Мехико'},{id:53,name:'Канкун'},{id:54,name:'Гвадалахара'}]},
    {id:18,name:'Аргентина',cities:[{id:55,name:'Буэнос-Айрес'},{id:56,name:'Кордова'},{id:57,name:'Мендоса'}]},
    {id:19,name:'ОАЭ',cities:[{id:58,name:'Абу-Даби'},{id:59,name:'Рас-эль-Хайма'},{id:60,name:'Шарджа'}]},
    {id:20,name:'Южная Корея',cities:[{id:61,name:'Сеул'},{id:62,name:'Пусан'},{id:63,name:'Инчхон'}]}
  ],
  roomTypes: [
    {id:1,name:'Standard',capacity:2,price:100},
    {id:2,name:'Deluxe',capacity:3,price:200},
    {id:3,name:'Suite',capacity:4,price:350},
    {id:4,name:'Economy',capacity:1,price:50}
  ],
  hotels: [
    {id:1,name:'Grand Hotel Moscow',cityId:1,address:'ул. Тверская, 1',stars:5,rooms:[{id:1,number:'101',typeId:1},{id:2,number:'102',typeId:1},{id:3,number:'201',typeId:2},{id:4,number:'301',typeId:3}]},
    {id:2,name:'Budget Inn SPb',cityId:2,address:'Невский пр., 10',stars:3,rooms:[{id:5,number:'1A',typeId:4},{id:6,number:'1B',typeId:4},{id:7,number:'2A',typeId:1}]},
    {id:3,name:'Sunset Resort',cityId:7,address:'Ocean Drive, 5',stars:4,rooms:[{id:8,number:'501',typeId:2},{id:9,number:'502',typeId:2},{id:10,number:'601',typeId:3}]},
    {id:4,name:'Berlin Central',cityId:8,address:'Unter den Linden, 2',stars:4,rooms:[]},
    {id:5,name:'Tokyo Tower View',cityId:28,address:'Minato-ku, 3',stars:5,rooms:[]}
  ]
};

/* Та же бизнес-логика, что и в SQLQuery4_ExpandCatalog.sql:
   у каждого города минимум 3 отеля, у каждого отеля минимум 3 номера. */
(() => {
  const db = window.AURORA_DB;
  let nextHotelId = Math.max(...db.hotels.map(hotel => hotel.id)) + 1;
  let nextRoomId = Math.max(...db.hotels.flatMap(hotel => hotel.rooms.map(room => room.id)), 0) + 1;
  const hotelsByCity = cityId => db.hotels.filter(hotel => hotel.cityId === cityId);
  db.countries.flatMap(country => country.cities).forEach(city => {
    const cityHotels = hotelsByCity(city.id);
    while (cityHotels.length < 3) {
      const number = cityHotels.length + 1;
      const hotelId = nextHotelId++;
      const rooms = [1,2,3].map(roomNumber => ({id:nextRoomId++,number:`H${hotelId}-${roomNumber}`,typeId:roomNumber}));
      const hotel = {id:hotelId,name:`Aurora ${city.name} ${number}`,address:`Central street, ${number}`,stars:number===1?4:number===2?3:5,cityId:city.id,rooms};
      db.hotels.push(hotel);
      cityHotels.push(hotel);
    }
  });
  db.hotels.forEach(hotel => {
    while (hotel.rooms.length < 3) {
      const roomNumber = hotel.rooms.length + 1;
      hotel.rooms.push({id:nextRoomId++,number:`H${hotel.id}-${roomNumber}`,typeId:roomNumber});
    }
  });
})();

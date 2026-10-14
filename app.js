document.documentElement.classList.add('js');
const demoHotels = [
  {id:1,name:'Сибирь House',city:'Новосибирск · Центр',stars:5,rating:'4.9',reviews:284,price:8900,type:'city',image:'image-one',tag:'Выбор гостей',room:'Делюкс с видом на город',description:'Спокойный дизайнерский отель в историческом центре — рядом с театром и лучшими кофейнями.',amenities:['Завтрак включён','Wi-Fi 500 Мбит/с','Парковка','Поздний выезд'],cancel:'Бесплатная отмена до 12 июня'},
  {id:2,name:'Riverline Hotel',city:'Новосибирск · Набережная',stars:4,rating:'4.8',reviews:191,price:6700,type:'city',image:'image-two',tag:'Выгодная цена',room:'Стандарт с завтраком',description:'Светлые номера с видом на набережную Оби и быстрым доступом к деловому центру.',amenities:['Завтрак включён','Вид на реку','Wi-Fi','Коворкинг'],cancel:'Бесплатная отмена до 10 июня'},
  {id:3,name:'Moss & Stone',city:'Новосибирск · Академгородок',stars:5,rating:'4.9',reviews:156,price:11200,type:'quiet',image:'image-three',tag:'Тихий район',room:'Панорамный люкс',description:'Камерный отель среди сосен для тех, кто хочет замедлиться и выдохнуть после дороги.',amenities:['Спа-зона','Завтрак включён','Трансфер','Терраса'],cancel:'Бесплатная отмена до 8 июня'},
  {id:4,name:'Точка Севера',city:'Новосибирск · Центр',stars:4,rating:'4.7',reviews:128,price:5800,type:'city',image:'image-four',tag:'Рядом с метро',room:'Комфорт',description:'Практичный вариант для деловых поездок: метро в двух минутах, ранний завтрак и тихий двор.',amenities:['Рядом с метро','Ранний завтрак','Wi-Fi','Круглосуточная стойка'],cancel:'Бесплатная отмена до 9 июня'},
  {id:5,name:'Дом на Обском',city:'Бердск · У воды',stars:4,rating:'4.8',reviews:97,price:7600,type:'quiet',image:'image-five',tag:'Для отдыха',room:'Номер с террасой',description:'Загородный дом у воды с собственной террасой — хороший повод остаться ещё на выходные.',amenities:['Выход к воде','Терраса','Прокат велосипедов','Мангал'],cancel:'Бесплатная отмена до 6 июня'},
  {id:6,name:'Aster Boutique',city:'Новосибирск · Тихий центр',stars:5,rating:'4.9',reviews:211,price:9800,type:'quiet',image:'image-six',tag:'Новинка',room:'Премиум',description:'Небольшой бутик-отель с выразительными интерьерами, локальными завтраками и внимательным сервисом.',amenities:['Авторские завтраки','Wi-Fi','Библиотека','Pet-friendly'],cancel:'Бесплатная отмена до 11 июня'}
];

const db = window.AURORA_DB;
const cityIndex = Object.fromEntries(db.countries.flatMap(country => country.cities.map(city => [city.id, {name:city.name,country:country.name}])));
const roomTypeIndex = Object.fromEntries(db.roomTypes.map(type => [type.id, type]));
const hotelMeta = {
  1:{rating:'4.9',reviews:284,image:'image-one',tag:'Выбор гостей',type:'city',description:'Классический отель в самом центре Москвы — рядом с театрами, музеями и лучшими кофейнями.',amenities:['Wi-Fi','Завтрак','Парковка','Поздний выезд']},
  2:{rating:'4.5',reviews:122,image:'image-two',tag:'Выгодная цена',type:'city',description:'Практичный вариант на Невском проспекте для коротких поездок и деловых встреч.',amenities:['Wi-Fi','Рядом с метро','Круглосуточная стойка','Камера хранения']},
  3:{rating:'4.8',reviews:191,image:'image-three',tag:'У воды',type:'quiet',description:'Курортный отель с видом на океан, просторными номерами и тёплым вечерним светом.',amenities:['Вид на воду','Бассейн','Трансфер','Завтрак']},
  4:{rating:'4.7',reviews:156,image:'image-four',tag:'В центре',type:'city',description:'Городской отель рядом с главными площадями Берлина и удобным транспортом.',amenities:['Wi-Fi','Коворкинг','Ранний заезд','Завтрак']},
  5:{rating:'4.9',reviews:211,image:'image-six',tag:'Выбор гостей',type:'quiet',description:'Панорамный вид на Токио и быстрый доступ к деловым кварталам Минато.',amenities:['Вид на город','Wi-Fi','Ресторан','Консьерж']}
};
const generatedImages = ['image-one','image-two','image-three','image-four','image-five','image-six'];
const generatedPhotos = ['assets/hotels/hotel-moscow.png','assets/hotels/hotel-riverside.png','assets/hotels/hotel-resort.png'];
const generatedRoomPhotos = ['assets/hotels/room-deluxe.png','assets/hotels/room-standard.png','assets/hotels/room-suite.png'];
const originalPhotos = {1:'assets/hotels/hotel-moscow.png',2:'assets/hotels/hotel-riverside.png',3:'assets/hotels/hotel-resort.png',4:'assets/hotels/hotel-riverside.png',5:'assets/hotels/hotel-moscow.png'};
const originalRoomPhotos = {1:'assets/hotels/room-deluxe.png',2:'assets/hotels/room-standard.png',3:'assets/hotels/room-suite.png',4:'assets/hotels/room-standard.png',5:'assets/hotels/room-deluxe.png'};
const generatedTags = ['Удобное расположение','Выбор гостей','Выгодная цена','Спокойный район','Новый отель','Рядом с центром'];
const generatedAmenities = [
  ['Wi-Fi','Завтрак','Парковка','Стойка 24/7'],
  ['Wi-Fi','Трансфер','Кондиционер','Камера хранения'],
  ['Ресторан','Wi-Fi','Семейные номера','Поздний выезд'],
  ['Wi-Fi','Коворкинг','Завтрак','Ранний заезд']
];
const hotels = db.hotels.map(hotel => {
  const city = cityIndex[hotel.cityId] || {name:'Город не указан',country:''};
  const meta = hotelMeta[hotel.id] || {
    rating:(4.2+((hotel.id*7)%8)/10).toFixed(1),
    reviews:48+(hotel.id*37)%430,
    image:generatedImages[(hotel.id-1)%generatedImages.length],
    photo:generatedPhotos[(hotel.id-1)%generatedPhotos.length],
    roomImage:generatedRoomPhotos[(hotel.id-1)%generatedRoomPhotos.length],
    tag:generatedTags[(hotel.id-1)%generatedTags.length],
    type:hotel.id%3===0?'quiet':'city',
    description:`Комфортный отель в городе ${city.name}: удобная отправная точка для прогулок, отдыха и деловых поездок.`,
    amenities:generatedAmenities[(hotel.id-1)%generatedAmenities.length]
  };
  const rooms = hotel.rooms.map(room => ({...room,type:roomTypeIndex[room.typeId]}));
  const cheapest = rooms.slice().sort((a,b)=>a.type.price-b.type.price)[0];
  return {id:hotel.id,name:hotel.name,city:`${city.name} · ${city.country}`,address:hotel.address,stars:hotel.stars,rating:meta.rating,reviews:meta.reviews,price:cheapest?.type.price || 0,type:meta.type,imageClass:meta.image,photo:meta.photo || originalPhotos[hotel.id] || generatedPhotos[(hotel.id-1)%generatedPhotos.length],roomImage:meta.roomImage || originalRoomPhotos[hotel.id] || generatedRoomPhotos[(hotel.id-1)%generatedRoomPhotos.length],tag:meta.tag,room:cheapest ? `${cheapest.type.name} · до ${cheapest.type.capacity} гостей` : 'Номер по запросу',description:meta.description,amenities:meta.amenities,cancel:'Условия отмены зависят от выбранного тарифа',available:rooms.length>0,rooms};
});
const loadJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const saveJson = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { showToast('Не удалось сохранить данные в браузере'); return false; } };
const state = {filter:'all', destination:'Москва', bookings:loadJson('auroraBookings',[]), favorites:loadJson('auroraFavorites',[]), user:loadJson('auroraUser',null), sort:'recommended', lastFocused:null};
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const formatMoney = value => new Intl.NumberFormat('ru-RU').format(value) + ' у.е.';
const dateValue = offset => { const d=new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate()+offset); return d.toISOString().slice(0,10); };
const formatDate = value => new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'short'}).format(new Date(`${value}T12:00:00`));
const plural = (value, one, few, many) => value%10===1 && value%100!==11 ? one : value%10>=2 && value%10<=4 && (value%100<10 || value%100>=20) ? few : many;
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
const roomPhoto = room => generatedRoomPhotos[(Math.max(1, Number(room.typeId))-1)%generatedRoomPhotos.length];
function getTrip(){
  const checkIn=$('#check-in')?.value, checkOut=$('#check-out')?.value, guests=Number($('#guests')?.value || 1);
  const start=new Date(`${checkIn}T12:00:00`), end=new Date(`${checkOut}T12:00:00`), duration=Math.round((end-start)/86400000);
  return {checkIn,checkOut,guests,nights:Number.isFinite(duration)&&duration>0?duration:0};
}
function nights(){ return getTrip().nights || 1; }
function visibleHotels(){
  const query = state.destination.trim().toLowerCase();
  let visible = hotels.filter(h => {
    const category = state.filter==='all' || (state.filter==='5' && h.stars===5) || (state.filter==='4' && h.stars===4) || h.type===state.filter;
    const place = !query || `${h.name} ${h.city} ${h.description}`.toLowerCase().includes(query);
    return category && place;
  });
  if(state.sort==='price') visible.sort((a,b)=>a.price-b.price);
  if(state.sort==='rating') visible.sort((a,b)=>Number(b.rating)-Number(a.rating));
  return visible;
}
function renderHotels(){
  const matching = visibleHotels();
  const visible = matching;
  $('#result-count').textContent = matching.length ? `Показано ${visible.length} из ${matching.length}` : '0 вариантов';
  $('#hotel-grid').innerHTML = visible.map((h,index) => {
    const saved=state.favorites.includes(h.id);
    const priceLabel = h.price ? `<strong>${formatMoney(h.price)}</strong><small> / ночь</small>` : '<strong>По запросу</strong>';
    const action = h.available ? `<button class="book-link" type="button" data-book="${h.id}">Забронировать ↗</button>` : '<span class="availability-note">Номера по запросу</span>';
    const extraAmenities=h.amenities.length>2?`<span>+${h.amenities.length-2}</span>`:'';
    return `<article class="hotel-card reveal" data-tilt style="--reveal-delay:${Math.min(index*35,280)}ms"><div class="hotel-image ${h.imageClass}"><img src="${h.photo}" alt="${escapeHtml(h.name)}" loading="lazy" onerror="this.onerror=null;this.src='${generatedPhotos[index%generatedPhotos.length]}'" /><span class="hotel-badge">${escapeHtml(h.tag)}</span><button class="hotel-save ${saved?'saved':''}" type="button" aria-label="${saved?'Убрать из избранного':'Сохранить отель'}" data-save="${h.id}">${saved?'♥':'♡'}</button></div><div class="hotel-content"><div class="hotel-topline"><h3 class="hotel-name">${escapeHtml(h.name)}</h3><span class="rating">★ ${h.rating}</span></div><p class="hotel-city">${escapeHtml(h.city)} · ${'★'.repeat(h.stars)} <span class="review-count">(${h.reviews})</span></p><p class="hotel-description">${escapeHtml(h.description)}</p><div class="amenity-preview">${h.amenities.slice(0,2).map(item=>`<span>${escapeHtml(item)}</span>`).join('')}${extraAmenities}</div><div class="hotel-price"><div>${priceLabel}</div><div class="card-actions"><button class="details-link" type="button" data-details="${h.id}">Подробнее</button>${action}</div></div></div></article>`;
  }).join('');
  $('#empty-state').classList.toggle('hidden', visible.length>0);
  if(!visible.length){
    $('#empty-state').innerHTML=`<span>⌂</span><h3>В этом поиске пока пусто</h3><p>Попробуйте другой город или вернитесь к популярным направлениям.</p><div class="empty-suggestions"><button class="secondary-button" type="button" data-quick-location="Москва">Москва</button><button class="secondary-button" type="button" data-quick-location="Токио">Токио</button><button class="secondary-button" type="button" data-reset-search>Все варианты</button></div>`;
  } else {
    $('#empty-state').innerHTML='<span>⌂</span><h3>Ничего не нашлось</h3><p>Попробуйте выбрать другую категорию или город.</p><button class="secondary-button" type="button" data-reset-search>Сбросить фильтры</button>';
  }
  observeReveals();
}
function openModal(content){
  state.lastFocused=document.activeElement;
  $('#modal-body').innerHTML=content;
  $('#modal-backdrop').classList.remove('hidden');
  document.body.style.overflow='hidden';
  requestAnimationFrame(()=>$('.modal input, .modal button:not(.modal-close), .modal select')?.focus());
}
function closeModal(){
  $('#modal-backdrop').classList.add('hidden');
  $('#modal-body').innerHTML='';
  document.body.style.overflow='';
  if(state.lastFocused?.isConnected) state.lastFocused.focus();
}
const roomBenefits = room => {
  const benefits = {
    1:['Завтрак включён','Wi‑Fi до 500 Мбит/с','Рабочее место'],
    2:['Вид на город','Завтрак включён','Поздний выезд'],
    3:['Панорамный вид','Гостиная зона','Кофе-машина'],
    4:['Тихий этаж','Быстрое заселение','Wi‑Fi']
  };
  return benefits[room.typeId] || benefits[1];
};
function bookingRoomSelection(hotel){
  const trip=getTrip();
  if(!trip.nights){ showToast('Сначала выберите корректные даты поездки'); $('#search-form').reportValidity(); return; }
  const rooms=hotel.rooms.map(room=>{
    const fits=room.type.capacity>=trip.guests;
    return `<article class="room-choice ${fits?'':'room-unavailable'}"><img class="room-choice-photo" src="${roomPhoto(room)}" alt="${escapeHtml(room.type.name)} в отеле ${escapeHtml(hotel.name)}" /><div class="room-choice-main"><span class="room-number">Номер ${escapeHtml(room.number)}</span><strong>${escapeHtml(room.type.name)}</strong><small>до ${room.type.capacity} ${plural(room.type.capacity,'гостя','гостей','гостей')} · ${formatMoney(room.type.price)} / ночь</small><b>${formatMoney(room.type.price*trip.nights)} за ${trip.nights} ${plural(trip.nights,'ночь','ночи','ночей')}</b></div><div class="room-benefits">${roomBenefits(room).map(item=>`<span>✓ ${escapeHtml(item)}</span>`).join('')}</div>${fits?`<button class="primary-button room-select-button" type="button" data-room-select="${hotel.id}" data-room-id="${room.id}">Выбрать номер ↗</button>`:`<span class="capacity-warning">Не подходит для ${trip.guests} гостей</span>`}</article>`;
  }).join('');
  openModal(`<div class="booking-progress"><span class="active">1</span><i></i><span>2</span><i></i><span>3</span></div><p class="modal-kicker">Шаг 1 из 3 · Выбор номера</p><h2 id="modal-title">${escapeHtml(hotel.name)}</h2><p class="modal-sub">${escapeHtml(hotel.city)} · ${formatDate(trip.checkIn)} — ${formatDate(trip.checkOut)} · ${trip.guests} ${plural(trip.guests,'гость','гостя','гостей')}</p><div class="room-choice-list">${rooms}</div>`);
}
function openDetails(hotel){
  const priceLabel = hotel.price ? `${formatMoney(hotel.price)}` : 'Цена по запросу';
  const action = hotel.available ? `<button class="primary-button" type="button" data-book="${hotel.id}">Выбрать номер ↗</button>` : '<span class="availability-note">Свободные номера уточняются у администратора</span>';
  const roomList = hotel.rooms.length ? hotel.rooms.map(room=>`<div class="room-option"><img src="${roomPhoto(room)}" alt="${escapeHtml(room.type.name)}" /><span>№ ${escapeHtml(room.number)}</span><strong>${escapeHtml(room.type.name)}</strong><small>до ${room.type.capacity} гостей · ${formatMoney(room.type.price)}</small><button class="book-link" type="button" data-room-select="${hotel.id}" data-room-id="${room.id}">Выбрать</button></div>`).join('') : '<p class="no-rooms">Номера для этого отеля ещё не добавлены в таблицу Room.</p>';
  openModal(`<div class="detail-hero ${hotel.imageClass}"><img src="${hotel.roomImage}" alt="Номер в отеле ${hotel.name}" /><span class="hotel-badge">${hotel.tag}</span></div><p class="modal-kicker">${hotel.address} · ${'★'.repeat(hotel.stars)}</p><h2 id="modal-title">${hotel.name}</h2><div class="detail-rating"><strong>★ ${hotel.rating}</strong><span>${hotel.reviews} отзывов гостей</span></div><p class="modal-sub detail-description">${hotel.description}</p><div class="detail-section"><h3>Номера из базы данных</h3><div class="room-options">${roomList}</div></div><div class="detail-section"><h3>Что есть в отеле</h3><div class="amenity-list">${hotel.amenities.map(item=>`<span>✓ ${item}</span>`).join('')}</div></div><div class="detail-policy"><span>↻</span><div><strong>${hotel.cancel}</strong><small>${hotel.rooms.length ? `В базе найдено номеров: ${hotel.rooms.length}` : 'В базе пока нет добавленных номеров'}</small></div></div><div class="detail-footer"><div><small>от</small><strong>${priceLabel}</strong>${hotel.price?'<small> / ночь</small>':''}</div>${action}</div>`);
}
function bookingForm(hotel, room){
  const trip=getTrip();
  if(!trip.nights){ showToast('Проверьте даты поездки'); closeModal(); return; }
  if(room.type.capacity<trip.guests){ showToast(`Этот номер рассчитан максимум на ${room.type.capacity} гостей`); return; }
  const total=room.type.price*trip.nights, selectedRoom=`${room.type.name} · номер ${room.number}`, user=state.user || {};
  openModal(`<div class="booking-progress"><span class="done">✓</span><i class="done"></i><span class="active">2</span><i></i><span>3</span></div><p class="modal-kicker">Шаг 2 из 3 · Данные гостя</p><h2 id="modal-title">Кто заселяется?</h2><div class="selected-room"><img src="${roomPhoto(room)}" alt="${escapeHtml(room.type.name)}" /><div><strong>${escapeHtml(hotel.name)}</strong><span>${escapeHtml(selectedRoom)} · ${escapeHtml(hotel.city)}</span></div></div><div class="booking-summary"><div><span>${formatDate(trip.checkIn)} — ${formatDate(trip.checkOut)} · ${trip.guests} ${plural(trip.guests,'гость','гостя','гостей')}</span><strong>${trip.nights} ${plural(trip.nights,'ночь','ночи','ночей')}</strong></div><strong>${formatMoney(total)}</strong></div><div class="price-note"><span>✓</span> Итоговая цена · без скрытых сборов</div><form class="modal-form" id="booking-form" novalidate><label>Имя и фамилия<input name="name" value="${escapeHtml(user.name||'')}" autocomplete="name" placeholder="Например, Алексей Петров" minlength="2" required /><small class="field-error"></small></label><label>Email для подтверждения<input name="email" value="${escapeHtml(user.email||'')}" type="email" autocomplete="email" placeholder="you@example.com" required /><small class="field-error"></small></label><label>Телефон<input name="phone" type="tel" autocomplete="tel" placeholder="+7 900 000-00-00" pattern="[+0-9 ()-]{10,20}" required /><small class="field-error"></small></label><label>Комментарий для отеля<textarea name="note" maxlength="300" placeholder="Необязательно: время прибытия, пожелания"></textarea></label><label class="checkbox-label"><input name="agreement" type="checkbox" required /><span>Согласен с условиями бронирования и обработки данных</span></label><div class="form-actions"><button class="secondary-button" type="button" data-book="${hotel.id}">← Назад</button><button class="primary-button" type="submit">Продолжить · ${formatMoney(total)}</button></div></form>`);
  const form=$('#booking-form');
  form.addEventListener('input',event=>{event.target.setCustomValidity('');event.target.closest('label')?.classList.remove('invalid');});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(form), name=String(data.get('name')||'').trim(), email=String(data.get('email')||'').trim(), phone=String(data.get('phone')||'').trim();
    if(name.length<2) form.elements.name.setCustomValidity('Введите имя гостя');
    if(!/^\S+@\S+\.\S+$/.test(email)) form.elements.email.setCustomValidity('Введите корректный email');
    if(phone.replace(/\D/g,'').length<10) form.elements.phone.setCustomValidity('Введите номер телефона полностью');
    if(!form.checkValidity()){
      $$('input',form).forEach(input=>input.closest('label')?.classList.toggle('invalid',!input.validity.valid));
      form.reportValidity();
      return;
    }
    paymentForm(hotel,room,{name,email,phone,note:String(data.get('note')||'').trim(),...trip,total,selectedRoom});
  });
}
function paymentForm(hotel,room,draft){
  openModal(`<div class="booking-progress"><span class="done">✓</span><i class="done"></i><span class="done">✓</span><i class="done"></i><span class="active">3</span></div><p class="modal-kicker">Шаг 3 из 3 · Подтверждение</p><h2 id="modal-title">Оплата бронирования</h2><p class="modal-sub">Это учебный проект: настоящие деньги не списываются, данные карты нигде не сохраняются.</p><div class="payment-total"><span>К оплате</span><strong>${formatMoney(draft.total)}</strong></div><form class="modal-form payment-form" id="payment-form" novalidate><label>Имя на карте<input name="cardName" autocomplete="cc-name" value="${escapeHtml(draft.name)}" required /></label><label>Номер карты<input name="cardNumber" inputmode="numeric" autocomplete="cc-number" placeholder="0000 0000 0000 0000" maxlength="19" required /></label><div class="form-columns"><label>Срок действия<input name="expiry" inputmode="numeric" autocomplete="cc-exp" placeholder="ММ/ГГ" maxlength="5" required /></label><label>CVC<input name="cvc" inputmode="numeric" autocomplete="cc-csc" placeholder="000" maxlength="3" required /></label></div><div class="secure-note">🔒 Защищённая демо-форма · данные карты не сохраняются</div><div class="form-actions"><button class="secondary-button" type="button" data-edit-guest="${hotel.id}" data-room-id="${room.id}">← Назад</button><button class="primary-button" type="submit">Подтвердить · ${formatMoney(draft.total)}</button></div></form>`);
  const form=$('#payment-form'), card=form.elements.cardNumber, expiry=form.elements.expiry;
  card.addEventListener('input',()=>{card.value=card.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();card.setCustomValidity('');});
  expiry.addEventListener('input',()=>{const digits=expiry.value.replace(/\D/g,'').slice(0,4);expiry.value=digits.length>2?`${digits.slice(0,2)}/${digits.slice(2)}`:digits;expiry.setCustomValidity('');});
  form.elements.cvc.addEventListener('input',()=>{form.elements.cvc.value=form.elements.cvc.value.replace(/\D/g,'').slice(0,3);form.elements.cvc.setCustomValidity('');});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const cardDigits=card.value.replace(/\D/g,''), [month,year]=expiry.value.split('/').map(Number), cvc=form.elements.cvc.value;
    if(cardDigits.length!==16) card.setCustomValidity('Введите 16 цифр номера карты');
    if(!month||month<1||month>12||!year) expiry.setCustomValidity('Введите срок в формате ММ/ГГ');
    if(!/^\d{3}$/.test(cvc)) form.elements.cvc.setCustomValidity('Введите 3 цифры');
    if(!form.checkValidity()){form.reportValidity();return;}
    const submit=$('button[type="submit"]',form);submit.disabled=true;submit.textContent='Подтверждаем…';
    setTimeout(()=>completeBooking(hotel,room,draft),650);
  });
  $('[data-edit-guest]').addEventListener('click',()=>bookingForm(hotel,room),{once:true});
}
function completeBooking(hotel,room,draft){
  const booking={id:Date.now(),voucher:`AS-${String(Date.now()).slice(-6)}`,hotelId:hotel.id,roomId:room.id,hotel:hotel.name,city:hotel.city,room:draft.selectedRoom,roomPhoto:roomPhoto(room),dates:`${formatDate(draft.checkIn)} — ${formatDate(draft.checkOut)}`,checkIn:draft.checkIn,checkOut:draft.checkOut,guests:draft.guests,nights:draft.nights,nightly:room.type.price,total:draft.total,status:'Подтверждено',guest:draft.name,email:draft.email,phone:draft.phone,note:draft.note,createdAt:new Date().toISOString()};
  state.bookings.unshift(booking); saveJson('auroraBookings',state.bookings); if(!state.user){state.user={name:booking.guest,email:booking.email};saveJson('auroraUser',state.user);updateUserUI();} updateBookingCount();
  openModal(`<span class="success-icon">✓</span><p class="modal-kicker">Бронь оформлена</p><h2 id="modal-title">Всё готово!</h2><p class="modal-sub">${escapeHtml(booking.guest)}, подтверждение подготовлено для ${escapeHtml(booking.email)}. Бронь доступна в личном кабинете.</p><div class="selected-room"><img src="${booking.roomPhoto}" alt="${escapeHtml(booking.room)}" /><div><strong>${escapeHtml(booking.hotel)}</strong><span>${escapeHtml(booking.room)} · ${escapeHtml(booking.dates)}</span></div></div><div class="booking-summary"><div><span>${booking.guests} ${plural(booking.guests,'гость','гостя','гостей')} · ${booking.nights} ${plural(booking.nights,'ночь','ночи','ночей')}</span><strong>Оплата подтверждена</strong></div><strong>${formatMoney(booking.total)}</strong></div><div class="voucher-code">Номер брони <strong>${booking.voucher}</strong></div><button class="primary-button full-button" type="button" data-open-bookings>Открыть мои бронирования</button>`);
  showToast('Бронирование успешно сохранено');
}
function openBookings(){
  const rows=state.bookings.length?state.bookings.map(b=>`<div class="booking-row">${b.roomPhoto?`<img src="${b.roomPhoto}" alt="${escapeHtml(b.room||'Номер')}" />`:''}<div><strong>${escapeHtml(b.hotel)}</strong><small>${escapeHtml(b.city)}<br>${escapeHtml(b.room||'Номер')} · ${escapeHtml(b.dates)}<br>${b.guests||2} ${plural(b.guests||2,'гость','гостя','гостей')} · ${formatMoney(b.total)}</small></div><div class="booking-actions"><span class="status ${b.status==='Отменено'?'cancelled':''}">${escapeHtml(b.status)}</span><button type="button" class="details-link" data-voucher="${b.id}">Ваучер</button>${b.status!=='Отменено'?`<button type="button" class="details-link" data-edit-booking="${b.id}">Изменить</button><button type="button" class="cancel-link" data-cancel="${b.id}">Отменить</button>`:`<button type="button" class="book-link" data-rebook="${b.hotelId||''}">Забронировать снова</button>`}</div></div>`).join(''):'<div class="empty-bookings"><span>✦</span><p>Здесь появятся ваши бронирования после оформления.</p><button class="primary-button" type="button" data-go-stays>Найти отель</button></div>';
  openModal(`<p class="modal-kicker">Личный кабинет</p><h2 id="modal-title">Мои бронирования</h2><p class="modal-sub">Управляйте поездками, отменяйте планы и быстро находите ваучеры.</p><div class="booking-list">${rows}</div>`);
}
function openVoucher(id){
  const booking=state.bookings.find(item=>item.id===id); if(!booking)return;
  openModal(`<p class="modal-kicker">Электронный ваучер</p><h2 id="modal-title">${escapeHtml(booking.hotel)}</h2><div class="voucher-card"><span>${escapeHtml(booking.voucher||`AS-${String(booking.id).slice(-6)}`)}</span><strong>${escapeHtml(booking.guest||'Гость')}</strong><p>${escapeHtml(booking.room||'Номер')}<br>${escapeHtml(booking.dates)} · ${booking.guests||2} ${plural(booking.guests||2,'гость','гостя','гостей')}</p><b>${formatMoney(booking.total)}</b></div><p class="modal-footnote">Покажите этот ваучер при заселении. Статус: ${escapeHtml(booking.status)}.</p><button class="secondary-button full-button" type="button" data-open-bookings>← К списку бронирований</button>`);
}
function openEditBooking(id){
  const booking=state.bookings.find(item=>item.id===id); if(!booking||booking.status==='Отменено')return;
  const checkout=booking.checkOut||dateValue((booking.nights||1)+1), nightly=booking.nightly||Math.round(booking.total/Math.max(1,booking.nights||1));
  openModal(`<p class="modal-kicker">Управление поездкой</p><h2 id="modal-title">Изменить бронирование</h2><p class="modal-sub">${escapeHtml(booking.hotel)} · ${escapeHtml(booking.room||'Номер')}</p><form class="modal-form" id="edit-booking-form"><label>Заезд<input name="checkIn" type="date" min="${dateValue(0)}" value="${escapeHtml(booking.checkIn||dateValue(1))}" required /></label><label>Выезд<input name="checkOut" type="date" min="${dateValue(1)}" value="${escapeHtml(checkout)}" required /></label><label>Гости<select name="guests"><option value="1" ${booking.guests===1?'selected':''}>1 гость</option><option value="2" ${booking.guests===2?'selected':''}>2 гостя</option><option value="3" ${booking.guests===3?'selected':''}>3 гостя</option><option value="4" ${booking.guests===4?'selected':''}>4 гостя</option></select></label><div class="edit-price" data-edit-price>Стоимость пересчитается после изменения дат</div><div class="form-actions"><button class="secondary-button" type="button" data-open-bookings>← Назад</button><button class="primary-button" type="submit">Сохранить изменения</button></div></form>`);
  const form=$('#edit-booking-form'), checkIn=form.elements.checkIn, checkOut=form.elements.checkOut, price=$('[data-edit-price]');
  const updatePrice=()=>{const start=new Date(`${checkIn.value}T12:00:00`),end=new Date(`${checkOut.value}T12:00:00`),n=Math.round((end-start)/86400000);price.textContent=n>0?`${n} ${plural(n,'ночь','ночи','ночей')} · ${formatMoney(nightly*n)}`:'Выберите выезд позже заезда';};
  checkIn.addEventListener('change',()=>{const next=new Date(`${checkIn.value}T12:00:00`);next.setDate(next.getDate()+1);checkOut.min=next.toISOString().slice(0,10);if(checkOut.value<checkOut.min)checkOut.value=checkOut.min;updatePrice();}); checkOut.addEventListener('change',updatePrice); updatePrice();
  form.addEventListener('submit',event=>{event.preventDefault();const start=new Date(`${checkIn.value}T12:00:00`),end=new Date(`${checkOut.value}T12:00:00`),n=Math.round((end-start)/86400000);if(!n||n<1){showToast('Выезд должен быть позже заезда');return;}booking.checkIn=checkIn.value;booking.checkOut=checkOut.value;booking.nights=n;booking.guests=Number(form.elements.guests.value);booking.nightly=nightly;booking.total=nightly*n;booking.dates=`${formatDate(booking.checkIn)} — ${formatDate(booking.checkOut)}`;saveJson('auroraBookings',state.bookings);openBookings();showToast('Бронирование обновлено');});
}
function openLogin(){
  if(state.user){openModal(`<p class="modal-kicker">Личный кабинет</p><h2 id="modal-title">Привет, ${escapeHtml(state.user.name)}</h2><p class="modal-sub">Вы вошли как ${escapeHtml(state.user.email)}. Данные подставятся при следующем бронировании.</p><button class="primary-button full-button" type="button" data-open-bookings>Мои бронирования</button><button class="secondary-button full-button" type="button" data-logout>Выйти</button>`);return;}
  openModal(`<p class="modal-kicker">Личный кабинет</p><h2 id="modal-title">С возвращением</h2><p class="modal-sub">Демо-вход сохраняется только в этом браузере.</p><form class="modal-form" id="login-form"><label>Ваше имя<input name="name" autocomplete="name" placeholder="Алексей" minlength="2" required /></label><label>Email<input name="email" type="email" autocomplete="email" placeholder="you@example.com" required /></label><label>Пароль<input name="password" type="password" autocomplete="current-password" placeholder="Минимум 6 символов" minlength="6" required /></label><button class="primary-button full-button" type="submit">Войти</button></form><p class="modal-footnote">Учебный режим: пароль никуда не отправляется и не сохраняется.</p>`);
  $('#login-form').addEventListener('submit',event=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;const data=new FormData(event.currentTarget);state.user={name:String(data.get('name')).trim(),email:String(data.get('email')).trim()};saveJson('auroraUser',state.user);updateUserUI();closeModal();showToast(`Добро пожаловать, ${state.user.name}!`);});
}
function requestCancelBooking(id){
  const booking=state.bookings.find(item=>item.id===id); if(!booking)return;
  openModal(`<p class="modal-kicker">Отмена бронирования</p><h2 id="modal-title">Отменить поездку?</h2><p class="modal-sub">${escapeHtml(booking.hotel)} · ${escapeHtml(booking.dates)}. В учебной версии отмена бесплатная.</p><div class="form-actions"><button class="secondary-button" type="button" data-open-bookings>Оставить бронь</button><button class="danger-button" type="button" data-confirm-cancel="${booking.id}">Да, отменить</button></div>`);
}
function cancelBooking(id){ const booking=state.bookings.find(item=>item.id===id); if(!booking)return; booking.status='Отменено'; saveJson('auroraBookings',state.bookings); updateBookingCount(); openBookings(); showToast('Бронирование отменено'); }
function updateBookingCount(){ $('[data-booking-count]').textContent=state.bookings.filter(item=>item.status!=='Отменено').length; }
function updateFavoriteCount(){ $('[data-favorite-count]').textContent=state.favorites.length; }
function updateUserUI(){const label=$('.profile-label');if(label)label.textContent=state.user?state.user.name.split(/\s+/)[0]:'Войти';}
function openFavorites(){
  const favoriteHotels=hotels.filter(hotel=>state.favorites.includes(hotel.id));
  const rows=favoriteHotels.length?favoriteHotels.map(hotel=>`<div class="favorite-row"><img src="${hotel.photo}" alt="${escapeHtml(hotel.name)}" /><div><strong>${escapeHtml(hotel.name)}</strong><small>${escapeHtml(hotel.city)} · ★ ${hotel.rating}<br>от ${formatMoney(hotel.price)} / ночь</small></div><div class="favorite-actions"><button class="details-link" type="button" data-details="${hotel.id}">Подробнее</button><button class="book-link" type="button" data-book="${hotel.id}">Забронировать</button></div></div>`).join(''):'<div class="empty-bookings"><span>♡</span><p>Сохраняйте отели, чтобы быстро вернуться к ним позже.</p><button class="primary-button" type="button" data-go-stays>Посмотреть отели</button></div>';
  openModal(`<p class="modal-kicker">Ваша подборка</p><h2 id="modal-title">Избранные отели</h2><p class="modal-sub">Здесь собраны варианты, которые вы отметили для сравнения.</p><div class="favorite-list">${rows}</div>`);
}
function openSupport(){
  openModal(`<p class="modal-kicker">Мы рядом</p><h2 id="modal-title">Чем помочь?</h2><p class="modal-sub">Выберите быстрый ответ или напишите нам — поможем с поиском, бронированием и отменой.</p><div class="support-options"><button type="button" data-go-faq><span>?</span><div><strong>Посмотреть ответы</strong><small>Частые вопросы о бронировании</small></div><b>↗</b></button><button type="button" data-open-bookings><span>▣</span><div><strong>Проверить бронь</strong><small>Ваучер и статус поездки</small></div><b>↗</b></button><a href="mailto:help@aurorastay.demo"><span>✉</span><div><strong>Написать в поддержку</strong><small>help@aurorastay.demo</small></div><b>↗</b></a></div><p class="modal-footnote">Обычно отвечаем в течение нескольких минут.</p>`);
}
function showToast(text){const toast=$('#toast');toast.textContent=text;toast.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove('show'),3200);}
const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.01,rootMargin:'0px 0px -10px'}) : null;
function observeReveals(){
  $$('.reveal:not(.reveal-ready)').forEach(element=>{element.classList.add('reveal-ready');if(element.getBoundingClientRect().height>window.innerHeight){element.classList.add('is-visible');}else if(revealObserver){revealObserver.observe(element);}else{element.classList.add('is-visible');}});
}
function renderLocations(query=''){
  const normalized=query.trim().toLowerCase();
  const filtered=db.countries.map(country=>({...country,cities:country.cities.filter(city=>!normalized||`${country.name} ${city.name}`.toLowerCase().includes(normalized))})).filter(country=>country.cities.length);
  $('#location-count').textContent=`${filtered.reduce((total,country)=>total+country.cities.length,0)} городов · ${filtered.length} стран`;
  $('#destination-options').innerHTML=db.countries.flatMap(country=>country.cities.map(city=>`<option value="${city.name}">${country.name}</option>`)).join('');
  $('#destination-grid').innerHTML=filtered.map(country=>`<article class="destination-card"><div class="destination-country"><span class="country-dot">${country.id}</span><div><h3>${country.name}</h3><small>${country.cities.length} ${plural(country.cities.length,'город','города','городов')} в каталоге</small></div></div><div class="city-list">${country.cities.map(city=>`<button type="button" data-location="${city.name}">${city.name}<span>↗</span></button>`).join('')}</div></article>`).join('');
}

const today=dateValue(0); $('#check-in').min=today; $('#check-out').min=dateValue(1); $('#check-in').value=dateValue(7); $('#check-out').value=dateValue(10); renderHotels(); renderLocations(); updateBookingCount(); updateFavoriteCount(); updateUserUI();
observeReveals();
$('#check-in').addEventListener('change',()=>{ const next=new Date(`${$('#check-in').value}T12:00:00`); next.setDate(next.getDate()+1); $('#check-out').min=next.toISOString().slice(0,10); if($('#check-out').value<$('#check-out').min)$('#check-out').value=$('#check-out').min; });
$('#search-form').addEventListener('submit',e=>{e.preventDefault(); const trip=getTrip(); if(!trip.checkIn||!trip.checkOut||!trip.nights){showToast('Дата выезда должна быть позже даты заезда');return;} state.destination=$('#destination').value.trim(); $('#search-hint').textContent=`Показаны варианты для ${state.destination || 'всех направлений'} · ${trip.nights} ${plural(trip.nights,'ночь','ночи','ночей')} · ${trip.guests} ${plural(trip.guests,'гость','гостя','гостей')}`; renderHotels(); $('#stays').scrollIntoView({behavior:'smooth'}); showToast(`Найдено вариантов: ${visibleHotels().length}`);});
$$('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{state.filter=btn.dataset.filter;$$('[data-filter]').forEach(b=>b.classList.toggle('selected',b===btn));renderHotels();}));
document.addEventListener('click',e=>{
  const book=e.target.closest('[data-book]'); if(book){const hotel=hotels.find(h=>h.id===Number(book.dataset.book)); if(hotel)bookingRoomSelection(hotel); return;}
  const roomSelect=e.target.closest('[data-room-select]'); if(roomSelect){const hotel=hotels.find(h=>h.id===Number(roomSelect.dataset.roomSelect)); const room=hotel?.rooms.find(item=>item.id===Number(roomSelect.dataset.roomId)); if(hotel&&room)bookingForm(hotel,room); return;}
  const details=e.target.closest('[data-details]'); if(details){const hotel=hotels.find(h=>h.id===Number(details.dataset.details)); if(hotel)openDetails(hotel); return;}
  const cancel=e.target.closest('[data-cancel]'); if(cancel){requestCancelBooking(Number(cancel.dataset.cancel)); return;}
  const confirmCancel=e.target.closest('[data-confirm-cancel]'); if(confirmCancel){cancelBooking(Number(confirmCancel.dataset.confirmCancel)); return;}
  const voucher=e.target.closest('[data-voucher]'); if(voucher){openVoucher(Number(voucher.dataset.voucher)); return;}
  const editBooking=e.target.closest('[data-edit-booking]'); if(editBooking){openEditBooking(Number(editBooking.dataset.editBooking)); return;}
  const rebook=e.target.closest('[data-rebook]'); if(rebook){const hotel=hotels.find(h=>h.id===Number(rebook.dataset.rebook));if(hotel)bookingRoomSelection(hotel);return;}
  const location=e.target.closest('[data-location]'); if(location){$('#destination').value=location.dataset.location;$('#search-form').requestSubmit();return;}
  const quickLocation=e.target.closest('[data-quick-location]'); if(quickLocation){$('#destination').value=quickLocation.dataset.quickLocation;$('#search-form').requestSubmit();return;}
  if(e.target.closest('[data-open-bookings]')){openBookings();return;} if(e.target.closest('[data-open-favorites]')){openFavorites();return;} if(e.target.closest('[data-open-login]')){openLogin();return;} if(e.target.closest('[data-open-support]')){openSupport();return;} if(e.target.closest('[data-go-faq]')){closeModal();$('#faq').scrollIntoView({behavior:'smooth'});return;} if(e.target.closest('[data-go-stays]')){closeModal();$('#stays').scrollIntoView({behavior:'smooth'});return;} if(e.target.closest('[data-logout]')){state.user=null;saveJson('auroraUser',null);updateUserUI();closeModal();showToast('Вы вышли из профиля');return;}
  const closeControl=e.target.closest('[data-close-modal]'); if(closeControl && closeControl.id!=='modal-backdrop'){closeModal();return;}
  const reset=e.target.closest('[data-reset-search]'); if(reset){state.destination='';state.filter='all';state.sort='recommended';$('#destination').value='';$$('[data-filter]').forEach(button=>button.classList.toggle('selected',button.dataset.filter==='all'));$('.sort-button').innerHTML='Сначала рекомендуемые <span>⌄</span>';renderHotels();showToast('Фильтры сброшены');return;}
  const info=e.target.closest('[data-info]'); if(info){const isPrivacy=info.dataset.info==='privacy';openModal(`<p class="modal-kicker">Aurora Stay</p><h2 id="modal-title">${isPrivacy?'Конфиденциальность':'Условия использования'}</h2><p class="modal-sub">${isPrivacy?'Данные бронирования хранятся только локально в вашем браузере. Платёжные данные не сохраняются.':'Это учебная демонстрационная система бронирования. Оплата имитируется, реальные денежные операции не выполняются.'}</p><button class="primary-button full-button" type="button" data-close-modal>Понятно</button>`);return;}
  const save=e.target.closest('[data-save]'); if(save){const id=Number(save.dataset.save);state.favorites=state.favorites.includes(id)?state.favorites.filter(item=>item!==id):[...state.favorites,id];saveJson('auroraFavorites',state.favorites);updateFavoriteCount();renderHotels();showToast(state.favorites.includes(id)?'Отель добавлен в избранное':'Отель убран из избранного');return;}
  if(e.target.closest('[data-sort-toggle]')){state.sort=state.sort==='recommended'?'price':state.sort==='price'?'rating':'recommended';e.target.closest('[data-sort-toggle]').innerHTML=state.sort==='price'?'Сначала дешевле <span>⌄</span>':state.sort==='rating'?'Лучший рейтинг <span>⌄</span>':'Сначала рекомендуемые <span>⌄</span>';renderHotels();}
});
$('#modal-backdrop').addEventListener('click',e=>{if(e.target.id==='modal-backdrop')closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modal-backdrop').classList.contains('hidden'))closeModal();});
$('[data-menu-toggle]').addEventListener('click',()=>{const menu=document.querySelector('.main-nav'),button=$('[data-menu-toggle]'),opened=menu.classList.toggle('open');button.setAttribute('aria-expanded',String(opened));button.setAttribute('aria-label',opened?'Закрыть меню':'Открыть меню');});
$$('.main-nav a').forEach(link=>link.addEventListener('click',()=>{const menu=document.querySelector('.main-nav');if(menu.classList.contains('open')){$('[data-menu-toggle]').click();}}));
$('#location-filter').addEventListener('input',e=>renderLocations(e.target.value));
const backToTop=$('#back-to-top');
window.addEventListener('scroll',()=>{const scrollable=document.documentElement.scrollHeight-window.innerHeight;$('#scroll-progress').style.transform=`scaleX(${scrollable>0?window.scrollY/scrollable:0})`;backToTop.classList.toggle('visible',window.scrollY>560);},{passive:true});
backToTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
document.addEventListener('input',event=>{if(event.target.matches('input[name="phone"]')){const digits=event.target.value.replace(/\D/g,'').slice(0,11);event.target.value=digits?`+${digits[0]==='7'?'7':digits[0]}${digits.slice(1)}`:'';}});
const navObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){$$('.main-nav a').forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`));}}),{rootMargin:'-32% 0px -58% 0px',threshold:0}):null;
if(navObserver){['stays','how-it-works','destinations','benefits','faq','support'].forEach(id=>{const section=document.getElementById(id);if(section)navObserver.observe(section);});}
const motionAllowed=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(motionAllowed){
  document.addEventListener('pointermove',event=>{
    const card=event.target.closest('[data-tilt]');
    if(card){const rect=card.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;card.style.transform=`perspective(900px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*3).toFixed(2)}deg) translateY(-4px)`;card.classList.add('tilt-active');}
    const art=event.target.closest('.hero-art');
    if(art){const rect=art.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;art.style.setProperty('--parallax-x',`${(x*10).toFixed(1)}px`);art.style.setProperty('--parallax-y',`${(y*8).toFixed(1)}px`);}
  });
  document.addEventListener('pointerout',event=>{const card=event.target.closest('[data-tilt]');if(card&&!card.contains(event.relatedTarget)){card.style.transform='';card.classList.remove('tilt-active');}const art=event.target.closest('.hero-art');if(art&&!art.contains(event.relatedTarget)){art.style.setProperty('--parallax-x','0px');art.style.setProperty('--parallax-y','0px');}});
  document.addEventListener('click',event=>{const target=event.target.closest('.primary-button,.filter-chip,.support-fab,.book-link,.details-link');if(!target||target.disabled)return;const ripple=document.createElement('span');ripple.className='ripple-dot';const rect=target.getBoundingClientRect(),size=Math.max(rect.width,rect.height);ripple.style.width=ripple.style.height=`${size}px`;ripple.style.left=`${event.clientX-rect.left-size/2}px`;ripple.style.top=`${event.clientY-rect.top-size/2}px`;target.append(ripple);ripple.addEventListener('animationend',()=>ripple.remove(),{once:true});});
}

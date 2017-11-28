'use strict';

var DEFAULT = {
  'titles': [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  'types': ['flat', 'house', 'bungalo'],
  'times': ['12:00', '13:00', '14:00'],
  'features': ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
};

var AVATAR_FILE_URL = 'img/avatars/user';
var AVATAR_FILE_TYPE = '.png';
var AVATAR_WIDTH = 46;
var AVATAR_HEIGHT = 46;
var AVATAR_HEIGHT_PLUS = 18;
var ADDRESS_BEFORE_COORD = '{{';
var ADDRESS_BETWEEN_COORD = '}}, {{';
var ADDRESS_AFTER_COORD = '}}';
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var AFTER_PRICE = '&#x20bd;/ночь';
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;
var MIN_COORD_X = 300;
var MAX_COORD_X = 900;
var MIN_COORD_Y = 100;
var MAX_COORD_Y = 500;
var AFTER_COORD = 'px';

var TYPE_MAP = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
};

var DEFAULT_NAME = 'Эксклюзивный тип жилья';

var compareRandom = function () {
  return Math.random() - 0.5;
};

var getRandom = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getRandomArbitary = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getRandomSort = function (arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    newArr[i] = arr[i];
  }
  newArr.sort(compareRandom);

  return newArr;
};

var getRandomValues = function (arr) {
  var newArr = getRandomSort(arr);
  newArr.length = getRandomArbitary(0, arr.length);

  return newArr;
};

var leftHandZero = function (number) {
  number = number < 10 ? '0' + number : number;
  return number;
};

var dataPin = function (i) {
  var pin = {
    'author': {
      'avatar': AVATAR_FILE_URL + leftHandZero(i + 1) + AVATAR_FILE_TYPE
    },
    'location': {
      'x': getRandomArbitary(MIN_COORD_X, MAX_COORD_X) - AVATAR_WIDTH / 2,
      'y': getRandomArbitary(MIN_COORD_Y, MAX_COORD_Y) + AVATAR_HEIGHT + AVATAR_HEIGHT_PLUS
    }
  };
  pin.offer = {
    'title': DEFAULT.titles[i],
    'address': ADDRESS_BEFORE_COORD + pin.location.x +
      ADDRESS_BETWEEN_COORD + pin.location.y + ADDRESS_AFTER_COORD,
    'price': getRandomArbitary(MIN_PRICE, MAX_PRICE),
    'type': getRandom(DEFAULT.types),
    'rooms': getRandomArbitary(MIN_ROOMS, MAX_ROOMS),
    'guests': getRandomArbitary(MIN_GUESTS, MAX_GUESTS),
    'checkin': getRandom(DEFAULT.times),
    'checkout': getRandom(DEFAULT.times),
    'features': getRandomValues(DEFAULT.features),
    'description': '',
    'photos': []
  };

  return pin;
};

var getTimeText = function (checkin, checkout) {
  return 'Заезд после ' + checkin + ', выезд до ' + checkout;
};

var getCountText = function (rooms, guests) {
  return rooms + ' комнаты для ' + guests + ' гостей';
};

var renderFeaturesList = function (features) {
  var featuresFragment = document.createDocumentFragment();

  features.forEach(function (feature) {
    var listItem = document.createElement('li');
    listItem.className = 'feature feature--' + feature;
    featuresFragment.appendChild(listItem);
  });

  return featuresFragment;
};

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = pin.location.x + AFTER_COORD;
  pinElement.style.top = pin.location.y + AFTER_COORD;
  pinElement.querySelector('img').src = pin.author.avatar;

  return pinElement;
};

var renderCard = function (pin) {
  var cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('h3').textContent = pin.offer.title;
  cardElement.querySelector('p small').innerHTML = pin.offer.address;
  cardElement.querySelector('h4').textContent = TYPE_MAP[pin.offer.type] || DEFAULT_NAME;
  cardElement.querySelector('.popup__price').innerHTML =
    pin.offer.price + AFTER_PRICE;
  cardElement.querySelector('p:nth-of-type(3)').textContent =
    getCountText(pin.offer.rooms, pin.offer.guests);
  cardElement.querySelector('p:nth-of-type(4)').textContent =
    getTimeText(pin.offer.checkin, pin.offer.checkout);
  cardElement.querySelector('p:nth-of-type(5)').textContent = pin.offer.description;
  cardElement.querySelector('.popup__features').textContent = '';
  cardElement.querySelector('.popup__features')
      .appendChild(renderFeaturesList(pin.offer.features));
  cardElement.querySelector('img').src = pin.author.avatar;

  return cardElement;
};

var pins = [];

for (var j = 0; j < DEFAULT.titles.length; j++) {
  pins[j] = dataPin(j);
}

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
var pinsFragment = document.createDocumentFragment();
var cardFragment = document.createDocumentFragment();
var mapPins = document.querySelector('.map__pins');

for (var k = 0; k < pins.length; k++) {
  pinsFragment.appendChild(renderPin(pins[k]));
  cardFragment.appendChild(renderCard(pins[k]));
}

mapPins.appendChild(pinsFragment);
map.appendChild(cardFragment);

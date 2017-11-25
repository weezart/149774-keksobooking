'use strict';

var DEFAULT = {
  'numbers': [1, 2, 3, 4, 5, 6, 7, 8],
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
var AVATAR_WIDTH = 40;
var AVATAR_HEIGHT = 40;
var ADDRESS_BEFORE_COORD = '{{';
var ADDRESS_BETWEEN_COORD = '}}, {{';
var ADDRESS_AFTER_COORD = '}}';
var MIN_FEATURES = 0;
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


var compareRandom = function () {
  return Math.random() - 0.5;
};

var getRandom = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getRandomArbitary = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var leftHandZero = function (number) {
  number = number < 10 ? '0' + number : number;
  return number;
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
  cardElement.querySelector('.popup__price').innerHTML = pin.offer.price + AFTER_PRICE;
  switch (pin.offer.type) {
    case 'flat':
      cardElement.querySelector('h4').textContent = 'Квартира';
      break;
    case 'bungalo':
      cardElement.querySelector('h4').textContent = 'Бунгало';
      break;
    case 'house':
      cardElement.querySelector('h4').textContent = 'Дом';
      break;
    default:
      cardElement.querySelector('h4').textContent = 'Эксклюзивный тип жилья';
      break;
  }
  cardElement.querySelector('.popup__rooms').textContent = pin.offer.rooms;
  cardElement.querySelector('.popup__guests').textContent = pin.offer.guests;
  cardElement.querySelector('.popup__checkin').textContent = pin.offer.checkin;
  cardElement.querySelector('.popup__checkout').textContent = pin.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = pin.offer.description;
  cardElement.querySelector('.popup__features').textContent = '';
  if (pin.offer.features.length > 0) {
    for (var f = 0; f < pin.offer.features.length; f++) {
      var featureElement = document.createElement('li');
      featureElement.className = 'feature feature--' + pin.offer.features[f];
      cardElement.querySelector('.popup__features').appendChild(featureElement);
    }
  }
  cardElement.querySelector('img').src = pin.author.avatar;

  return cardElement;
};

var numbers = [];
for (var j = 0; j < DEFAULT.numbers.length; j++) {
  numbers[j] = DEFAULT.numbers[j];
}
numbers.sort(compareRandom);

var pins = [];

for (var i = 0; i < numbers.length; i++) {

  var features = [];
  for (var k = 0; k < DEFAULT.features.length; k++) {
    features[k] = DEFAULT.features[k];
  }
  features.sort(compareRandom);
  features.length = (getRandomArbitary(MIN_FEATURES, features.length));

  pins[i] = {};
  pins[i].author = {
    'avatar': AVATAR_FILE_URL + leftHandZero(numbers[i]) + AVATAR_FILE_TYPE
  };

  pins[i].location = {
    'x': getRandomArbitary(MIN_COORD_X, MAX_COORD_X) - AVATAR_WIDTH / 2,
    'y': getRandomArbitary(MIN_COORD_Y, MAX_COORD_Y) + AVATAR_HEIGHT
  };

  pins[i].offer = {
    'title': DEFAULT.titles[--numbers[i]],
    'address': ADDRESS_BEFORE_COORD + pins[i].location.x +
      ADDRESS_BETWEEN_COORD + pins[i].location.y + ADDRESS_AFTER_COORD,
    'price': getRandomArbitary(MIN_PRICE, MAX_PRICE),
    'type': getRandom(DEFAULT.types),
    'rooms': getRandomArbitary(MIN_ROOMS, MAX_ROOMS),
    'guests': getRandomArbitary(MIN_GUESTS, MAX_GUESTS),
    'checkin': getRandom(DEFAULT.times),
    'checkout': getRandom(DEFAULT.times),
    'features': features,
    'description': '',
    'photos': []
  };
}

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

var pinsFragment = document.createDocumentFragment();
var cardFragment = document.createDocumentFragment();

for (var z = 0; z < pins.length; z++) {
  pinsFragment.appendChild(renderPin(pins[z]));
  cardFragment.appendChild(renderCard(pins[z]));
}

var mapPins = document.querySelector('.map__pins');
mapPins.appendChild(pinsFragment);
map.appendChild(cardFragment);

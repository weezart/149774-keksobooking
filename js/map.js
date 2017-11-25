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
  'times': ['12:00', '13:00', '14:00']
}

var AVATAR_FILE_URL = 'img/avatars/user';
var AVATAR_FILE_TYPE = '.png';
var ADDRESS_BEFORE_COORD = '{{';
var ADDRESS_BETWEEN_COORD = '}}, {{';
var ADDRESS_AFTER_COORD = '}}';
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_GUESTS = 1;
var MAX_GUESTS = 100500;
var MIN_COORD_X = 300;
var MAX_COORD_X = 900;
var MIN_COORD_Y = 100;
var MAX_COORD_Y = 500;

var compareRandom =  function () {
  return Math.random() - 0.5;
};

var getRandom = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getRandomArbitary = function (min, max) {
  return Math.random() * (max - min) + min;
};

var leftHandZero = function(number) {
  return number = number < 10 ? '0' + number : number;
};

var indexes = DEFAULT.numbers;

indexes.sort(compareRandom);

var mapMarkers = [];

for (var i = 0; i < indexes.length; i++) {

  mapMarkers[i] = {};
  mapMarkers[i].author = {
    'avatar': AVATAR_FILE_URL + leftHandZero(indexes[i]) + AVATAR_FILE_TYPE
  };

  mapMarkers[i].location = {
    'x': getRandomArbitary(MIN_COORD_X, MAX_COORD_X),
    'y': getRandomArbitary(MIN_COORD_Y, MAX_COORD_X)
  };

  mapMarkers[i].offer = {
    'title': DEFAULT.titles[--indexes[i]],
    'address': ADDRESS_BEFORE_COORD + mapMarkers[i].location.x +
      ADDRESS_BETWEEN_COORD + mapMarkers[i].location.y + ADDRESS_AFTER_COORD,
    'price': getRandomArbitary(MIN_PRICE, MAX_PRICE),
    'type': getRandom(DEFAULT.types),
    'rooms': getRandomArbitary(MIN_ROOMS, MAX_ROOMS),
    'guests': getRandomArbitary(MIN_GUESTS, MAX_GUESTS),
    'checkin': getRandom(DEFAULT.times),
    'checkout': getRandom(DEFAULT.times),
    'features': getRandom(DEFAULT.types),
    'description': '',
    'photos': []
  }
}

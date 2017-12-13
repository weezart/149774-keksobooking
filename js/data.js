'use strict';

(function () {
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
  var AVATAR_HEIGHT = 61;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 80;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 5;
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 3;
  var MIN_COORD_X = 300;
  var MAX_COORD_X = 900;
  var MIN_COORD_Y = 100;
  var MAX_COORD_Y = 500;

  var dataPin = function (i) {
    var pin = {
      'author': {
        'avatar': AVATAR_FILE_URL + window.utils.leftHandZero(i + 1) + AVATAR_FILE_TYPE
      },
      'location': {
        'x': window.utils.getRandomNumber(MIN_COORD_X, MAX_COORD_X) +
          AVATAR_WIDTH / 2,
        'y': window.utils.getRandomNumber(MIN_COORD_Y, MAX_COORD_Y) +
          AVATAR_HEIGHT
      }
    };
    pin.offer = {
      'title': DEFAULT.titles[i],
      'address': pin.location.x + ', ' + pin.location.y,
      'price': window.utils.getRandomNumber(MIN_PRICE, MAX_PRICE),
      'type': window.utils.getRandomElement(DEFAULT.types),
      'rooms': window.utils.getRandomNumber(MIN_ROOMS, MAX_ROOMS),
      'guests': window.utils.getRandomNumber(MIN_GUESTS, MAX_GUESTS),
      'checkin': window.utils.getRandomElement(DEFAULT.times),
      'checkout': window.utils.getRandomElement(DEFAULT.times),
      'features': window.utils.getRandomValues(DEFAULT.features),
      'description': '',
      'photos': []
    };

    return pin;
  };

  window.data = {
    getPinsInfo: function () {
      var pins = [];
      for (var i = 0; i < DEFAULT.titles.length; i++) {
        pins[i] = dataPin(i);
      }
      return pins;
    },
    getPinCoord: function (x, y) {
      x -= AVATAR_WIDTH / 2;
      y -= AVATAR_HEIGHT;
      return {'coordX': Math.floor(x), 'coordY': Math.floor(y)};
    },
    getMainPinCoord: function (x, y) {
      x += MAIN_PIN_WIDTH / 2;
      y += MAIN_PIN_HEIGHT;
      return {'x': Math.floor(x), 'y': Math.floor(y)};
    },
    validityCoord: function (x, y) {
      var coord = {
        'x': x,
        'y': y
      };
      if (x < MIN_COORD_X - MAIN_PIN_WIDTH / 2) {
        coord.x = MIN_COORD_X - MAIN_PIN_WIDTH / 2;
      } else if (x > MAX_COORD_X - MAIN_PIN_WIDTH / 2) {
        coord.x = MAX_COORD_X - MAIN_PIN_WIDTH / 2;
      }
      if (y < MIN_COORD_Y - MAIN_PIN_HEIGHT) {
        coord.y = MIN_COORD_Y - MAIN_PIN_HEIGHT;
      } else if (y > MAX_COORD_Y - MAIN_PIN_HEIGHT) {
        coord.y = MAX_COORD_Y - MAIN_PIN_HEIGHT;
      }
      return coord;
    }
  };
})();

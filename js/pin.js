'use strict';

(function () {
  var AFTER_COORD = 'px';
  var mapPins = document.querySelector('.map__pins');
  var mainMapPin = document.querySelector('.map__pin--main');
  var AVATAR_WIDTH = 46;
  var AVATAR_HEIGHT = 61;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 80;
  var MIN_COORD_X = 300;
  var MAX_COORD_X = 900;
  var MIN_COORD_Y = 100;
  var MAX_COORD_Y = 500;

  var renderPin = function (pin) {
    var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
    var pinElement = pinTemplate.cloneNode(true);
    var realCoord = window.pins.getCoord(pin.location.x, pin.location.y);
    pinElement.style.left = realCoord.coordX + AFTER_COORD;
    pinElement.style.top = realCoord.coordY + AFTER_COORD;
    pinElement.querySelector('img').src = pin.author.avatar;

    return pinElement;
  };

  window.pins = {
    currentPinNumber: 0,
    add: function (mapPin, pins) {
      var pinsFragment = document.createDocumentFragment();
      for (var i = 0; i < pins.length; i++) {
        mapPin[i] = renderPin(pins[i]);
        pinsFragment.appendChild(mapPin[i]);
      }

      mapPins.insertBefore(pinsFragment, mainMapPin);
    },
    getCoord: function (x, y) {
      x -= AVATAR_WIDTH / 2;
      y -= AVATAR_HEIGHT;
      return {'coordX': Math.floor(x), 'coordY': Math.floor(y)};
    },
    getRandomCoord: function () {
      var coord = {
        'x': window.utils.getRandomNumber(MIN_COORD_X, MAX_COORD_X) +
          AVATAR_WIDTH / 2,
        'y': window.utils.getRandomNumber(MIN_COORD_Y, MAX_COORD_Y) +
          AVATAR_HEIGHT
      };
      return coord;
    },
    getMainPinCoord: function (x, y) {
      x += MAIN_PIN_WIDTH / 2;
      y += MAIN_PIN_HEIGHT;
      return {'x': Math.floor(x), 'y': Math.floor(y)};
    },
    validateCoord: function (x, y) {
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

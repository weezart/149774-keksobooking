'use strict';

(function () {
  var AFTER_COORD = 'px';
  var PIN_HEIGHT = 46;
  var PIN_POINT_END = 18;
  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_POINT_END = 16; // 22 - 6
  var MIN_COORD_X = 0;
  var MAX_COORD_X = 1200;
  var MIN_COORD_Y = 100;
  var MAX_COORD_Y = 500;

  var pinShift = PIN_HEIGHT / 2 + PIN_POINT_END;
  var mainPinShift = MAIN_PIN_HEIGHT / 2 + MAIN_PIN_POINT_END;
  // Неожиданно обнаружил заданное свойство transform для меток.
  // Использование ширины потеряло всякий смысл.
  // Left и right задают середину метки.
  // Хотя с координатой по Y всё сложно...

  var mapPins = document.querySelector('.map__pins');
  var mainMapPin = document.querySelector('.map__pin--main');

  var renderPin = function (pin) {
    var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
    var pinElement = pinTemplate.cloneNode(true);
    var realIndent = window.pins.getPinIndent(pin.location.x, pin.location.y);
    pinElement.style.left = realIndent.x + AFTER_COORD;
    pinElement.style.top = realIndent.y + AFTER_COORD;
    pinElement.querySelector('img').src = pin.author.avatar;

    return pinElement;
  };

  window.pins = {
    currentPinNumber: 0,
    add: function (data) {
      var pinsFragment = document.createDocumentFragment();
      for (var i = 0; i < data.length; i++) {
        window.map.pins[i] = renderPin(data[i]);
        pinsFragment.appendChild(window.map.pins[i]);
      }

      mapPins.insertBefore(pinsFragment, mainMapPin);
    },
    find: function (element, cb) {

      window.map.pins.forEach(function (pin, i) {
        if ((pin === element.parentNode) ||
          (pin === element)) {
          window.closeCard();
          window.pins.currentPinNumber = i;
          cb();
        }
      });
    },
    getPinIndent: function (x, y) {
      y -= pinShift;
      return {'x': Math.floor(x), 'y': Math.floor(y)};
    },
    getMainPinCoord: function (x, y) {
      y += mainPinShift;
      return {'x': Math.floor(x), 'y': Math.floor(y)};
    },
    validateCoord: function (x, y) {
      var coord = {
        'x': x,
        'y': y
      };

      if (x <= MIN_COORD_X) {
        coord.x = MIN_COORD_X;
      } else if (x >= MAX_COORD_X) {
        coord.x = MAX_COORD_X;
      }


      if (y < MIN_COORD_Y - mainPinShift) {
        coord.y = MIN_COORD_Y - mainPinShift;
      } else if (y > MAX_COORD_Y - mainPinShift) {
        coord.y = MAX_COORD_Y - mainPinShift;
      }
      return coord;
    }
  };

})();

'use strict';

(function () {
  var AFTER_COORD = 'px';
  var mapPins = document.querySelector('.map__pins');
  var mainMapPin = document.querySelector('.map__pin--main');

  var renderPin = function (pin) {
    var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.style.left = pin.location.x + AFTER_COORD;
    pinElement.style.top = pin.location.y + AFTER_COORD;
    pinElement.querySelector('img').src = pin.author.avatar;

    return pinElement;
  };

  window.pins = {
    currentPinNumber: 0,
    add: function (mapPin) {
      var pins = window.data.getPinsInfo();
      var pinsFragment = document.createDocumentFragment();
      for (var i = 0; i < pins.length; i++) {
        mapPin[i] = renderPin(pins[i]);
        pinsFragment.appendChild(mapPin[i]);
      }

      mapPins.insertBefore(pinsFragment, mainMapPin);
    },
    find: function (element, mapPin, mapPopup) {
      for (var i = 0; i < mapPin.length; i++) {
        if (mapPin[i].classList.contains('map__pin--active')) {
          mapPin[i].classList.remove('map__pin--active');
        }

        if (!mapPopup[i].classList.contains('hidden')) {
          mapPopup[i].classList.add('hidden');
        }

        if ((mapPin[i] === element.parentNode) || (mapPin[i] === element)) {
          window.pins.currentPinNumber = i;
        }
      }
    }
  };

})();

'use strict';

(function () {
  window.showCard = function (element, mapPin, mapPopup) {
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

    mapPin[window.pins.currentPinNumber].classList.add('map__pin--active');
    mapPopup[window.pins.currentPinNumber].classList.remove('hidden');
  };

  window.closeCard = function (mapPin, mapPopup) {
    var i = window.pins.currentPinNumber;
    mapPin[i].classList.remove('map__pin--active');
    mapPopup[i].classList.add('hidden');
    window.pins.currentPinNumber = -1;
  };

})();

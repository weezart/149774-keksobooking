'use strict';

(function () {
  var onPopupCloseEnterPress = function (evt) {
    window.utils.isEnterEvent(evt, closePopup);
  };

  var onPopupEscPress = function (evt) {
    window.utils.isEscEvent(evt, closePopup);
  };

  var closePopup = function () {
    if (window.pins.currentPinNumber >= 0) {
      window.closeCard();
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  var onPopupClickClose = function () {
    document.addEventListener('keydown', onPopupEscPress);
    var popupClose = window.map.cards[window.pins.currentPinNumber]
        .querySelector('.popup__close');
    popupClose.addEventListener('keydown', onPopupCloseEnterPress);
    popupClose.addEventListener('click', function () {
      closePopup();
    });
  };

  window.showCard = function () {
    if (window.pins.currentPinNumber >= 0) {
      window.map.pins[window.pins.currentPinNumber]
        .classList.add('map__pin--active');
      window.map.cards[window.pins.currentPinNumber]
          .classList.remove('hidden');
      onPopupClickClose();
    }
  };

  window.closeCard = function () {
    window.map.pins[window.pins.currentPinNumber]
        .classList.remove('map__pin--active');
    window.map.cards[window.pins.currentPinNumber]
        .classList.add('hidden');
    window.pins.currentPinNumber = -1;
  };

})();

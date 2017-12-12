'use strict';

(function () {
  var mapActive = false;
  var mapPin = [];
  var mapPopup = [];
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mainMapPin = document.querySelector('.map__pin--main');

  var mapHandlersInit = function () {
    var onPopupEscPress = function (evt) {
      window.utils.isEscEvent(evt, closePopup);
    };

    var onPopupCloseEnterPress = function (evt) {
      window.utils.isEnterEvent(evt, closePopup);
    };

    var openPopup = function () {
      if (window.pins.currentPinNumber >= 0) {
        mapPin[window.pins.currentPinNumber].classList.add('map__pin--active');
        mapPopup[window.pins.currentPinNumber].classList.remove('hidden');
        onPopupClickClose();
      }
    };

    var closePopup = function () {
      if (window.pins.currentPinNumber >= 0) {
        mapPin[window.pins.currentPinNumber].classList.remove('map__pin--active');
        mapPopup[window.pins.currentPinNumber].classList.add('hidden');
        window.pins.currentPinNumber = -1;
        document.removeEventListener('keydown', onPopupEscPress);
      }
    };

    var onPopupClickClose = function () {
      document.addEventListener('keydown', onPopupEscPress);
      var popupClose = mapPopup[window.pins.currentPinNumber]
          .querySelector('.popup__close');
      popupClose.addEventListener('keydown', onPopupCloseEnterPress);
      popupClose.addEventListener('click', function () {
        closePopup();
      });
    };

    var pageActivation = function () {
      var noticeForm = document.querySelector('.notice__form');
      var fieldNoticeForm = noticeForm.querySelectorAll('.notice__form fieldset');
      map.classList.remove('map--faded');
      noticeForm.classList.remove('notice__form--disabled');

      for (var i = 0; i < fieldNoticeForm.length; i++) {
        fieldNoticeForm[i].disabled = false;
      }

      var pins = window.data.getPinsInfo();

      window.pins.add(mapPin, pins);
      window.cards.add(mapPopup, pins);
    };

    var firstActivation = function () {
      pageActivation();
      mapActive = true;

      mapPins.addEventListener('click', function (evt) {
        window.pins.find(evt.target, mapPin, mapPopup);
        openPopup();
      });

      mapPins.addEventListener('keydown', function (evt) {
        window.utils.isEnterEvent(evt, function () {
          window.pins.find(evt.target, mapPin, mapPopup);
          openPopup();
        });
      });
    };

    mainMapPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      var mainPinCoord = window.pins.getMainCoord();
      if (mainPinCoord.coordY < 100) {
        startCoords.y = 100;
        shift.y = 0;
        mainMapPin.style.top = '20px';
      } else if (mainPinCoord.coordY > 500) {
        startCoords.y = 500;
        shift.y = 0;
        mainMapPin.style.top = '420px';
      } else {
        mainMapPin.style.top = (mainMapPin.offsetTop - shift.y) + 'px';
      }

      address.value = mainPinCoord.coordX + ', ' + mainPinCoord.coordY;
      mainMapPin.style.left = (mainMapPin.offsetLeft - shift.x) + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

    mainMapPin.addEventListener('mouseup', function () {
      if (!mapActive) {
        firstActivation();
      }
    });
  };

  mapHandlersInit();
})();


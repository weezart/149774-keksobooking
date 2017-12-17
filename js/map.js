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

    var openPopup = function (evt) {
      window.showCard(evt.target, mapPin, mapPopup);
      if (window.pins.currentPinNumber >= 0) {
        onPopupClickClose();
      }
    };

    var closePopup = function () {
      if (window.pins.currentPinNumber >= 0) {
        window.closeCard(mapPin, mapPopup);
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

      var pins = [];
      var onSuccessLoad = function (data) {
        pins = data;
        window.pins.add(mapPin, pins);
        window.cards.add(mapPopup, pins);
        firstActivation();
        window.showCard(pins[0], mapPin, mapPopup);
        onPopupClickClose();
      };

      window.backend.load(onSuccessLoad, window.backend.onError);
    };

    var firstActivation = function () {
      mapActive = true;

      mapPins.addEventListener('click', function (evt) {
        openPopup(evt);
      });

      mapPins.addEventListener('keydown', function (evt) {
        window.utils.isEnterEvent(evt, function () {
          openPopup(evt);
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

        var currentY = mainMapPin.offsetTop - shift.y;
        var currentX = mainMapPin.offsetLeft - shift.x;
        var validCoord = window.pins.validateCoord(currentX, currentY);

        mainMapPin.style.top = validCoord.y + 'px';
        mainMapPin.style.left = validCoord.x + 'px';

        var mainPinCoord = window.pins.getMainPinCoord(validCoord.x, validCoord.y);
        window.form.setAddress(mainPinCoord.x + ', ' + mainPinCoord.y);
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
        pageActivation();
      }
    });
  };

  mapHandlersInit();
})();


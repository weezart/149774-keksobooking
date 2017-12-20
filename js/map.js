'use strict';

(function () {
  var mapActive = false;
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mainMapPin = document.querySelector('.map__pin--main');

  var mapHandlersInit = function () {

    var openPopup = function (evt) {
      window.pins.find(evt.target, window.showCard);
    };

    var pageActivation = function () {
      var noticeForm = document.querySelector('.notice__form');
      var fieldNoticeForm = noticeForm.querySelectorAll('.notice__form fieldset');
      map.classList.remove('map--faded');
      noticeForm.classList.remove('notice__form--disabled');

      for (var i = 0; i < fieldNoticeForm.length; i++) {
        fieldNoticeForm[i].disabled = false;
      }

      window.map.fill(window.map.data);

      mapActive = true;
    };

    var popupActivation = function () {
      mapPins.addEventListener('click', function (evt) {
        openPopup(evt);
      });

      mapPins.addEventListener('keydown', function (evt) {
        window.utils.isEnterEvent(evt, function () {
          openPopup(evt);
        });
      });
    };

    window.map = {
      data: [],
      pins: [],
      cards: [],
      clean: function () {
        for (var i = 0; i < window.map.pins.length; i++) {
          window.map.pins[i].remove();
          window.map.cards[i].remove();
        }
        window.map.pins.length = 0;
        window.map.cards.length = 0;
      },
      fill: function (data) {
        window.pins.add(data.slice(0, 5));
        window.cards.add(data.slice(0, 5));
        window.showCard();
      }
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

    popupActivation();
    mainMapPin.addEventListener('mouseup', function () {
      if (!mapActive) {
        pageActivation();
      }
    });

    var onSuccessLoad = function (data) {
      window.map.data = data;
    };

    window.backend.load(onSuccessLoad, window.backend.onError);

  };

  mapHandlersInit();
  window.filters.init();
})();


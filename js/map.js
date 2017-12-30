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

    var activatePage = function () {
      var noticeForm = document.querySelector('.notice__form');
      var fieldNoticeForm = noticeForm.querySelectorAll('.notice__form fieldset');
      map.classList.remove('map--faded');
      noticeForm.classList.remove('notice__form--disabled');

      [].forEach.call(fieldNoticeForm, function (field) {
        field.disabled = false;
      });

      window.map.fill(window.map.data);
      mapActive = true;
    };

    var activatePopup = function () {
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

        window.utils.debounce(window.map.sortBydistance);

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    activatePopup();
    mainMapPin.addEventListener('mouseup', function () {
      if (!mapActive) {
        activatePage();
      }
    });

    var onSuccessLoad = function (data) {
      window.map.data = data;
    };

    window.backend.load(onSuccessLoad, window.backend.onError);

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
    sortBydistance: function () {
      var tempCoord = {
        x: mainMapPin.offsetLeft,
        y: mainMapPin.offsetTop
      };

      var coord = window.pins.getMainPinCoord(tempCoord.x, tempCoord.y);

      window.map.data.sort(function (first, second) {
        var firstDistance =
            window.pins.getDistance(coord.x, coord.y, first.location.x, first.location.y);
        var secondDistance =
            window.pins.getDistance(coord.x, coord.y, second.location.x, second.location.y);
        if (firstDistance > secondDistance) {
          return 1;
        } else if (firstDistance < secondDistance) {
          return -1;
        } else {
          return 0;
        }
      });

      window.map.clean();
      window.map.fill(window.map.data);
    },
    fill: function (data) {
      window.pins.add(data.slice(0, 5));
      window.cards.add(data.slice(0, 5));
      window.showCard();
    }
  };

  mapHandlersInit();
  window.filters.init();
})();

